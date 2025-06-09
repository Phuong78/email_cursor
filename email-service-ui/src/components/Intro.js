// file: frontend/src/components/Intro.js
import { useState } from 'react';

export default function Intro({ customers, setCustomers }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quota, setQuota] = useState(20);
  const [ip, setIp] = useState(''); // Thêm state cho IP
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('⚙️ Đang gửi yêu cầu tạo khách hàng đến Jenkins...');

    const jenkinsUrl = process.env.REACT_APP_JENKINS_URL;
    const token = process.env.REACT_APP_JENKINS_TOKEN; // Token của job provision-new-customer

    const triggerUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${token}&CUSTOMER_NAME=${encodeURIComponent(name)}&CUSTOMER_EMAIL=${encodeURIComponent(email)}&QUOTA=${quota}`;
    
    try {
      const response = await fetch(triggerUrl, { method: 'POST' });
      if (response.ok) {
        setMessage('✅ Yêu cầu tạo khách hàng đã được gửi thành công!');
        // Thêm khách hàng mới vào danh sách, KÈM THEO IP
        setCustomers([...customers, { name, email, quota, ip }]);
        setShowForm(false);
        setName(''); setEmail(''); setQuota(20); setIp('');
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
      <h2>Giới thiệu hệ thống Email Service Demo</h2>
      <p>Hệ thống tự động hóa hạ tầng, monitoring, cảnh báo và khắc phục sự cố cho dịch vụ email đa khách hàng trên AWS.</p>
      <ul>
        <li>Provision hạ tầng AWS bằng Terraform</li>
        <li>Monitoring với Nagios</li>
        <li>Tự động hóa với Jenkins, n8n</li>
        <li>Giao diện quản lý tập trung</li>
      </ul>
      <button onClick={() => { setShowForm(!showForm); setMessage(''); }}>
        {showForm ? 'Đóng Form' : 'Thêm khách hàng mới'}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} style={{ marginTop: 10, maxWidth: 350, background: '#f8f8f8', padding: 15, borderRadius: 8 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Tên khách hàng</label>
            <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Server IP (Điền IP đã tạo cho khách hàng)</label>
            <input value={ip} onChange={e => setIp(e.target.value)} placeholder="VD: 54.1.2.3" required style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Quota (GB)</label>
            <input type="number" value={quota} onChange={e => setQuota(e.target.value)} min={1} required style={{ width: '100%' }} />
          </div>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang xử lý...' : 'Thêm'}</button>
        </form>
      )}
      {message && <div style={{ marginTop: 15, padding: 10, border: '1px solid #ccc', background: message.startsWith('✅') ? '#e8f5e9' : '#ffebee' }}>{message}</div>}
    </div>
  );
}