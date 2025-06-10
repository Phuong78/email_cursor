import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function LogSSH() {
  const xtermRef = useRef(null);
  const xtermDivRef = useRef(null);
  const [ws, setWs] = useState(null);

  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // THAY ĐỔI: Bỏ serverList, dùng state cho từng ô input
  const [targetHost, setTargetHost] = useState('');
  const [user, setUser] = useState('admin'); // Gợi ý user mặc định là 'admin'
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Khởi tạo terminal (xterm.js)
    if (!xtermRef.current && xtermDivRef.current) {
      const term = new Terminal({ fontSize: 14, cursorBlink: true, convertEol: true });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(xtermDivRef.current);
      fitAddon.fit();
      const resizeListener = () => fitAddon.fit();
      window.addEventListener('resize', resizeListener);
      xtermRef.current = term;
      return () => { window.removeEventListener('resize', resizeListener); };
    }
  }, []);

  useEffect(() => {
    // Xử lý các sự kiện của WebSocket
    if (ws && xtermRef.current) {
      const term = xtermRef.current;
      ws.onopen = () => {
        setConnected(true);
        setIsConnecting(false);
        // Sau khi kết nối WebSocket thành công, gửi thông tin đăng nhập SSH
        ws.send(JSON.stringify({ host: targetHost, user, password }));
        term.focus();
      };
      
      ws.onmessage = (event) => term.write(event.data);
      ws.onclose = () => {
        term.write('\r\n\r\n--- Đã ngắt kết nối --- \r\n');
        setConnected(false); 
        setIsConnecting(false); 
        setWs(null);
      };
      ws.onerror = (error) => {
        console.error('Lỗi WebSocket:', error);
        term.write('\r\n\r\n--- Lỗi kết nối WebSocket, hãy kiểm tra lại IP của proxy server và đảm bảo nó đang chạy --- \r\n');
        setConnected(false); 
        setIsConnecting(false);
      };
      
      const onDataDisposable = term.onData(data => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      });
      return () => { onDataDisposable.dispose(); };
    }
  }, [ws, targetHost, user, password]);

  const handleConnect = () => {
    if (!targetHost || !user || !password) {
      alert('Vui lòng nhập đủ Địa chỉ IP, User và Password.');
      return;
    }
    setIsConnecting(true);
    if (xtermRef.current) xtermRef.current.clear();

    // =================================================================
    // SỬA LỖI QUAN TRỌNG NHẤT
    // Kết nối WebSocket LUÔN LUÔN đến địa chỉ của proxy server (ssh-proxy.js)
    // =================================================================
    const proxyHost = process.env.REACT_APP_PROXY_SERVER_IP;
    if (!proxyHost) {
        alert('Lỗi: Không tìm thấy IP của server proxy. Vui lòng kiểm tra file .env và biến REACT_APP_PROXY_SERVER_IP');
        setIsConnecting(false);
        return;
    }

    const socketUrl = `ws://${proxyHost}:8081/ssh`;
    const socket = new WebSocket(socketUrl);
    setWs(socket);
  };

  const handleDisconnect = () => {
    if (ws) ws.close();
  };

  return (
    <div>
      <h2>Nhật ký thao tác & SSH</h2>
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* THAY ĐỔI: Dùng ô input thay cho dropdown */}
        <input value={targetHost} onChange={e => setTargetHost(e.target.value)} placeholder="Nhập địa chỉ IP đích" required style={{ flex: '2 1 200px', padding: '8px' }} />
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="User" required style={{ flex: '1 1 100px', padding: '8px' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ flex: '1 1 150px', padding: '8px' }} />
        
        {!connected ? (
          <button onClick={handleConnect} disabled={isConnecting} style={{ padding: '8px 12px' }}>
            {isConnecting ? 'Đang kết nối...' : 'Kết nối SSH'}
          </button>
        ) : (
          <button onClick={handleDisconnect} style={{ padding: '8px 12px' }}>Ngắt kết nối</button>
        )}
      </div>
      <div ref={xtermDivRef} id="xterm-container" style={{ width: '100%', minHeight: 400, background: '#000' }}></div>
    </div>
  );
}