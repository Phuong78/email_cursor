import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Intro from './components/Intro';
import Nagios from './components/Nagios';
import AlertFix from './components/AlertFix';
import LogSSH from './components/LogSSH';
import CustomerList from './components/CustomerList';
import IncidentSimulator from './components/IncidentSimulator';

function App() {
  const [customers, setCustomers] = useState(() => {
    try {
      const savedCustomers = localStorage.getItem('customers');
      return savedCustomers ? JSON.parse(savedCustomers) : [];
    } catch (error) {
      console.error('Failed to parse customers from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  // ========================================================
  // THÊM VÀO: Hàm xử lý logic xóa khách hàng khỏi state
  // ========================================================
  const handleDeleteCustomer = (customerIndex) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customers[customerIndex].name}" khỏi danh sách này không?`)) {
      // Tạo một mảng mới bằng cách lọc ra khách hàng có index cần xóa
      const updatedCustomers = customers.filter((_, index) => index !== customerIndex);
      // Cập nhật lại state, React sẽ tự động render lại UI
      setCustomers(updatedCustomers);
    }
  };

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
          
          {/* CẬP NHẬT: Truyền hàm handleDeleteCustomer vào component CustomerList */}
          <Route 
            path="/customers" 
            element={<CustomerList customers={customers} onDeleteCustomer={handleDeleteCustomer} />} 
          />

          <Route path="/simulate-incident" element={<IncidentSimulator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;