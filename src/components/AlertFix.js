import { useState } from 'react';

export default function AlertFix() {
  const [alert, setAlert] = useState('');
  const [server, setServer] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Ở đây có thể gọi API hoặc workflow n8n/Jenkins để xử lý alert
  };

  return (
    <div>
      <h2>Khắc phục Alert (Nagios)</h2>import { useState } from 'react';

// Định nghĩa các loại sự cố có thể khắc phục
const incidentOptions = [
  { id: 'DISK_FULL', name: 'Sự cố đầy Disk (do file Log)' },
  { id: 'CPU_HIGH', name: 'Sự cố CPU Cao' },
  { id: 'MAIL_QUEUE', name: 'Sự cố hàng đợi Mail' },
];

export default function AlertFix() {
  // State để quản lý form và phản hồi
  const [selectedIncident, setSelectedIncident] = useState('');
  const [targetHost, setTargetHost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIncident || !targetHost) {
      setMessage('❌ Vui lòng chọn loại sự cố và nhập IP máy chủ.');
      return;
    }

    setIsSubmitting(true);
    setMessage('⚙️ Đang gửi yêu cầu sửa lỗi đến Jenkins...');

    // Lấy thông tin cấu hình từ file .env
    const jenkinsUrl = process.env.REACT_APP_JENKINS_URL;
    // Sử dụng một token riêng cho job sửa lỗi để tăng cường bảo mật
    const token = process.env.REACT_APP_RESOLVE_JOB_TOKEN;

    // Xây dựng URL để trigger Jenkins job 'resolve-incident'
    const triggerUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${token}&TARGET_HOST=${encodeURIComponent(targetHost)}&INCIDENT_TYPE=${encodeURIComponent(selectedIncident)}`;

    try {
      const response = await fetch(triggerUrl, {
        method: 'POST',
      });

      if (response.ok) {
        // Jenkins đã chấp nhận yêu cầu, job đang được chạy
        setMessage(`✅ Yêu cầu sửa lỗi '${selectedIncident}' đã được gửi thành công! Vui lòng kiểm tra job 'resolve-incident' trên Jenkins để xem kết quả chi tiết.`);
      } else {
        const errorText = await response.text();
        setMessage(`❌ Lỗi khi gửi yêu cầu đến Jenkins: ${response.status}. Phản hồi: ${errorText}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối đến máy chủ Jenkins: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Khắc phục Sự cố Tự động</h2>
      <p>Chọn loại sự cố và máy chủ đích để chạy kịch bản sửa lỗi tự động bằng Ansible.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: 10, maxWidth: 400, background: '#f8f8f8', padding: 15, borderRadius: 8 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Chọn loại Sự cố</label>
          <select 
            value={selectedIncident} 
            onChange={e => setSelectedIncident(e.target.value)} 
            required 
            style={{ width: '100%', padding: 8 }}
          >
            <option value="">-- Vui lòng chọn --</option>
            {incidentOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Máy chủ đích (IP)</label>
          <input 
            value={targetHost} 
            onChange={e => setTargetHost(e.target.value)} 
            placeholder="VD: 123.45.67.89" 
            required 
            style={{ width: '100%', padding: 8 }} 
          />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', width: '100%', cursor: 'pointer' }}>
          {isSubmitting ? 'Đang xử lý...' : 'Chạy Kịch bản Sửa lỗi'}
        </button>
      </form>

      {/* Khu vực hiển thị thông báo phản hồi */}
      {message && (
        <div style={{ 
          marginTop: 15, 
          padding: 12, 
          border: '1px solid #ccc', 
          borderRadius: 6,
          background: message.startsWith('✅') ? '#e8f5e9' : '#ffebee',
          whiteSpace: 'pre-wrap' // Giúp hiển thị các dòng mới trong thông báo
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Chọn Alert: </label>
          <input value={alert} onChange={e => setAlert(e.target.value)} placeholder="VD: Disk Usage Warning" required />
        </div>
        <div>
          <label>Máy chủ: </label>
          <input value={server} onChange={e => setServer(e.target.value)} placeholder="VD: 34.201.116.201" required />
        </div>
        <div>
          <label>Ghi chú: </label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Mô tả thao tác khắc phục" />
        </div>
        <button type="submit">Sửa lỗi</button>
      </form>
      {submitted && <p>Đã gửi yêu cầu khắc phục alert!</p>}
    </div>
  );
}