import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// =================================================================
// BẠN HÃY CẬP NHẬT DANH SÁCH NÀY VỚI IP PUBLIC CỦA CÁC SERVER KHÁCH HÀNG
const serverList = [
  // Ví dụ:
  //{ name: 'Máy chủ Khách hàng 01', ip: '3.91.186.154' },
  { name: 'Máy chủ Khách hàng 01', ip: '44.212.62.157' },
  // Bạn có thể thêm các server khác vào đây
  { name: 'Máy chủ Chính (Nagios/Jenkins)', ip: process.env.REACT_APP_NAGIOS_IP || '' },
];
// =================================================================

export default function LogSSH() {
  const xtermRef = useRef(null);
  const xtermDivRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [selectedServer, setSelectedServer] = useState('');
  const [user, setUser] = useState('testuser');
  const [password, setPassword] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
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
    if (ws && xtermRef.current) {
      const term = xtermRef.current;
      ws.onopen = () => {
        setConnected(true);
        setIsConnecting(false);
        // Gửi thông tin đăng nhập với server đã chọn
        ws.send(JSON.stringify({ host: selectedServer, user, password }));
        term.focus();
      };
      
      ws.onmessage = (event) => term.write(event.data);
      ws.onclose = () => {
        term.write('\r\n\r\n--- Đã ngắt kết nối SSH ---\r\n');
        setConnected(false); 
        setIsConnecting(false); 
        setWs(null);
      };
      ws.onerror = (error) => {
        console.error('Lỗi WebSocket:', error);
        term.write('\r\n\r\n--- Lỗi kết nối WebSocket ---\r\n');
        setConnected(false); 
        setIsConnecting(false);
      };
      const onDataDisposable = term.onData(data => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      });
      return () => { onDataDisposable.dispose(); };
    }
  }, [ws, selectedServer, user, password]);

  const handleConnect = () => {
    if (!selectedServer || !user || !password) {
      alert('Vui lòng chọn Server, điền User và Password.');
      return;
    }
    setIsConnecting(true);
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
    // Proxy luôn chạy trên server chính, có IP được lấy từ biến môi trường
    const proxyHost = process.env.REACT_APP_NAGIOS_IP;
    if (!proxyHost) {
        alert('Lỗi: Không tìm thấy IP của server proxy. Vui lòng kiểm tra file .env');
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
        
        <select 
          value={selectedServer} 
          onChange={e => setSelectedServer(e.target.value)} 
          style={{ flex: '2 1 250px', padding: '5px' }}
          required
        >
          <option value="">-- Chọn Server để kết nối --</option>
          {serverList.map(server => (
            // Lọc ra các server không có IP để tránh lỗi
            server.ip && <option key={server.ip} value={server.ip}>{server.name} ({server.ip})</option>
          ))}
        </select>
        
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="User" required style={{ flex: '1 1 100px' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ flex: '1 1 150px' }} />
        
        {!connected ? (
          <button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? 'Đang kết nối...' : 'Kết nối SSH'}
          </button>
        ) : (
          <button onClick={handleDisconnect}>Ngắt kết nối</button>
        )}
      </div>
      <div ref={xtermDivRef} id="xterm-container" style={{ width: '100%', height: 500, background: '#000' }}></div>
    </div>
  );
}