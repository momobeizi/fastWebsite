import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useMemo } from 'react';
import { useSettingStore } from '@/stores';
import { getCompleteRoutes } from './routes/modules/Index';
import { ThemeModeEnum } from '@/enums';
import { useMenuStore } from './stores/modules/menuStore';
import { useAuthStore } from './stores/modules/authStore';

// 路由渲染组件
function RouterComponent() {
  // 依赖 menuStore 中的 menus 状态，当 menus 变化时重新渲染
  const { menus } = useMenuStore();
  
  // 使用 useMemo 缓存路由配置，只在 menus 变化时重新计算
  const routes = useMemo(() => {
    return getCompleteRoutes(menus);
  }, [menus]);
  
  // 使用类型断言解决 RouteObject 类型不匹配问题
  const element = useRoutes(routes as any);
  return element;
}

function App() {
  const { themeMode, primaryColor, fontSize } = useSettingStore();
  const { loadMenus } = useMenuStore();
  const { token } = useAuthStore();

  // 组件加载时加载菜单（只有已登录时才加载）
  useEffect(() => {
    if (token) {
      loadMenus();
    }
  }, []);

  // 配置antd主题
  const themeConfig = {
    token: {
      colorPrimary: primaryColor,
      fontSize: fontSize,
      borderRadius: 4,
    },
    components: {
      Layout: {
        siderBg: themeMode === ThemeModeEnum.Dark ? '#000' : '#fff',
      },
      Menu: {
        itemColor: '#919eab',
        itemHoverColor: '#919eab',
        itemActiveColor: primaryColor,
        itemBg: themeMode === ThemeModeEnum.Dark ? '#000' : '#fff',
        itemHoverBg: themeMode === ThemeModeEnum.Dark ? '#333' : '#f5f5f5',
        itemActiveBg: themeMode === ThemeModeEnum.Dark ? '#111' : '#e6f7ff',
        activeBarBorderWidth: 0,
      }
    },
    algorithm: themeMode === ThemeModeEnum.Dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <Router>
        <RouterComponent />
      </Router>
    </ConfigProvider>
  );
}

export default App;
