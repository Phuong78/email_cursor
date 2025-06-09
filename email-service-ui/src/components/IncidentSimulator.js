import { useState } from 'react';

const incidentOptions = [
  { id: 'CPU_HIGH', name: 'Gây sự cố CPU Cao (95% trong 5 phút)' },
  { id: 'DISK_FULL', name: 'Gây sự cố Đầy Disk (Tạo file 1GB)' },
];

export default function IncidentSimulator() {
  const [targetHost, setTargetHost] = useState(process.env.REACT_APP_NAGIOS_IP || '');
  const [incidentType, setIncidentType] = useState('CPU_HIGH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(`⚙️ Đang gửi yêu cầu giả lập '${incidentType}'...`);

    const jenkinsUrl = process.env.REACT_APP_JENKINS_URL;
    const token = process.env.REACT_APP_SIMULATE_JOB_TOKEN; 

    const triggerUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${token}&TARGET_HOST=${targetHost}&INCIDENT_TYPE=${incidentType}`;

    try {
      const response = await fetch(triggerUrl, { method: 'POST' });
      if (response.ok) {
        setMessage(`✅ Yêu cầu giả lập đã được gửi thành công! Theo dõi job 'simulate-incident' trên Jenkins.`);
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
      <h2>Giả lập Sự cố trên Máy chủ</h2>
      <p>Chọn máy chủ và loại sự cố để kích hoạt cảnh báo trên Nagios.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: 10, maxWidth: 500, background: '#fff8e1', padding: 15, borderRadius: 8 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Máy chủ đích (Nagios Server)</label>
          <input value={targetHost} onChange={e => setTargetHost(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 4 }}>Chọn loại Sự cố Giả lập</label>
          <select value={incidentType} onChange={e => setIncidentType(e.target.value)} required style={{ width: '100%', padding: 8 }}>
            {incidentOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', width: '100%', cursor: 'pointer' }}>
          {isSubmitting ? 'Đang chạy...' : 'Bắt đầu Giả lập'}
        </button>
      </form>
      {message && <div style={{ marginTop: 15, padding: 12, border: '1px solid #ccc', borderRadius: 6 }}>{message}</div>}
    </div>
  );
}