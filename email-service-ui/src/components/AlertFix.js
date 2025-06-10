import { useState } from 'react';

const incidentOptions = [
  { id: 'DISK_FULL', name: 'Sự cố đầy Disk (Log)' },
  { id: 'CPU_HIGH', name: 'Sự cố CPU Cao' },
  { id: 'MAIL_QUEUE', name: 'Sự cố hàng đợi Mail' },
];

// Component không cần nhận 'customers' nữa
export default function AlertFix() {
  const [selectedIncident, setSelectedIncident] = useState('');
  // Quay lại sử dụng ô nhập IP thủ công
  const [targetHost, setTargetHost] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIncident || !targetHost) {
      setMessage('❌ Vui lòng chọn sự cố và nhập IP máy chủ.');
      return;
    }
    // ... (logic fetch giữ nguyên như cũ)
    setIsSubmitting(true);
    setMessage('⚙️ Đang gửi yêu cầu sửa lỗi đến Jenkins...');
    const jenkinsUrl = process.env.REACT_APP_JENKINS_URL;
    const token = process.env.REACT_APP_RESOLVE_JOB_TOKEN;
    const triggerUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${token}&TARGET_HOST=${targetHost}&INCIDENT_TYPE=${selectedIncident}`;
    try {
      const response = await fetch(triggerUrl, { method: 'POST' });
      if (response.ok) {
        setMessage(`✅ Yêu cầu sửa lỗi '${selectedIncident}' cho máy chủ ${targetHost} đã được gửi thành công!`);
      } else {
        setMessage(`❌ Lỗi khi gửi yêu cầu: ${response.status} ${await response.text()}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi kết nối: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Khắc phục Sự cố Tự động</h2>
      <p>Chọn loại sự cố và nhập IP máy chủ đích để chạy kịch bản sửa lỗi.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: 10, maxWidth: 400, background: '#f8f8f8', padding: 15, borderRadius: 8 }}>
        
        {/* Quay lại sử dụng ô nhập IP thủ công */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Máy chủ đích (IP)</label>
          <input 
            value={targetHost} 
            onChange={e => setTargetHost(e.target.value)} 
            placeholder="Nhập IP máy chủ cần sửa lỗi" 
            required 
            style={{ width: '100%', padding: 8 }} 
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Chọn loại Sự cố</label>
          <select value={selectedIncident} onChange={e => setSelectedIncident(e.target.value)} required style={{ width: '100%', padding: 8 }}>
            <option value="">-- Vui lòng chọn --</option>
            {incidentOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', width: '100%', cursor: 'pointer' }}>
          {isSubmitting ? 'Đang xử lý...' : 'Chạy Kịch bản Sửa lỗi'}
        </button>
      </form>

      {message && <div style={{ marginTop: 15, padding: 12, border: '1px solid #ccc', background: message.startsWith('✅') ? '#e8f5e9' : '#ffebee' }}>{message}</div>}
    </div>
  );
}