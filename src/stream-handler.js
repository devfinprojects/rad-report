/**
 * Stream Handler Module - AI Response Streaming
 * Part of RadReport AI Integration
 */

/**
 * Creates a streaming response handler
 * @param {Object} options - Stream options
 * @returns {Object} Stream handler
 */
export function createStreamHandler(options = {}) {
  const {
    bufferSize = 1,
    delimiter = '',
    onChunk,
    onComplete,
    onError
  } = options;

  let buffer = '';
  let chunks = [];
  let isActive = true;

  return {
    /**
     * Process a chunk of text
     * @param {string} text - Text chunk
     */
    process(text) {
      if (!isActive) return;

      buffer += text;
      chunks.push(text);

      if (onChunk) {
        onChunk(text, {
          buffer: buffer,
          totalChunks: chunks.length
        });
      }
    },

    /**
     * Complete the stream
     * @returns {string} Complete text
     */
    complete() {
      isActive = false;

      const result = buffer;

      if (onComplete) {
        onComplete(result, {
          totalChunks: chunks.length,
          totalLength: result.length
        });
      }

      return result;
    },

    /**
     * Handle an error
     * @param {Error} error - Error object
     */
    error(error) {
      isActive = false;

      if (onError) {
        onError(error, {
          partialText: buffer,
          chunksReceived: chunks.length
        });
      }
    },

    /**
     * Get current buffer
     * @returns {string} Current buffer
     */
    getBuffer() {
      return buffer;
    },

    /**
     * Get chunk count
     * @returns {number} Number of chunks
     */
    getChunkCount() {
      return chunks.length;
    },

    /**
     * Reset the handler
     */
    reset() {
      buffer = '';
      chunks = [];
      isActive = true;
    }
  };
}

/**
 * Creates aReadableStream for AI response
 * @param {AsyncGenerator} generator - Async generator
 * @returns {ReadableStream} Readable stream
 */
export function createReadableStream(generator) {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      // Handle cancellation
    }
  });
}

/**
 * Parses SSE (Server-Sent Events) stream
 * @param {ReadableStream} stream - Readable stream
 * @returns {AsyncGenerator} SSE events
 */
export async function* parseSSEStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim();
          
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            yield parsed;
          } catch (e) {
            // Yield raw text if not JSON
            yield data;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Creates streaming response
 * @param {AsyncGenerator} generator - Content generator
 * @param {Object} options - Response options
 * @returns {Response} HTTP response
 */
export function createStreamingResponse(generator, options = {}) {
  const {
    status = 200,
    headers = {}
  } = options;

  const stream = createReadableStream(generator);

  return new Response(stream, {
    status,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...headers
    }
  });
}

/**
 * Handles AI stream with callbacks
 * @param {Object} client - AI client
 * @param {Object} request - Request with prompt
 * @param {Object} callbacks - Callback functions
 * @returns {Object} Response
 */
export async function handleStreamRequest(client, request, callbacks = {}) {
  const {
    onStart,
    onChunk,
    onComplete,
    onError
  } = callbacks;

  try {
    if (onStart) onStart();

    const stream = await client.createStream(request);
    const handler = createStreamHandler({
      onChunk: (text, meta) => {
        if (onChunk) onChunk(text, meta);
      },
      onComplete: (text, meta) => {
        if (onComplete) onComplete(text, meta);
      },
      onError: (error, meta) => {
        if (onError) onError(error, meta);
      }
    });

    for await (const chunk of stream) {
      handler.process(chunk);
    }

    return handler.complete();
  } catch (error) {
    handler.error(error);
    throw error;
  }
}

/**
 * Buffers stream and sends in chunks
 * @param {AsyncGenerator} generator - Generator
 * @param {number} chunkSize - Size of chunks
 * @returns {AsyncGenerator} Chunked generator
 */
export async function* bufferStream(generator, chunkSize = 100) {
  let buffer = '';

  for await (const chunk of generator) {
    buffer += chunk;

    while (buffer.length >= chunkSize) {
      yield buffer.slice(0, chunkSize);
      buffer = buffer.slice(chunkSize);
    }
  }

  if (buffer.length > 0) {
    yield buffer;
  }
}

/**
 * Creates SSE formatted response
 * @param {AsyncGenerator} generator - Content generator
 * @returns {AsyncGenerator} SSE formatted
 */
export async function* formatSSE(generator) {
  for await (const chunk of generator) {
    yield `data: ${JSON.stringify({ content: chunk })}\n\n`;
  }
  yield 'data: [DONE]\n\n';
}

export default {
  createStreamHandler,
  createReadableStream,
  parseSSEStream,
  createStreamingResponse,
  handleStreamRequest,
  bufferStream,
  formatSSE
};