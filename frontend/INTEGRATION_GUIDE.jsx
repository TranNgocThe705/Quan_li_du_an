/* eslint-disable */
/**
 * HƯỚNG DẪN TÍCH HỢP FILE ATTACHMENTS VÀ REAL-TIME COMMENTS
 * 
 * File này chứa code mẫu để tích hợp vào TaskDetails.jsx
 * 
 * 1. Import các component mới
 * 2. Setup Socket.IO connection
 * 3. Thay thế old comment UI bằng ChatComments component
 * 4. Thêm FileUpload và AttachmentList components
 * 
 * ⚠️ LƯU Ý: File này CHỈ LÀ HƯỚNG DẪN, không chạy trực tiếp!
 * Copy code từ đây vào TaskDetails.jsx theo từng bước.
 */

// =====================================================
// BƯỚC 1: CẬP NHẬT IMPORTS (Thêm vào đầu file)
// =====================================================

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, Edit2Icon, Trash2Icon, CalendarIcon, UserIcon, TagIcon, Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchTaskById, updateTask, deleteTask, fetchComments, createComment, deleteComment } from "../../features/taskSlice";
import { getUserById } from "../../features/authSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

// ✨ Import các component mới
import ChatComments from "../../components/tasks/ChatComments";
import FileUpload from "../../components/tasks/FileUpload";
import AttachmentList from "../../components/tasks/AttachmentList";
import { 
  initializeSocket, 
  joinTaskRoom, 
  leaveTaskRoom, 
  onNewComment, 
  onDeleteComment,
  onTyping,
  onNewAttachment,
  onDeleteAttachment,
  emitTypingStart,
  emitTypingStop,
  removeAllListeners,
} from "../../services/socket";

// =====================================================
// BƯỚC 2: THÊM STATE VÀ SOCKET SETUP (Trong component)
// =====================================================

export default function TaskDetails() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const projectId = searchParams.get('projectId');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { currentTask: task, loading, comments } = useSelector(state => state.task);
  const { user } = useSelector(state => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [newComment, setNewComment] = useState("");
  const [assigneeName, setAssigneeName] = useState(null);

  // ✨ New states for real-time features
  const [typingUsers, setTypingUsers] = useState([]);
  const [showAttachments, setShowAttachments] = useState(true);
  const [attachmentKey, setAttachmentKey] = useState(0); // For refreshing attachment list
  const socketInitializedRef = useRef(false);

  // ✨ Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !socketInitializedRef.current) {
      initializeSocket(token);
      socketInitializedRef.current = true;
    }
    
    return () => {
      removeAllListeners();
    };
  }, []);

  // ✨ Join task room and setup real-time listeners
  useEffect(() => {
    if (!taskId) return;

    // Join task room
    joinTaskRoom(taskId);

    // Listen for new comments
    onNewComment((comment) => {
      console.log('📨 New comment received:', comment);
      dispatch(fetchComments(taskId)); // Refresh comments
    });

    // Listen for deleted comments
    onDeleteComment(({ commentId }) => {
      console.log('🗑️ Comment deleted:', commentId);
      dispatch(fetchComments(taskId)); // Refresh comments
    });

    // Listen for typing indicator
    onTyping(({ user: typingUser, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => {
          const exists = prev.find(u => u._id === typingUser._id);
          if (!exists) {
            return [...prev, typingUser];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(u => u._id !== typingUser._id));
      }
    });

    // Listen for new attachments
    onNewAttachment((attachment) => {
      console.log('📎 New attachment received:', attachment);
      setAttachmentKey(prev => prev + 1); // Force refresh attachment list
    });

    // Listen for deleted attachments
    onDeleteAttachment(({ attachmentId }) => {
      console.log('🗑️ Attachment deleted:', attachmentId);
      setAttachmentKey(prev => prev + 1); // Force refresh attachment list
    });

    // Cleanup: leave room when unmounting
    return () => {
      leaveTaskRoom(taskId);
      setTypingUsers([]);
    };
  }, [taskId, dispatch]);

  // ✨ Handle add comment with typing stop
  const handleAddComment = async (content) => {
    if (!content.trim()) return;

    try {
      await dispatch(createComment({ taskId, content })).unwrap();
      setNewComment("");
      emitTypingStop(taskId);
    } catch (error) {
      toast.error(error || t('taskDetails.commentError'));
      throw error;
    }
  };

  // ✨ Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa comment này?')) return;
    
    try {
      await dispatch(deleteComment(commentId)).unwrap();
    } catch (error) {
      toast.error('Không thể xóa comment');
    }
  };

  // ✨ Handle typing events
  const handleTypingStart = () => {
    emitTypingStart(taskId);
  };

  const handleTypingStop = () => {
    emitTypingStop(taskId);
  };

  // ✨ Handle file upload success
  const handleUploadSuccess = () => {
    toast.success('File uploaded successfully!');
    setAttachmentKey(prev => prev + 1);
  };

  // ... rest of existing code ...

  // =====================================================
  // BƯỚC 3: CẬP NHẬT JSX - THAY ĐỔI PHẦN COMMENTS VÀ THÊM ATTACHMENTS
  // =====================================================

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
      {/* ... existing header and task info ... */}

      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Task details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description section (existing) */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">{t('taskDetails.description')}</h2>
            {/* ... existing description code ... */}
          </div>

          {/* ✨ NEW: Attachments section */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                File đính kèm
              </h2>
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showAttachments ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            {showAttachments && (
              <div className="space-y-4">
                {/* Upload component */}
                <FileUpload 
                  taskId={taskId} 
                  onUploadSuccess={handleUploadSuccess}
                />

                {/* Attachments list */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Danh sách file
                  </h3>
                  <AttachmentList 
                    key={attachmentKey}
                    taskId={taskId}
                    onDelete={() => toast.success('File deleted successfully')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ✨ NEW: Chat-style comments section */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {t('taskDetails.comments')} ({comments?.length || 0})
              </h2>
            </div>

            <div className="h-[500px]">
              <ChatComments
                comments={comments || []}
                currentUserId={user?._id}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                typingUsers={typingUsers}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
              />
            </div>
          </div>
        </div>

        {/* Right column: Task metadata (existing) */}
        <div className="space-y-6">
          {/* ... existing task info cards ... */}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// LƯU Ý QUAN TRỌNG:
// =====================================================
// 1. Đã setup Socket.IO connection tự động khi component mount
// 2. Join/leave task room tự động
// 3. Real-time updates cho comments và attachments
// 4. Typing indicator hiển thị khi người khác đang gõ
// 5. Auto-scroll comments xuống cuối khi có message mới
// 6. Avatar và timestamp hiển thị theo style chat app
// 7. File upload với drag-drop, progress bar
// 8. Image preview trong attachment list
// 9. Download và delete file attachment

// =====================================================
// KẾT QUẢ MONG ĐỢI:
// =====================================================
// ✅ Giao diện comments giống chat app (message bubbles)
// ✅ Phân biệt own messages (bên phải) vs others (bên trái)
// ✅ Real-time: comment mới hiện ngay không cần refresh
// ✅ Typing indicator: "User đang nhập..."
// ✅ Upload files với drag-drop
// ✅ Preview images trực tiếp
// ✅ Download và delete attachments
// ✅ Real-time updates cho attachments
