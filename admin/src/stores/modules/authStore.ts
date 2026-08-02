import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfoInterface } from "@/types";
import { useMenuStore } from "./menuStore";

// 认证状态类型
interface AuthState {
  token: string | null;
  userInfo: UserInfoInterface | null;

  // 登录
  login: (token: string, userInfo: UserInfoInterface) => void;

  // 退出登录
  logout: () => void;

  // 更新用户信息
  updateUserInfo: (userInfo: UserInfoInterface) => void;

  isAuthenticated: () => boolean;
}

// 创建认证状态管理
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      token: null,
      userInfo: null,

      // 登录
      login: (token: string, userInfo: UserInfoInterface) => {
        set({
          token,
          userInfo,
        });
      },

      // 退出登录
      logout: () => {
        // 清空 auth 状态
        set({
          token: null,
          userInfo: null,
        });
        
        // 清空 menu 状态
        useMenuStore.getState().clearMenus();
      },

      // 更新用户信息
      updateUserInfo: (userInfo: UserInfoInterface) => {
        set({
          userInfo,
        });
      },

      // 派生状态：是否已认证（基于 token 是否存在）
      isAuthenticated: () => !!get().token,
    }),
    {
      // 持久化配置
      name: "auth-storage",
      // 只持久化 token 和 userInfo
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
      }),
    }
  )
)
