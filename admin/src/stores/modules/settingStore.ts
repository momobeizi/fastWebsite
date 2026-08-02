import { ThemeModeEnum, LayoutModeEnum, FontTypeEnum, PresetColorEnum } from "@/enums";
import type { ThemeModeType, LayoutModeType, FontType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 认证状态类型
interface SettingStore {
    themeMode: ThemeModeType;
    layoutMode: LayoutModeType;
    primaryColor: string;
    fontFamily: FontType;
    fontSize: number;
    setThemeMode: (themeMode: ThemeModeType) => void;
    setLayoutMode: (layoutMode: LayoutModeType) => void;
    setPrimaryColor: (primaryColor: string) => void;
    setFontFamily: (fontFamily: FontType) => void;
    setFontSize: (fontSize: number) => void;
}

// 创建设置状态管理
export const useSettingStore = create<SettingStore>()(
    persist(
        (set) => ({
            // 初始状态
            themeMode: ThemeModeEnum.Light,
            layoutMode: LayoutModeEnum.Expanded,
            primaryColor: PresetColorEnum.Blue,
            fontFamily: FontTypeEnum.System,
            fontSize: 14,

            // 设置主题模式
            setThemeMode: (themeMode: ThemeModeType) => {
                set({ themeMode });
            },

            // 设置布局模式
            setLayoutMode: (layoutMode: LayoutModeType) => {
                set({ layoutMode });
            },

            // 设置主题色
            setPrimaryColor: (primaryColor: string) => {
                set({ primaryColor });
            },

            // 设置字体
            setFontFamily: (fontFamily: FontType) => {
                set({ fontFamily });
            },

            // 设置字体大小
            setFontSize: (fontSize: number) => {
                set({ fontSize });
            },
        }),
        {
            // 持久化配置
            name: "setting-storage",
            // 持久化所有设置
            partialize: (state) => ({
                themeMode: state.themeMode,
                layoutMode: state.layoutMode,
                primaryColor: state.primaryColor,
                fontFamily: state.fontFamily,
                fontSize: state.fontSize,
            }),
        }
    )
);

