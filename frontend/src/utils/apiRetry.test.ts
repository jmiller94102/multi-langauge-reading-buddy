import { describe, it, expect, vi, beforeEach } from 'vitest';
import { retryWithBackoff, fetchWithRetry } from './apiRetry';

describe('apiRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('retryWithBackoff', () => {
    it('returns result on first successful attempt', async () => {
      const successFn = vi.fn().mockResolvedValue('success');
      
      const result = await retryWithBackoff(successFn);
      
      expect(result).toBe('success');
      expect(successFn).toHaveBeenCalledTimes(1);
    });

    it('retries on failure and eventually succeeds', async () => {
      const error1 = new Error('Fail 1');
      (error1 as any).status = 500;
      const error2 = new Error('Fail 2');
      (error2 as any).status = 500;
      
      const fn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { maxRetries: 3, initialDelay: 10 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('throws error after max retries exceeded', async () => {
      const error = new Error('Always fails');
      (error as any).status = 500;
      
      const fn = vi.fn().mockRejectedValue(error);

      await expect(
        retryWithBackoff(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow('Always fails');
      
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('does not retry non-retryable errors', async () => {
      const nonRetryableError = new Error('Bad request');
      (nonRetryableError as any).status = 400;
      
      const fn = vi.fn().mockRejectedValue(nonRetryableError);

      await expect(
        retryWithBackoff(fn, { maxRetries: 3 })
      ).rejects.toThrow('Bad request');
      
      expect(fn).toHaveBeenCalledTimes(1); // No retries for non-retryable
    });

    it('retries network errors', async () => {
      const networkError = new TypeError('Failed to fetch');
      const fn = vi.fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { maxRetries: 2 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('retries retryable status codes', async () => {
      const retryableStatuses = [408, 429, 500, 502, 503, 504];
      
      for (const status of retryableStatuses) {
        const error = new Error(`Status ${status}`);
        (error as any).status = status;
        
        const fn = vi.fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValue('success');

        const result = await retryWithBackoff(fn, { maxRetries: 1, initialDelay: 10 });
        expect(result).toBe('success');
      }
    });

    it('retries Azure OpenAI specific errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).code = 'rate_limit_exceeded';
      
      const fn = vi.fn()
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { maxRetries: 2 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('uses exponential backoff with correct delays', async () => {
      const error1 = new Error('Fail 1');
      (error1 as any).status = 500;
      const error2 = new Error('Fail 2');
      (error2 as any).status = 500;
      
      const fn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockResolvedValue('success');

      const startTime = Date.now();
      await retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelay: 100,
        backoffMultiplier: 2,
      });
      const endTime = Date.now();
      
      // Should wait: 100ms (first retry) + 200ms (second retry) = ~300ms
      // Allow some tolerance for execution time
      expect(endTime - startTime).toBeGreaterThanOrEqual(250);
      expect(endTime - startTime).toBeLessThan(500);
    });

    it('respects maxDelay cap', async () => {
      const error1 = new Error('Fail 1');
      (error1 as any).status = 500;
      const error2 = new Error('Fail 2');
      (error2 as any).status = 500;
      
      const fn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockResolvedValue('success');

      const startTime = Date.now();
      await retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelay: 1000,
        maxDelay: 100,
        backoffMultiplier: 10,
      });
      const endTime = Date.now();
      
      // Even though exponential delay would be huge, maxDelay should cap it at 100ms each
      expect(endTime - startTime).toBeLessThan(400);
    });

    it('calls onRetry callback for each retry', async () => {
      const error1 = new Error('Fail 1');
      (error1 as any).status = 500;
      const error2 = new Error('Fail 2');
      (error2 as any).status = 500;
      
      const onRetry = vi.fn();
      const fn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockResolvedValue('success');

      await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 10,
        onRetry,
      });
      
      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
      expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
    });

    it('handles custom retryable status codes', async () => {
      const error = new Error('Custom error');
      (error as any).status = 418; // I'm a teapot
      
      const fn = vi.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxRetries: 1,
        retryableStatuses: [418],
      });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchWithRetry', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('returns response on successful fetch', async () => {
      const mockResponse = { ok: true, status: 200 };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const response = await fetchWithRetry('/api/test');
      
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('throws error for non-ok response', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({ error: 'Not found' }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        fetchWithRetry('/api/test')
      ).rejects.toThrow('HTTP 404: Not Found');
    });

    it('retries on retryable status codes', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({}),
      };
      const mockSuccessResponse = { ok: true, status: 200 };
      
      (global.fetch as any)
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValue(mockSuccessResponse);

      const response = await fetchWithRetry('/api/test', {}, { maxRetries: 1, initialDelay: 10 });
      
      expect(response).toEqual(mockSuccessResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('includes error code from response body', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: vi.fn().mockResolvedValue({
          error: {
            code: 'rate_limit_exceeded',
            message: 'Rate limit hit',
          },
        }),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      try {
        await fetchWithRetry('/api/test', {}, { maxRetries: 0 });
      } catch (error: any) {
        expect(error.code).toBe('rate_limit_exceeded');
        expect(error.message).toBe('Rate limit hit');
      }
    });

    it('handles JSON parse errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await expect(
        fetchWithRetry('/api/test', {}, { maxRetries: 0 })
      ).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('passes fetch options correctly', async () => {
      const mockResponse = { ok: true, status: 200 };
      (global.fetch as any).mockResolvedValue(mockResponse);

      const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      };

      await fetchWithRetry('/api/test', fetchOptions);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', fetchOptions);
    });

    it('retries network failures', async () => {
      const mockSuccessResponse = { ok: true, status: 200 };
      
      (global.fetch as any)
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValue(mockSuccessResponse);

      const response = await fetchWithRetry('/api/test', {}, { maxRetries: 1, initialDelay: 10 });
      
      expect(response).toEqual(mockSuccessResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});