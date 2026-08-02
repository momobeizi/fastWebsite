/**
 * 主题模式
 */
export type ThemeModeType = 'light' | 'dark';

/**
 * 布局模式
 */
export type LayoutModeType = 'expanded' | 'collapsed';

/**
 * 字体类型
 */
export type FontType = 'system' | 'custom';

/**
 * 设置类型
 */
export interface SettingType {
  themeMode: ThemeModeType;
  layoutMode: LayoutModeType;
  primaryColor: string;
  fontFamily: FontType;
  fontSize: number;
}

