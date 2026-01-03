import { useState, useEffect, useCallback } from 'react';
import {
  FileIcon,
  ImageIcon,
  FileTextIcon,
  DownloadIcon,
  TrashIcon,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AttachmentList = ({ taskId, onDelete }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchAttachments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/tasks/${taskId}/attachments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttachments(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch attachments error:', err);
      setError(err.response?.data?.message || 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const handleDownload = async (attachmentId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/attachments/${attachmentId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm('Bạn có chắc muốn xóa file này?')) return;

    try {
      setDeleting(attachmentId);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/attachments/${attachmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAttachments(prev => prev.filter(a => a._id !== attachmentId));
      
      if (onDelete) {
        onDelete(attachmentId);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const getFileIcon = (fileType, mimeType) => {
    if (fileType === 'image' || mimeType?.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    }
    if (fileType === 'document' || mimeType?.includes('pdf')) {
      return <FileTextIcon className="w-6 h-6 text-red-500" />;
    }
    return <FileIcon className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getImageUrl = (fileUrl) => {
    if (fileUrl.startsWith('http')) return fileUrl;
    return `${API_BASE_URL}${fileUrl}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Chưa có file đính kèm</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => {
        const isImage = attachment.fileType === 'image' || attachment.mimeType?.startsWith('image/');
        
        return (
          <div
            key={attachment._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image preview */}
            {isImage && (
              <div className="w-full h-48 bg-gray-100">
                <img
                  src={getImageUrl(attachment.fileUrl)}
                  alt={attachment.originalName || attachment.fileName}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            )}

            {/* File info */}
            <div className="p-3 flex items-center gap-3">
              {!isImage && getFileIcon(attachment.fileType, attachment.mimeType)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {attachment.originalName || attachment.fileName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(attachment.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(attachment.createdAt)}</span>
                  {attachment.uploadedBy && (
                    <>
                      <span>•</span>
                      <span>{attachment.uploadedBy.name}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(attachment._id, attachment.originalName || attachment.fileName)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Tải xuống"
                >
                  <DownloadIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(attachment._id)}
                  disabled={deleting === attachment._id}
                  className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Xóa"
                >
                  <TrashIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttachmentList;
