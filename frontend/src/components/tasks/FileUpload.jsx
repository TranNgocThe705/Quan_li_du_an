import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon, ImageIcon, FileTextIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const FileUpload = ({ taskId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    setError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => {
        if (f.file.size > MAX_FILE_SIZE) {
          return `${f.file.name}: File quá lớn (max 10MB)`;
        }
        return `${f.file.name}: File không hợp lệ`;
      });
      setError(errors.join(', '));
      return;
    }

    // Check file sizes
    const oversizedFiles = acceptedFiles.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError(`Files quá lớn (max 10MB): ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setSelectedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      
      // Upload files one by one
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        await axios.post(
          `${API_BASE_URL}/api/tasks/${taskId}/attachments`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                ((i + progressEvent.loaded / progressEvent.total) / selectedFiles.length) * 100
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
      }

      // Success
      setSelectedFiles([]);
      setUploadProgress(100);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }
    if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileTextIcon className="w-8 h-8 text-red-500" />;
    }
    return <FileIcon className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Thả file vào đây...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-1">
              Kéo thả file hoặc click để chọn
            </p>
            <p className="text-sm text-gray-400">
              Hỗ trợ: Images, PDF, Documents (Max 10MB mỗi file)
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            File đã chọn ({selectedFiles.length})
          </h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                disabled={uploading}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Đang tải lên... ${uploadProgress}%` : 'Tải lên'}
          </button>

          {/* Progress bar */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
