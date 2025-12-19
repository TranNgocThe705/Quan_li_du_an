import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { chatWithAI } from '../../../services/aiService';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage = {
    id: 1,
    role: 'assistant',
    content: '👋 Xin chào! Tôi là AI Assistant.\n\nTôi có thể giúp bạn:\n\n✨ Gợi ý phân công công việc\n⏰ Dự đoán thời gian hoàn thành\n📊 Phân tích tiến độ dự án\n💡 Trả lời câu hỏi về hệ thống\n\nHãy hỏi tôi bất cứ điều gì! 😊',
    timestamp: new Date()
  };
  const [messages, setMessages] = useState([initialMessage]);
  
  const quickActions = [
    '📝 Làm sao để tạo project mới?',
    '👥 Phân quyền hoạt động như thế nào?',
    '✅ Cách theo dõi tiến độ task?',
    '🤖 AI có thể giúp gì?'
  ];
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleClearChat = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) {
      setMessages([initialMessage]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call AI API
      const response = await chatWithAI(currentMessage, 'general');

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response.data?.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      console.error('Error details:', error.response?.data);
      
      // Fallback response với thông tin chi tiết hơn
      let errorContent = 'Xin lỗi, tôi đang gặp vấn đề kết nối. ';
      
      if (error.response?.status === 401) {
        errorContent = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 500) {
        errorContent = 'Lỗi server AI. Vui lòng thử lại sau.';
      } else if (error.response?.data?.message) {
        errorContent = error.response.data.message;
      } else {
        errorContent += 'Vui lòng thử lại sau.';
      }
      
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Open AI Chat"
        >
          <Sparkles className="size-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[550px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-white/80 text-xs">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Xóa cuộc trò chuyện"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title="Đóng"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.role === 'user' ? 'text-white/70' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Quick Actions - Show only on first message */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 px-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Câu hỏi gợi ý:</p>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(action);
                      // Auto submit
                      setTimeout(() => {
                        const userMessage = {
                          id: messages.length + 1,
                          role: 'user',
                          content: action,
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setInputValue('');
                        setIsLoading(true);
                        
                        // Call API
                        chatWithAI(action, 'general').then(response => {
                          const aiMessage = {
                            id: messages.length + 2,
                            role: 'assistant',
                            content: response.data?.response || 'Xin lỗi, tôi không thể trả lời.',
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, aiMessage]);
                        }).catch(error => {
                          console.error('AI Chat Error:', error);
                          const errorMessage = {
                            id: messages.length + 2,
                            role: 'assistant',
                            content: 'Xin lỗi, đã có lỗi xảy ra.',
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, errorMessage]);
                        }).finally(() => {
                          setIsLoading(false);
                        });
                      }, 100);
                    }}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-zinc-700 dark:text-zinc-300"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="size-4 text-purple-500 animate-spin" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">AI đang suy nghĩ...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Hỏi AI bất cứ điều gì..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 max-h-[100px] overflow-y-auto"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="size-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
              Nhấn Enter để gửi, Shift + Enter để xuống dòng
            </p>
          </div>
        </div>
      )}
    </>
  );
}
