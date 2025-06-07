import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function LogSSH() {
  // Ref để lưu lại instance của terminal và DOM element
  const xtermRef = useRef(null);
  const xtermDivRef = useRef(null);

  // State để quản lý trạng thái kết nối và thông tin đăng nhập
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // Đọc IP từ biến môi trường, nếu không có thì để trống
  const [host, setHost] = useState(process.env.REACT_APP_NAGIOS_IP || '');
  const [user, setUser] = useState('ubuntu');
  const [privateKey, setPrivateKey] = useState('');
  const [ws, setWs] = useState(null);

  // Effect để khởi tạo terminal một lần duy nhất
  useEffect(() => {
    // Chỉ khởi tạo nếu terminal chưa tồn tại
    if (!xtermRef.current && xtermDivRef.current) {
      const term = new Terminal({
        fontSize: 14,
        cursorBlink: true,
        convertEol: true,
      });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(xtermDivRef.current);
      fitAddon.fit();

      // Tự động fit lại terminal khi thay đổi kích thước cửa sổ
      const resizeListener = () => fitAddon.fit();
      window.addEventListener('resize', resizeListener);
      
      xtermRef.current = term;

      // Hàm dọn dẹp khi component bị hủy
      return () => {
        window.removeEventListener('resize', resizeListener);
      };
    }
  }, []); // Dependency rỗng đảm bảo effect chỉ chạy 1 lần

  // Effect để quản lý kết nối WebSocket
  useEffect(() => {
    if (ws && xtermRef.current) {
      const term = xtermRef.current;

      ws.onopen = () => {
        setConnected(true);
        setIsConnecting(false);
        // Gửi thông tin đăng nhập SSH cho backend proxy
        ws.send(JSON.stringify({ host, user, privateKey }));
        term.focus();
      };

      ws.onmessage = (event) => {
        // Ghi dữ liệu từ server trả về vào terminal
        term.write(event.data);
      };

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

      // Gửi dữ liệu người dùng gõ trong terminal về server
      const onDataDisposable = term.onData(data => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });

      // Hàm dọn dẹp khi ws thay đổi
      return () => {
        onDataDisposable.dispose();
      };
    }
  }, [ws, host, user, privateKey]);

  // Hàm xử lý khi nhấn nút "Kết nối"
  const handleConnect = () => {
    if (!host || !user || !privateKey) {
        alert('Vui lòng điền đầy đủ thông tin Host, User và Private Key.');
        return;
    }
    setIsConnecting(true);
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
    // Backend proxy chạy trên cùng máy chủ, port 8081
    const socketUrl = `ws://${host}:8081/ssh`;
    const socket = new WebSocket(socketUrl);
    setWs(socket);
  };

  // Hàm xử lý khi nhấn nút "Ngắt kết nối"
  const handleDisconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  return (
    <div>
      <h2>Nhật ký thao tác & SSH</h2>
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <input value={host} onChange={e => setHost(e.target.value)} placeholder="IP server" style={{ flex: '1 1 150px' }} />
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="User" style={{ flex: '1 1 100px' }} />
        <textarea 
          value={privateKey} 
          onChange={e => setPrivateKey(e.target.value)} 
          placeholder="Dán nội dung private key (.pem) vào đây" 
          rows="3" 
          style={{ flex: '2 1 300px', fontFamily: 'monospace' }} 
        />
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