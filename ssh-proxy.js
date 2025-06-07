const WebSocket = require('ws');
const { Client } = require('ssh2');

const wss = new WebSocket.Server({ port: 8081, path: '/ssh' });

wss.on('connection', function connection(ws) {
  let sshClient = null;
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      if (data.host && data.user && data.password) {
        sshClient = new Client();
        sshClient.on('ready', () => {
          ws.send('\r\n*** SSH Connected! ***\r\n');
          sshClient.shell((err, stream) => {
            if (err) {
              ws.send('\r\n*** SSH Shell error ***\r\n');
              return;
            }
            ws.on('message', (msg) => {
              if (typeof msg === 'string' && !msg.startsWith('{')) {
                stream.write(msg);
              }
            });
            stream.on('data', (data) => ws.send(data.toString('utf8')));
            stream.on('close', () => {
              sshClient.end();
              ws.close();
            });
          });
        }).on('error', (err) => {
          ws.send('\r\n*** SSH Connection error: ' + err.message + ' ***\r\n');
          ws.close();
        }).connect({
          host: data.host,
          port: 22,
          username: data.user,
          password: data.password,
        });
      }
    } catch (e) {
      // ignore
    }
  });
  ws.on('close', () => {
    if (sshClient) sshClient.end();
  });
});

console.log('SSH WebSocket proxy running on ws://localhost:8081/ssh'); 