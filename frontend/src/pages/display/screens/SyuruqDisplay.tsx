import '../styles/syuruq.css';

interface SyuruqDisplayProps {
  syuruqTime: string;
  forbiddenEndTime: string;
  remainingSeconds: number;
}

function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

function SyuruqDisplay({ remainingSeconds }: SyuruqDisplayProps) {
  return (
    <div className="syuruq-display">
      <div className="syuruq-content">
        <div className="syuruq-label">WAKTU SYURUQ</div>

        <h1 className="syuruq-title">TERBIT MATAHARI</h1>

        <p className="syuruq-message">
          Waktu terlarang untuk melaksanakan sholat sunnah
        </p>

        <div className="syuruq-countdown">
          {formatCountdown(remainingSeconds)}
        </div>

        <p className="syuruq-footer">
          Mohon menunggu hingga waktu terlarang berakhir.
        </p>
      </div>
    </div>
  );
}

export default SyuruqDisplay;
