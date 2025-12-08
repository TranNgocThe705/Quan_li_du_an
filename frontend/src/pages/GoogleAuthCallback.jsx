import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from '../features/authSlice';
import toast from 'react-hot-toast';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      
      // Fetch user data with the token
      dispatch(getMe()).then(() => {
        toast.success('Đăng nhập Google thành công!');
        navigate('/');
      }).catch(() => {
        toast.error('Không thể lấy thông tin người dùng');
        navigate('/login');
      });
    } else {
      toast.error('Đăng nhập Google thất bại');
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-zinc-300">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
