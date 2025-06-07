export default function Nagios() {
    return (
      <div>
        <h2>Nagios Monitoring</h2>
        <iframe
          src="http://34.201.116.201/nagios"
          width="100%"
          height="800px"
          title="Nagios"
          style={{ border: 'none' }}
        />
        <p>Nếu không hiển thị, hãy mở trực tiếp <a href="http://34.201.116.201/nagios" target="_blank" rel="noopener noreferrer">tại đây</a>.</p>
      </div>
    );
  }