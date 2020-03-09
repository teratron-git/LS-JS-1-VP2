const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                data = JSON.parse(data);
                console.log(data);
                console.log(data.message);
                client.send(`${data.name} (${data.nick}): ${data.message}`);
            }
        });
    });
});