self.onmessage = async (e) => {
  const { type, serverUrl } = e.data;

  if (type === 'download') {
    const startTime = performance.now();
    let bytesReceived = 0;

    // Fetch stream without browser caching
    const response = await fetch(`${serverUrl}/download?t=${Math.random()}`);
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesReceived += value.byteLength;
      const durationInSeconds = (performance.now() - startTime) / 1000;

      // Ignore TCP slow-start (first 0.5s)
      if (durationInSeconds > 0.5) {
        const mbps = ((bytesReceived * 8) / (durationInSeconds * 1_000_000)).toFixed(2);
        self.postMessage({ type: 'progress', mbps });
      }
    }
    self.postMessage({ type: 'complete' });
  }
};