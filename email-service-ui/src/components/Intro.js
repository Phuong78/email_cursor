import { useState } from 'react';

export default function Intro({ customers, setCustomers }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quota, setQuota] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('⚙️ Đang gửi yêu cầu tạo khách hàng đến Jenkins...');

    const jenkinsUrl = process.env.REACT_APP_JENKINS_URL;
    const token = process.env.REACT_APP_JENKINS_TOKEN;

    const triggerUrl = `${jenkinsUrl}/generic-webhook-trigger/invoke?token=${token}&CUSTOMER_NAME=${encodeURIComponent(name)}&CUSTOMER_EMAIL=${encodeURIComponent(email)}&QUOTA=${quota}`;
    
    try {
      const response = await fetch(triggerUrl, { method: 'POST' });
      if (response.ok) {
        setMessage('✅ Yêu cầu tạo khách hàng đã được gửi thành công! Máy chủ mới sẽ được tạo trong vài phút.');
        // Thêm khách hàng mới vào danh sách (không cần IP)
        setCustomers([...customers, { name, email, quota, ip: 'Đang tạo...' }]);
        setShowForm(false);
        setName(''); setEmail(''); setQuota(20);
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
      <p>Hệ thống trình diễn một quy trình DevOps hoàn chỉnh cho việc cung cấp và quản lý dịch vụ email đa khách hàng trên nền tảng AWS.</p>
      
      {/* NỘI DUNG MỚI */}
      <h4>Ưu điểm nổi bật của hệ thống:</h4>
      <ul>
        <li><b>Tự động hóa Cung cấp Hạ tầng (IaC):</b> Sử dụng Terraform để tạo mới và quản lý hạ tầng một cách nhất quán, giảm thiểu sai sót thủ công.</li>
        <li><b>Quy trình CI/CD liền mạch:</b> Jenkins điều phối các kịch bản tự động, từ việc tạo khách hàng mới đến việc sửa lỗi.</li>
        <li><b>Giám sát & Cảnh báo Chủ động:</b> Nagios liên tục theo dõi sức khỏe hệ thống và gửi cảnh báo tức thời khi có sự cố.</li>
        <li><b>Khả năng Tự khắc phục:</b> Tích hợp kịch bản sửa lỗi tự động, cho phép hệ thống phản ứng nhanh với các sự cố phổ biến.</li>
        <li><b>Giao diện Quản lý Tập trung:</b> Cung cấp một nơi duy nhất để theo dõi và thực hiện các tác vụ quản trị quan trọng.</li>
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