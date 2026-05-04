const API_BASE = import.meta.env.VITE_API_URL;

export function createSSEConnection(onMessage, onError) {
  const eventSource = new EventSource(`${API_BASE}/upload/sse`);

  eventSource.onopen = () => {
    console.log("SSE connected");
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (err) {
      console.error("Invalid SSE payload", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error", err);
    onError?.(err);
  };

  return eventSource;
}
