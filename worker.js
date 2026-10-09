self.onmessage = async (e) => {
  const { type, serverUrl } = e.data;

  if (type === 'download') {
    const startTime = performance.now();
    let receivedBytes = 0;

    try {
      const response = await fetch(`${serverUrl}/download?t=${Date.now()}`, {
        mode: 'cors',
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedBytes += value.byteLength;
        const durationSec = (performance.now() - startTime) / 1000;

        if (durationSec > 0.2) {
          const mbps = ((receivedBytes * 8) / (durationSec * 1024 * 1024)).toFixed(2);
          self.postMessage({ type: 'progress', mbps });
        }
      }
    } catch (err) {
      self.postMessage({ type: 'error', message: err.message });
    }
  }
};