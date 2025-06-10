export default function Nagios() {
  // Đọc IP của máy chủ Nagios từ biến môi trường
  const nagiosHost = process.env.REACT_APP_NAGIOS_IP;
  const nagiosUrl = `http://${nagiosHost}/nagios`;

  return (
    <div>
      <h2>Nagios Monitoring</h2>
      <iframe
        src={nagiosUrl} // <-- Sử dụng URL động
        width="100%"
        height="800px"
        title="Nagios"
        style={{ border: 'none' }}
      />
      <p>Nếu không hiển thị, hãy mở trực tiếp <a href={nagiosUrl} target="_blank" rel="noopener noreferrer">tại đây</a>.</p>
    </div>
  );
}