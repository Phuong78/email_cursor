// Cập nhật component để nhận thêm prop 'onDeleteCustomer'
export default function CustomerList({ customers, onDeleteCustomer }) {
  return (
    <div>
      <h2>Danh sách khách hàng</h2>
      <table border="1" cellPadding="5" style={{ minWidth: 450, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Quota (GB)</th>
            {/* THÊM VÀO: Cột mới cho hành động xóa */}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 && (
            <tr>
              {/* CẬP NHẬT: Tăng colspan lên 4 */}
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có khách hàng nào</td>
            </tr>
          )}
          {customers.map((c, idx) => (
            <tr key={idx}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.quota}</td>
              <td>{c.ip || 'Chưa có'}</td> {/* <-- THÊM VÀO: Hiển thị IP, nếu không có thì ghi 'Chưa có' */}
              {/* THÊM VÀO: Ô chứa nút xóa */}
              <td style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => onDeleteCustomer(idx)} 
                  style={{ color: 'red', cursor: 'pointer', border: '1px solid #ff7b7b', background: '#fff5f5', borderRadius: '4px' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}