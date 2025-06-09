export default function CustomerList({ customers }) {
    return (
      <div>
        <h2>Danh sách khách hàng</h2>
        <table border="1" cellPadding="5" style={{ minWidth: 350 }}>
          <thead>
            <tr>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Quota (GB)</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan="3">Chưa có khách hàng nào</td>
              </tr>
            )}
            {customers.map((c, idx) => (
              <tr key={idx}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.quota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }