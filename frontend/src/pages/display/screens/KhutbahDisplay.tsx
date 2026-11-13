import '../styles/khutbah.css';

interface KhutbahDisplayProps {
  displayConfig: any;
  countdown: string;
}

function KhutbahDisplay({ countdown }: KhutbahDisplayProps) {
  return (
    <div
      className="khutbah-display"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(3, 12, 19, 0.82),
            rgba(3, 12, 19, 0.88)
          )
        `,
      }}
    >
      <div className="khutbah-content">
        {/* <div className="khutbah-label">KHUTBAH JUMAT</div> */}

        <h1 className="khutbah-label">KHUTBAH JUMAT</h1>

        <p>Mohon tenang dan dengarkan khutbah dengan khusyuk.</p>

        <div className="khutbah-countdown">{countdown}</div>

        <div className="khutbah-footer">
          Matikan atau senyapkan perangkat komunikasi Anda.
        </div>
      </div>
    </div>
  );
}

export default KhutbahDisplay;
