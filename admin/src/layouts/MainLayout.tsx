import { Layout } from "antd";
import Sider from "./Sider";
import Header from "./Header/Index";
import Content from "./Content";
import Process from "./Process";
import { useSettingStore } from "@/stores";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { layoutMode, setLayoutMode } = useSettingStore();
  const collapsed = layoutMode === 'collapsed';

  // 切换布局模式
  const handleToggleLayout = () => {
    setLayoutMode(collapsed ? 'expanded' : 'collapsed');
  };

  return (
    <Layout className="overflow-y-hidden h-screen">
      <Layout.Sider
        className="border-r border-dashed border-r-gray-200 dark:border-r-gray-600"
        trigger={null}
        width={254}
        collapsible
        collapsed={collapsed}
        onCollapse={handleToggleLayout}
      >
        <div className="flex items-center justify-center h-14">
          <img src="/logo.png" alt="logo" className="w-10 h-auto" />
          {!collapsed && <span className={`ml-2 text-black dark:text-white font-bold text-center text-2xl`}>MZ-ADMIN</span>}
        </div>
        <Sider />
      </Layout.Sider>
      <Layout className="flex flex-col overflow-y-hidden h-screen">
        <Header collapsed={collapsed} onToggle={handleToggleLayout} />
        <Process />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;