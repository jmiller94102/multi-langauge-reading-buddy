/**
 * Classroom S2 Service - Real-time classroom session management
 * Uses S2.dev REST API for serverless streaming infrastructure
 */

class ClassroomS2Service {
  constructor() {
    // S2.dev REST API configuration
    // Account-level: https://aws.s2.dev (for creating basins)
    // Basin-level: https://{basin}.b.aws.s2.dev (for records/streams)
    this.accountBasePath = process.env.S2_ACCOUNT_BASE_PATH || 'https://aws.s2.dev';
    this.accessToken = process.env.S2_ACCESS_TOKEN;
    this.basinName = 'lingo-app';

    if (!this.accessToken) {
      console.error('[ClassroomS2Service] ERROR: S2_ACCESS_TOKEN not found in environment variables');
    }

    // In-memory session storage (MVP - will be replaced with database later)
    this.sessions = new Map();

    console.log('[ClassroomS2Service] Initialized with S2 REST API');
    console.log('[ClassroomS2Service] Account endpoint:', this.accountBasePath);
    console.log('[ClassroomS2Service] Basin name:', this.basinName);
  }

  /**
   * Make authenticated request to S2 API
   * @private
   */
  async _s2Request(method, path, body = null, useBasinEndpoint = false, basinName = null) {
    // Choose the correct base path
    let basePath = this.accountBasePath;
    if (useBasinEndpoint && basinName) {
      basePath = `https://${basinName}.b.aws.s2.dev`;
    }

    const url = `${basePath}${path}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`[ClassroomS2Service] ${method} ${url}`);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`S2 API error (${response.status}): ${errorText}`);
    }

    // Some endpoints may not return JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return { success: true };
  }

  /**
   * Create a new classroom session (stream auto-created on first append/read)
   * @param {string} classroomId - Unique classroom identifier
   * @param {string} sessionId - Unique session identifier
   * @param {Object} metadata - Session metadata (teacherId, storyId, studentIds, etc.)
   * @returns {Promise<Object>} Session object
   */
  async createSession(classroomId, sessionId, metadata) {
    try {
      const streamName = `session-${sessionId}`;

      console.log(`[ClassroomS2Service] Creating session - Basin: ${this.basinName}, Stream: ${streamName} (auto-created on first append)`);

      // Store session metadata
      // Note: Stream will be auto-created by S2 on first append or read
      const session = {
        classroomId,
        sessionId,
        basinName: this.basinName,
        streamName,
        metadata,
        createdAt: Date.now(),
        students: new Map(),
      };

      this.sessions.set(sessionId, session);

      console.log(`[ClassroomS2Service] Session created: ${sessionId}`);

      return {
        success: true,
        sessionId,
        basinName: this.basinName,
        streamName,
        createdAt: session.createdAt,
      };
    } catch (error) {
      console.error('[ClassroomS2Service] Error creating session:', error);
      throw error;
    }
  }

  /**
   * Update student progress in a session (append record to stream)
   * @param {string} sessionId - Session identifier
   * @param {Object} progressUpdate - Progress update data
   * @returns {Promise<Object>} Update result
   */
  async updateProgress(sessionId, progressUpdate) {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      const { studentId, progress, currentParagraph, status, eventType, studentName } = progressUpdate;

      // Determine event type (student_join or progress_update)
      const type = eventType || 'progress_update';

      console.log(`[ClassroomS2Service] ${type} for ${studentId} in session ${sessionId}${type === 'progress_update' ? `: ${progress}%` : ''}`);

      // Prepare record to append
      const record = {
        body: JSON.stringify({
          type,
          sessionId,
          studentId,
          studentName: studentName || studentId,
          progress: progress || 0,
          currentParagraph: currentParagraph || 0,
          status: status || 'idle',
          timestamp: Date.now(),
        })
      };

      // Append record to S2 stream via REST API
      // POST /v1/streams/{stream}/records (basin-level endpoint)
      await this._s2Request('POST', `/v1/streams/${session.streamName}/records`, {
        records: [record]
      }, true, session.basinName);

      // Update in-memory student state
      session.students.set(studentId, {
        studentId,
        studentName: studentName || studentId,
        progress: progress || 0,
        currentParagraph: currentParagraph || 0,
        status: status || 'idle',
        lastUpdate: Date.now(),
      });

      return {
        success: true,
        sessionId,
        studentId,
        progress: progress || 0,
      };
    } catch (error) {
      console.error('[ClassroomS2Service] Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Subscribe to session updates via Server-Sent Events (SSE)
   * Note: This is called from the SSE route handler which manages the connection
   * @param {string} sessionId - Session identifier
   * @param {Function} callback - Callback function for each event
   * @returns {Promise<Function>} Unsubscribe function
   */
  async subscribeToSession(sessionId, callback) {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      console.log(`[ClassroomS2Service] Subscribing to session: ${sessionId} via SSE`);

      let lastSeqNum = 0;
      let active = true;
      let abortController = new AbortController();

      // Helper function to parse SSE stream
      const parseSSEStream = async (response) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let chunkCount = 0;

        console.log(`[ClassroomS2Service] Starting SSE stream parsing for session ${sessionId}`);

        while (active) {
          const { done, value } = await reader.read();

          if (done) {
            console.log(`[ClassroomS2Service] SSE stream ended for session ${sessionId} (total chunks: ${chunkCount})`);
            break;
          }

          chunkCount++;

          // Decode chunk and add to buffer
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          console.log(`[ClassroomS2Service] Received SSE chunk ${chunkCount} (${chunk.length} bytes) for session ${sessionId}`);

          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          let eventType = null;
          let eventData = '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.substring(6).trim();
              console.log(`[ClassroomS2Service] SSE event type: ${eventType}`);
            } else if (line.startsWith('data:')) {
              eventData += line.substring(5).trim();
            } else if (line === '' && eventData) {
              // End of event, process it
              console.log(`[ClassroomS2Service] Processing SSE event: type=${eventType}, data length=${eventData.length}`);

              try {
                if (eventType === 'batch') {
                  const batch = JSON.parse(eventData);
                  console.log(`[ClassroomS2Service] Batch event received with ${batch.records?.length || 0} records`);

                  // Process records in the batch
                  if (batch.records && batch.records.length > 0) {
                    for (const record of batch.records) {
                      try {
                        const data = JSON.parse(record.body);
                        console.log(`[ClassroomS2Service] Calling callback with record: type=${data.type}, studentId=${data.studentId}`);
                        callback(data);
                        lastSeqNum = Math.max(lastSeqNum, record.seqNum || 0);
                      } catch (e) {
                        console.error('[ClassroomS2Service] Error parsing record body:', e.message);
                      }
                    }
                  }
                } else if (eventType === 'ping') {
                  // Keepalive ping - just log it
                  console.log(`[ClassroomS2Service] SSE ping received for session ${sessionId}`);
                } else if (eventType === 'error') {
                  console.error(`[ClassroomS2Service] SSE error event for session ${sessionId}:`, eventData);
                } else {
                  console.warn(`[ClassroomS2Service] Unknown SSE event type: ${eventType}`);
                }
              } catch (e) {
                console.error('[ClassroomS2Service] Error processing SSE event:', e.message, 'eventData:', eventData.substring(0, 200));
              }

              // Reset for next event
              eventType = null;
              eventData = '';
            }
          }
        }
        console.log(`[ClassroomS2Service] SSE stream parsing ended for session ${sessionId}`);
      };

      // Start SSE connection in background
      const connectSSE = async () => {
        while (active) {
          try {
            // Build SSE URL with wait parameter for long-lived connection
            const basePath = `https://${session.basinName}.b.aws.s2.dev`;
            const url = `${basePath}/v1/streams/${session.streamName}/records?minSeqNum=${lastSeqNum + 1}&wait=3600`;

            console.log(`[ClassroomS2Service] Connecting to SSE: ${url}`);

            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache'
              },
              signal: abortController.signal
            });

            console.log(`[ClassroomS2Service] SSE response status: ${response.status}, content-type: ${response.headers.get('content-type')}`);

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`[ClassroomS2Service] SSE connection failed with status ${response.status}:`, errorText);
              throw new Error(`SSE connection failed (${response.status}): ${errorText}`);
            }

            // Check if we actually got an SSE stream
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('text/event-stream')) {
              console.warn(`[ClassroomS2Service] Expected SSE but got content-type: ${contentType}`);
            }

            console.log(`[ClassroomS2Service] SSE connection established, starting to parse stream...`);

            // Parse the SSE stream
            await parseSSEStream(response);

            // If we get here, stream ended normally - reconnect after a short delay
            if (active) {
              console.log(`[ClassroomS2Service] SSE connection closed, reconnecting in 1s...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log(`[ClassroomS2Service] SSE connection aborted for session ${sessionId}`);
              break;
            }

            console.error(`[ClassroomS2Service] SSE error for session ${sessionId}:`, error.message);
            console.error(`[ClassroomS2Service] Error stack:`, error.stack);

            // Reconnect after error (exponential backoff could be added here)
            if (active) {
              console.log(`[ClassroomS2Service] Reconnecting after error in 2s...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        console.log(`[ClassroomS2Service] SSE connection loop ended for session ${sessionId}`);
      };

      // Start SSE connection (non-blocking)
      console.log(`[ClassroomS2Service] Starting SSE connection in background...`);
      connectSSE().catch(error => {
        console.error(`[ClassroomS2Service] Fatal SSE error for session ${sessionId}:`, error.message);
        console.error(`[ClassroomS2Service] Fatal error stack:`, error.stack);
      });

      // Return unsubscribe function
      return () => {
        console.log(`[ClassroomS2Service] Unsubscribing from session: ${sessionId}`);
        active = false;
        abortController.abort();
      };
    } catch (error) {
      console.error('[ClassroomS2Service] Error subscribing to session:', error);
      throw error;
    }
  }

  /**
   * Get session details
   * @param {string} sessionId - Session identifier
   * @returns {Object|null} Session object or null if not found
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    return {
      sessionId: session.sessionId,
      classroomId: session.classroomId,
      basinName: session.basinName,
      streamName: session.streamName,
      metadata: session.metadata,
      createdAt: session.createdAt,
      students: Array.from(session.students.values()),
    };
  }

  /**
   * End a classroom session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} End session result
   */
  async endSession(sessionId) {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      console.log(`[ClassroomS2Service] Ending session: ${sessionId}`);

      // Append session end event to S2 stream
      const endRecord = {
        body: JSON.stringify({
          type: 'session_end',
          sessionId,
          timestamp: Date.now(),
        })
      };

      await this._s2Request('POST', `/v1/streams/${session.streamName}/records`, {
        records: [endRecord]
      }, true, session.basinName);

      // Remove from in-memory storage
      this.sessions.delete(sessionId);

      return {
        success: true,
        sessionId,
        endedAt: Date.now(),
      };
    } catch (error) {
      console.error('[ClassroomS2Service] Error ending session:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new ClassroomS2Service();