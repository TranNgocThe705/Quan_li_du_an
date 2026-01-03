import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/authSlice';
import toast from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff, Mail, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enableGoogleLogin = false;

  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isSystemAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth endpoint
    console.log('Google Sign-In button clicked!');
    console.log('Redirecting to:', 'https://backend.enroseze.id.vn/api/auth/google');
    window.location.href = 'https://backend.enroseze.id.vn/api/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!email || !password) {
      toast.error(t('auth.fillAllFields'));
      return;
    }

    try {
      const result = await dispatch(login({ email, password })).unwrap();
      toast.success(t('auth.loginSuccess'));
      
      // Redirect based on user role
      if (result.user?.isSystemAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Error toast already handled by API interceptor
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Project Manager
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 text-sm">
            {t('auth.welcomeBack')}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-zinc-800/50">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.loginTitle')}
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 text-sm">
              {t('auth.tagline')}
            </p>
          </div>

          {/* Google Sign In Button */}
          {enableGoogleLogin && (
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-all duration-300 mb-6 group shadow-sm hover:shadow-md"
          >
            <div className="w-5 h-5 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
              <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
              <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"/>
              <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54756 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"/>
              <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"/>
            </svg>
            </div>
            <span className="text-gray-700 dark:text-zinc-200 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {t('auth.continueWithGoogle')}
            </span>
          </button>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent"></div>
            <span className="text-gray-500 dark:text-zinc-500 text-sm font-medium">{t('auth.or')}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all bg-white dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  {t('auth.password')}
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all bg-white dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('auth.loggingIn')}</span>
                </div>
              ) : (
                <>
                  <span>{t('auth.continue')}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                {t('auth.signUp')}
              </Link>
            </p>
            
            {/* Features List */}
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
              <p className="text-xs text-gray-500 dark:text-zinc-500 mb-3 font-medium">{t('auth.featuresTitle')}</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>{t('auth.featureTaskManagement')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>{t('auth.featureTeamwork')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>{t('auth.featureAI')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
