import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { getProjectInsights } from '../services/aiService';
import toast from 'react-hot-toast';

export default function AIProjectInsights({ projectId }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInsights = async () => {
    if (!projectId) {
      console.warn('⚠️ AIProjectInsights: No projectId provided');
      return;
    }

    console.log('🤖 Loading AI insights for project:', projectId);
    setLoading(true);
    setError(null);

    try {
      const result = await getProjectInsights(projectId);
      console.log('✅ AI insights result:', result);
      
      if (result.success) {
        setInsights(result.data);
      } else {
        const errorMsg = result.message || 'Không thể tải AI insights';
        console.error('❌ AI insights failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi gọi AI';
      console.error('❌ AI insights error:', err);
      console.error('Error details:', err.response?.data);
      setError(errorMsg);
      toast.error('Lỗi khi phân tích dự án bằng AI: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      'at-risk': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
      'critical': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    };
    return colors[status] || colors['at-risk'];
  };

  const getStatusIcon = (status) => {
    const icons = {
      'on-track': <CheckCircle className="size-5" />,
      'at-risk': <AlertTriangle className="size-5" />,
      'critical': <AlertTriangle className="size-5" />
    };
    return icons[status] || icons['at-risk'];
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-5 text-purple-600 dark:text-purple-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">AI Đang Phân Tích...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Lỗi AI</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
        <button
          onClick={loadInsights}
          className="mt-4 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition"
        >
          Thử Lại
        </button>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">AI Project Insights</h3>
        </div>
        <button
          onClick={loadInsights}
          className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          Làm mới
        </button>
      </div>

      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(insights.status)} mb-4`}>
        {getStatusIcon(insights.status)}
        <span className="font-semibold text-sm uppercase">
          {insights.status === 'on-track' && 'Đúng tiến độ'}
          {insights.status === 'at-risk' && 'Có rủi ro'}
          {insights.status === 'critical' && 'Nghiêm trọng'}
        </span>
      </div>

      {/* Health Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Điểm sức khỏe dự án</span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{insights.healthScore}/100</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              insights.healthScore >= 70
                ? 'bg-green-500'
                : insights.healthScore >= 40
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${insights.healthScore}%` }}
          ></div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {insights.summary}
        </p>
      </div>

      {/* Risks */}
      {insights.risks && insights.risks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Rủi ro tiềm ẩn</h4>
          </div>
          <ul className="space-y-2">
            {insights.risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠️</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="size-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Khuyến nghị cải thiện</h4>
          </div>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">💡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
