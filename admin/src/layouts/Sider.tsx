import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useMenuStore } from "@/stores/modules/menuStore";
import { useEffect } from "react";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

// 图标映射，用于根据字符串图标名称获取对应组件
const IconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserOutlined: <UserOutlined />,
  MenuOutlined: <MenuOutlined />,
  TeamOutlined: <TeamOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  FileOutlined: <FileOutlined />,
  InfoCircleOutlined: <InfoCircleOutlined />,
};

const Sider = () => {
  const { menus, loadMenus } = useMenuStore();
  const location = useLocation();
  
  // 组件加载时加载菜单
  useEffect(() => {
    loadMenus();
  }, [loadMenus]);
  
  // 将菜单转换为Ant Design Menu组件需要的格式
  const convertMenusToAntMenu = (menuList: any[]): any[] => {
    return menuList.map(menu => {
      const menuItem: any = {
        key: menu.id.toString(),
        icon: menu.icon ? IconMap[menu.icon] || <MenuOutlined /> : <MenuOutlined />,
        label: menu.path && menu.isRoute ? (
          <Link to={menu.path}>{menu.name}</Link>
        ) : (
          menu.name
        ),
      };
      
      // 如果有子菜单，递归转换
      if (menu.children && menu.children.length > 0) {
        menuItem.children = convertMenusToAntMenu(menu.children);
      }
      
      return menuItem;
    });
  };
  
  // 查找当前激活的菜单key
  const findActiveMenuKey = (menuList: any[], currentPath: string): string => {
    for (const menu of menuList) {
      if (menu.path === currentPath) {
        return menu.id.toString();
      }
      if (menu.children && menu.children.length > 0) {
        const found = findActiveMenuKey(menu.children, currentPath);
        if (found) {
          return found;
        }
      }
    }
    return "";
  };
  
  const activeKey = findActiveMenuKey(menus, location.pathname) || "1";
  
  return (
    <Menu
      mode="inline"
      selectedKeys={[activeKey]}
      items={convertMenusToAntMenu(menus)}
    />
  );
};

export default Sider;