/**
 * Camera API Test Page
 * หน้าสำหรับทดสอบเรียกใช้ Camera Service APIs
 */

import { useState } from 'react';


import { clearCameraData, createImageUrl, getCameraById, getDetectionEvents, getUploadedFile, regenerateToken, sendObjectDetection } from '../services';
import type { DetectedObject } from '../types';
import { data } from 'react-router-dom';

export default function CameraTestPage() {
  // State สำหรับ cam_id และ token
  const [camId, setCamId] = useState('46bf063e-275c-433f-a2e3-bb4e2ca2d43c');
  const [token, setToken] = useState('8c53d8c4-a313-4036-bccc-cad260a58fc3');

  // State สำหรับแสดงผลลัพธ์
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State สำหรับ API #3 (Upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objects, setObjects] = useState<string>('[]');
  
  // State สำหรับ API #6 (Get File)
  const [filename, setFilename] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Helper function สำหรับจัดการ API calls
  const handleApiCall = async (apiFunction: () => Promise<any>, apiName: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await apiFunction();
      setResult(response);
      console.log(`✅ ${apiName} Success:`, response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      setError(errorMsg);
      console.error(`❌ ${apiName} Error:`, err);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   if (re){
  //     // something
  //   }
  // }, (data))

  // API #1: Get Camera Info
  const handleGetCamera = () => {
    handleApiCall(
      () => getCameraById(camId, token),
      'Get Camera Info'
    );
  };

  // API #2: Get Detection Events
  const handleGetDetections = () => {
    handleApiCall(
      () => getDetectionEvents(camId, token),
      'Get Detection Events'
    );
  };

  // API #3: Send Object Detection
  const handleSendDetection = () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    let parsedObjects: DetectedObject[];
    try {
      parsedObjects = JSON.parse(objects);
    } catch (err) {
      setError('Invalid JSON format for objects');
      return;
    }

    handleApiCall(
      () => sendObjectDetection(
        camId,
        token,
        selectedFile,
        parsedObjects,
        new Date().toISOString()
      ),
      'Send Object Detection'
    );
  };

  // API #4: Clear Camera Data
  const handleClearData = () => {
    if (!window.confirm('Are you sure you want to delete all data for this camera?')) {
      return;
    }
    
    handleApiCall(
      () => clearCameraData(camId, token),
      'Clear Camera Data'
    );
  };

  // API #5: Regenerate Token
  const handleRegenerateToken = () => {
    handleApiCall(
      async () => {
        const response = await regenerateToken(camId, token);
        // อัพเดท token ใหม่ให้อัตโนมัติ
        setToken(response.token);
        return;
      },
      'Regenerate Token'
    );
  };

  // API #6: Get Uploaded File
  const handleGetFile = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    
    try {
      const blob = await getUploadedFile(camId, token, filename);
      const url = createImageUrl(blob);
      setImageUrl(url);
      setResult({ message: 'File retrieved successfully', size: blob.size });
      console.log('✅ Get File Success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'File not found';
      setError(errorMsg);
      console.error('❌ Get File Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Camera API Test Page
        </h1>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Camera Credentials</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera ID (UUID)
              </label>
              <input
                type="text"
                value={camId}
                onChange={(e) => setCamId(e.target.value)}
                placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="your-camera-token-here"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* API Buttons Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Functions</h2>
          
          <div className="space-y-4">
            {/* API #1 */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">1. Get Camera Info</h3>
              <button
                onClick={handleGetCamera}
                disabled={loading || !camId || !token}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Get Camera
              </button>
            </div>

            {/* API #2 */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">2. Get Detection Events (Last 24h)</h3>
              <button
                onClick={handleGetDetections}
                disabled={loading || !camId || !token}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Get Detections
              </button>
            </div>

            {/* API #3 */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">3. Send Object Detection</h3>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <textarea
                  value={objects}
                  onChange={(e) => setObjects(e.target.value)}
                  placeholder='[{"class": "person", "confidence": 0.95, "bbox": [100, 200, 300, 400]}]'
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                />
                <button
                  onClick={handleSendDetection}
                  disabled={loading || !camId || !token || !selectedFile}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send Detection
                </button>
              </div>
            </div>

            {/* API #4 */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">4. Clear Camera Data</h3>
              <button
                onClick={handleClearData}
                disabled={loading || !camId || !token}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Clear All Data
              </button>
            </div>

            {/* API #5 */}
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">5. Regenerate Token</h3>
              <button
                onClick={handleRegenerateToken}
                disabled={loading || !camId || !token}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Regenerate Token
              </button>
            </div>

            {/* API #6 */}
            <div>
              <h3 className="font-medium mb-2">6. Get Uploaded File</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleGetFile}
                  disabled={loading || !camId || !token || !filename}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Get File
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">Loading...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <pre className="text-red-700 text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-semibold mb-2">Response</h3>
            <pre className="text-green-700 text-sm whitespace-pre-wrap overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Image Display (for API #6) */}
        {imageUrl && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Retrieved Image</h3>
            <img
              src={imageUrl}
              alt="Retrieved file"
              className="max-w-full h-auto rounded border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}