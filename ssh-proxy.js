const WebSocket = require('ws');
const { Client } = require('ssh2');

const wss = new WebSocket.Server({ port: 8081, path: '/ssh' });

wss.on('connection', function connection(ws) {
  let sshClient = null;
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);

      // THAY ĐỔI: Kiểm tra sự tồn tại của password thay vì privateKey
      if (data.host && data.user && data.password) {
        sshClient = new Client();
        sshClient.on('ready', () => {
          ws.send('\r\n*** SSH Connected! ***\r\n');
          sshClient.shell((err, stream) => {
            if (err) {
              ws.send('\r\n*** SSH Shell error ***\r\n');
              return;
            }
            // Lắng nghe dữ liệu từ client (terminal React)
            ws.on('message', (msg) => {
              // Đảm bảo không xử lý lại message chứa thông tin kết nối
              if (typeof msg === 'string' && !msg.startsWith('{')) {
                stream.write(msg);
              }
            });
            // Gửi dữ liệu từ server SSH về client
            stream.on('data', (data) => ws.send(data.toString('utf8')));
            stream.on('close', () => {
              sshClient.end();
              // ws.close(); // không nên close ở đây, để onclose của ws xử lý
            });
          });
        }).on('error', (err) => {
          ws.send('\r\n*** SSH Connection error: ' + err.message + ' ***\r\n');
          ws.close();
        }).connect({
          host: data.host,
          port: 22,
          username: data.user,
          // THAY ĐỔI: Dùng password để kết nối
          password: data.password, 
        });
      }
    } catch (e) {
      // Bỏ qua các message không phải JSON
    }
  });

  ws.on('close', () => {
    if (sshClient) sshClient.end();
  });
});

console.log('SSH WebSocket proxy is running on ws://<your-server-ip>:8081/ssh');