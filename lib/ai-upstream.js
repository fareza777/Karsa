function codedError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export async function fetchWithTimeout(fetchImpl, url, options = {}, timeoutMs, parentSignal) {
  const controller = new AbortController();
  const abortFromParent = () => {
    controller.abort(parentSignal.reason || new DOMException('Aborted', 'AbortError'));
  };

  if (parentSignal?.aborted) abortFromParent();
  else parentSignal?.addEventListener('abort', abortFromParent, { once: true });

  const timer = setTimeout(() => {
    controller.abort(codedError('AI upstream connection timed out', 'AI_CONNECT_TIMEOUT'));
  }, timeoutMs);

  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    parentSignal?.removeEventListener('abort', abortFromParent);
  }
}

export async function readWithIdleTimeout(reader, timeoutMs) {
  let timer;
  const idle = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(codedError('AI upstream stream became idle', 'AI_STREAM_IDLE'));
    }, timeoutMs);
  });

  try {
    return await Promise.race([reader.read(), idle]);
  } finally {
    clearTimeout(timer);
  }
}
