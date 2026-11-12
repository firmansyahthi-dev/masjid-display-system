import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Masjid Display API is running',
    application: 'Masjid Display System',
    timestamp: new Date().toISOString(),
  });
});

// Server configuration
const PORT = Number(process.env.PORT || 3001);

app.listen(PORT, '0.0.0.0', () => {
  console.log('--------------------------------');
  console.log('MASJID DISPLAY SYSTEM API');
  console.log('--------------------------------');
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: /api/health`);
});
