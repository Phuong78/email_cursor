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
      <h2>Khắc phục Alert (Nagios)</h2>
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