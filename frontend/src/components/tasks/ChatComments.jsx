import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const ChatComments = ({ 
  comments = [], 
  currentUserId, 
  onAddComment, 
  onDeleteComment,
  typingUsers = [],
  onTypingStart,
  onTypingStop,
}) => {
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
    
    // Emit typing start
    if (onTypingStart) {
      onTypingStart();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to emit typing stop after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop();
      }
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || sending) return;

    setSending(true);
    
    // Emit typing stop
    if (onTypingStop) {
      onTypingStop();
    }
    
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: vi 
    });
  };

  const getUserAvatar = (user) => {
    if (user?.avatar || user?.image) {
      return user.avatar || user.image;
    }
    // Default avatar with first letter of name
    const initial = user?.name?.charAt(0).toUpperCase() || 'U';
    return `https://ui-avatars.com/api/?name=${initial}&background=random`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Chưa có bình luận nào</p>
            <p className="text-xs mt-1">Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwnMessage = comment.userId?._id === currentUserId;
            
            return (
              <div
                key={comment._id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={getUserAvatar(comment.userId)}
                    alt={comment.userId?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>

                {/* Message bubble */}
                <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {/* User name (only for others' messages) */}
                  {!isOwnMessage && (
                    <p className="text-xs font-medium text-gray-700 mb-1 px-1">
                      {comment.userId?.name}
                    </p>
                  )}

                  {/* Message content */}
                  <div
                    className={`
                      rounded-2xl px-4 py-2 break-words
                      ${isOwnMessage 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>

                  {/* Timestamp */}
                  <div className={`flex items-center gap-2 mt-1 px-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">
                      {formatTime(comment.createdAt)}
                    </span>
                    {isOwnMessage && onDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(comment._id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex gap-3 items-center">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-600">...</span>
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {typingUsers.map(u => u.name).join(', ')} đang nhập...
            </span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nhập bình luận..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || sending}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComments;
