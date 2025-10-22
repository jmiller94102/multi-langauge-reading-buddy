/**
 * Retry utility for API calls with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatuses?: number[];
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

/**
 * Delay helper for exponential backoff
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate delay with exponential backoff
 */
const calculateDelay = (attempt: number, options: Required<RetryOptions>): number => {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt);
  return Math.min(exponentialDelay, options.maxDelay);
};

/**
 * Check if error is retryable
 */
const isRetryable = (error: any, options: Required<RetryOptions>): boolean => {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return true;
  }

  // HTTP status codes
  if (error.status && options.retryableStatuses.includes(error.status)) {
    return true;
  }

  // Azure OpenAI specific errors
  if (error.code === 'rate_limit_exceeded' || error.code === 'server_error') {
    return true;
  }

  return false;
};

/**
 * Retry a function with exponential backoff
 *
 * @example
 * const result = await retryWithBackoff(
 *   () => fetch('/api/data'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Don't retry if error is not retryable
      if (!isRetryable(error, opts)) {
        break;
      }

      // Calculate delay and notify
      const delayMs = calculateDelay(attempt, opts);
      opts.onRetry(attempt + 1, error);

      console.warn(
        `Retry attempt ${attempt + 1}/${opts.maxRetries} after ${delayMs}ms`,
        error
      );

      // Wait before retrying
      await delay(delayMs);
    }
  }

  throw lastError!;
}

/**
 * Fetch with automatic retry
 *
 * @example
 * const response = await fetchWithRetry('/api/story', {
 *   method: 'POST',
 *   body: JSON.stringify({ prompt: 'Generate story' })
 * });
 */
export async function fetchWithRetry(
  url: string,
  fetchOptions: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return retryWithBackoff(async () => {
    const response = await fetch(url, fetchOptions);

    // Throw error for non-ok responses
    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;

      // Try to parse error body
      try {
        const errorBody = await response.json();
        error.code = errorBody.error?.code || errorBody.code;
        error.message = errorBody.error?.message || errorBody.message || error.message;
      } catch {
        // Ignore JSON parse errors
      }

      throw error;
    }

    return response;
  }, retryOptions);
}
