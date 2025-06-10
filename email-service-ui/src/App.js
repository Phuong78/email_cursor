// file: frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- Thêm 'useEffect' vào import
import Intro from './components/Intro';
import Nagios from './components/Nagios';
import AlertFix from './components/AlertFix';
import LogSSH from './components/LogSSH';
import CustomerList from './components/CustomerList';
import IncidentSimulator from './components/IncidentSimulator';

function App() {
  // THAY ĐỔI 1: Khi khởi tạo state, hãy thử đọc dữ liệu đã lưu trong localStorage
  const [customers, setCustomers] = useState(() => {
    try {
      const savedCustomers = localStorage.getItem('customers');
      // Nếu có dữ liệu đã lưu, dùng nó. Nếu không, dùng một mảng rỗng.
      return savedCustomers ? JSON.parse(savedCustomers) : [];
    } catch (error) {
      console.error('Failed to parse customers from localStorage', error);
      return [];
    }
  });

  // THAY ĐỔI 2: Dùng useEffect để tự động lưu lại danh sách mỗi khi nó thay đổi
  useEffect(() => {
    // Chuyển mảng customers thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]); // Effect này sẽ chạy lại mỗi khi state 'customers' thay đổi

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1>Email Service Demo UI</h1>
        <nav style={{ marginBottom: 20, display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/">Giới thiệu</Link>
          <Link to="/customers">Danh sách khách hàng</Link>
          <Link to="/simulate-incident">Giả lập sự cố</Link>
          <Link to="/nagios">Nagios Monitoring</Link>
          <Link to="/alert-fix">Khắc phục Alert</Link>
          <Link to="/log-ssh">Nhật ký & SSH</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Intro customers={customers} setCustomers={setCustomers} />} />
          <Route path="/nagios" element={<Nagios />} />
          <Route path="/alert-fix" element={<AlertFix />} />
          <Route path="/log-ssh" element={<LogSSH />} />
          <Route path="/customers" element={<CustomerList customers={customers} />} />
          <Route path="/simulate-incident" element={<IncidentSimulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;