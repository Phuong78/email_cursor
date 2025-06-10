import { useState } from 'react';

export default function Intro({ customers, setCustomers }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quota, setQuota] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // =================================================================
  // THAY ĐỔI QUAN TRỌNG NẰM TRONG HÀM NÀY
  // =================================================================
  const handleAdd = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('⚙️ Đang gửi yêu cầu tạo khách hàng đến Jenkins...');

    const jenkinsUrl = process.env.REACT_APP_JENKINS_URL;
    const token = process.env.REACT_APP_JENKINS_TOKEN;

    // URL bây giờ chỉ chứa token, không chứa tham số dữ liệu
    const triggerUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${token}`;
    
    try {
      // Dữ liệu sẽ được gửi trong body của request dưới dạng JSON
      const response = await fetch(triggerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            customerName: name,
            customerEmail: email,
            // Đảm bảo gửi quota dưới dạng số
            quota: Number(quota) 
        })
      });

      if (response.ok) {
        setMessage('✅ Yêu cầu tạo khách hàng đã được gửi thành công! Máy chủ mới sẽ được tạo trong vài phút.');
        setCustomers([...customers, { name, email, quota, ip: 'Đang tạo...' }]);
        setShowForm(false);
        setName(''); setEmail(''); setQuota(20);
      } else {
        const errorText = await response.text();
        setMessage(`❌ Lỗi khi gửi yêu cầu: ${response.status} ${errorText}`);
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
      <p>Hệ thống trình diễn một quy trình DevOps hoàn chỉnh...</p>
      
      <h4>Ưu điểm nổi bật của hệ thống:</h4>
      <ul>
        <li><b>Tự động hóa Cung cấp Hạ tầng (IaC)</b></li>
        <li><b>Quy trình CI/CD liền mạch</b></li>
        <li><b>Giám sát & Cảnh báo Chủ động</b></li>
        <li><b>Khả năng Tự khắc phục</b></li>
        <li><b>Giao diện Quản lý Tập trung</b></li>
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