import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from "@/stores";
import { authApi } from '../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const { isAuthenticated, token, updateUserInfo, logout } = useAuthStore();
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        // 验证 token 有效性并获取最新用户信息
        const userInfo = await authApi.getUserInfo();
        updateUserInfo(userInfo.data);
      } catch (error) {
        console.error(error);
        // token 无效，清除登录状态（注意：这里不要跳转，由响应拦截器处理）
        logout();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  // 如果还在检查中，返回 null 或加载组件
  if (isChecking) {
    return null;
  }

  // 如果已认证，显示子组件
  if (isAuthenticated()) {
    return <>{children}</>;
  }

  // 否则重定向到登录页面
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;