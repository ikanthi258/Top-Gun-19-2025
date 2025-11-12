/**
 * 08_DashboardPage.tsx
 *
 * หน้า Dashboard รวมทุกอย่างเข้าด้วยกัน
 * - แสดงข้อมูลกล้อง
 * - ดึง detection history จาก API
 * - แสดงแผนที่พร้อม markers
 * - แสดง detection feed
 * - เชื่อม Socket.IO เพื่อรับข้อมูล real-time
 */

// 1. Import hooks และ components
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

// 2. Import custom hooks
import { useDetections } from '../hooks/useDetections';
import { useSocket } from '../hooks/useSocket';

// 3. Import components
import DetectionCard from '../components/DetectionCard';
import MapComponent from '../components/MapComponent';

// 4. Import types
import { type DetectionEvent, type DetectedObject } from '../types';

const DashboardPage = () => {
  // ========== States ========== //

  // 5. State สำหรับ Camera ID และ Token
  const [camId, setCamId] = useState('');
  const [token, setToken] = useState('');

  // 6. State สำหรับเปิด/ปิดการเชื่อมต่อ
  const [isStarted, setIsStarted] = useState(false);

  // 7. State สำหรับเก็บ detection events ทั้งหมด (history + realtime)
  const [allDetections, setAllDetections] = useState<DetectionEvent[]>([]);

  // ========== API Call (React Query) ========== //

  // 8. เรียกใช้ useDetections hook เพื่อดึงข้อมูลจาก API
  const { data, isLoading, error, refetch } = useDetections(camId, token, isStarted);

  // 9. เมื่อได้ข้อมูลจาก API ให้เก็บใน allDetections
  useEffect(() => {
    if (data?.data) {
      setAllDetections(data.data);
    }
  }, [data]);

  // ========== Socket.IO Connection ========== //

  // 10. เรียกใช้ useSocket hook เพื่อเชื่อมต่อ Socket.IO
  const { realtimeData, isConnected } = useSocket(camId, isStarted);

  // 11. เมื่อได้ข้อมูล real-time ใหม่ ให้เพิ่มเข้า allDetections
  useEffect(() => {
    if (realtimeData) {
      // 12. เพิ่ม detection ใหม่ไว้ด้านหน้าสุด
      setAllDetections((prev) => [realtimeData, ...prev]);

      // 13. แสดง notification (optional)
      console.log('New detection received:', realtimeData);
    }
  }, [realtimeData]);

  // ========== Event Handlers ========== //

  // 14. ฟังก์ชันเริ่มเชื่อมต่อ
  const handleStart = () => {
    if (camId && token) {
      setIsStarted(true);
    }
  };

  // 15. ฟังก์ชันหยุดเชื่อมต่อ
  const handleStop = () => {
    setIsStarted(false);
    setAllDetections([]);
  };

  // ========== Render ========== //

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 16. หัวข้อหน้า */}
      <Typography variant="h3" gutterBottom>
        08. Dashboard
      </Typography>

      {/* ========== ส่วนที่ 1: คำอธิบาย ========== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          📊 Dashboard Overview
        </Typography>

        <Typography variant="body1" paragraph>
          หน้านี้รวมทุกอย่างเข้าด้วยกัน:
        </Typography>

        <Typography component="div">
          <ul>
            <li>✅ เชื่อมต่อ API เพื่อดึงข้อมูล detection history</li>
            <li>✅ เชื่อมต่อ Socket.IO เพื่อรับข้อมูล real-time</li>
            <li>✅ แสดง detection cards ในรูปแบบ feed</li>
            <li>✅ แสดงสถานะการเชื่อมต่อ</li>
          </ul>
        </Typography>
      </Paper>

      {/* ========== ส่วนที่ 2: Form สำหรับกรอก Camera ID และ Token ========== */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔐 Camera Configuration
        </Typography>

        {/* 17. Grid สำหรับ input fields */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* 18. Camera ID input */}
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Camera ID"
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              value={camId}
              onChange={(e) => setCamId(e.target.value)}
              disabled={isStarted}
            />
          </Grid>

          {/* 19. Token input */}
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Camera Token"
              placeholder="your-camera-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isStarted}
              type="password"
            />
          </Grid>

          {/* 20. Buttons */}
          <Grid size={{ xs: 12, md: 2 }}>
            {!isStarted ? (
              // 21. ปุ่ม Start
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleStart}
                disabled={!camId || !token}
                sx={{ height: 56 }}
              >
                Start
              </Button>
            ) : (
              // 22. ปุ่ม Stop
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleStop}
                sx={{ height: 56 }}
              >
                Stop
              </Button>
            )}
          </Grid>
        </Grid>

        {/* 23. แสดงสถานะการเชื่อมต่อ */}
        {isStarted && (
          <Stack direction="row" spacing={2}>
            {/* 24. สถานะ Socket.IO */}
            <Chip
              icon={<Icon icon={isConnected ? 'mdi:check-circle' : 'mdi:close-circle'} />}
              label={`Socket.IO: ${isConnected ? 'Connected' : 'Disconnected'}`}
              color={isConnected ? 'success' : 'error'}
            />

            {/* 25. สถานะ API */}
            <Chip
              icon={<Icon icon={error ? 'mdi:close-circle' : 'mdi:check-circle'} />}
              label={`API: ${error ? 'Error' : 'Ready'}`}
              color={error ? 'error' : 'success'}
            />
          </Stack>
        )}
      </Paper>

      {/* ========== ส่วนที่ 3: แสดงแผนที่ ========== */}
      {isStarted && allDetections.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🗺️ Map View
          </Typography>

          {/* รวม objects จาก detections ทั้งหมด */}
          <Box sx={{ height: 400, width: '100%' }}>
            <MapComponent
              objects={allDetections.flatMap((d) => d.objects)}
              imagePath={allDetections[0]?.image_path}
              cameraLocation={allDetections[0]?.camera?.location}
            />
          </Box>
        </Paper>
      )}

      {/* ========== ส่วนที่ 4: แสดง Detection Feed ========== */}
      {isStarted && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📡 Detection Feed
          </Typography>

          {/* 26. แสดง loading */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* 27. แสดง error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading detections: {error.message}
            </Alert>
          )}

          {/* 28. แสดง detection cards */}
          {!isLoading && !error && (
            <>
              {/* 29. แสดงจำนวน detections */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Detections: {allDetections.length}
              </Typography>

              {/* 30. ถ้าไม่มี detections */}
              {allDetections.length === 0 && (
                <Alert severity="info">
                  No detections found. Waiting for real-time data...
                </Alert>
              )}

              {/* 31. แสดง DetectionCard แต่ละอัน */}
              {allDetections.map((detection) => (
                <DetectionCard key={detection.id} detection={detection} />
              ))}
            </>
          )}
        </Paper>
      )}

      {/* ========== Navigation ========== */}
      <Stack direction="row" spacing={2}>
        <Link to="/07-api-socket" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">
            หน้าก่อนหน้า: API & Socket
          </Button>
        </Link>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained">
            กลับหน้าแรก
          </Button>
        </Link>
      </Stack>
    </Container>
  );
};

// 32. Export component
export default DashboardPage;