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
      const hasChildren = menu.children && menu.children.length > 0;
      const isLeaf = !hasChildren && menu.path && menu.component;

      const menuItem: any = {
        key: menu.id.toString(),
        icon: menu.icon ? IconMap[menu.icon] || <MenuOutlined /> : <MenuOutlined />,
        // 只有叶子节点（有页面组件的菜单）才加 Link，目录只展示文字
        label: isLeaf ? (
          <Link to={menu.path}>{menu.name}</Link>
        ) : (
          menu.name
        ),
      };
      
      // 如果有子菜单，递归转换
      if (hasChildren) {
        menuItem.children = convertMenusToAntMenu(menu.children);
      }
      
      return menuItem;
    });
  };
  
  // 查找当前激活的菜单key，同时返回所有需要展开的父级key
  const findActiveAndOpenKeys = (menuList: any[], currentPath: string, parentKeys: string[] = []): { activeKey: string; openKeys: string[] } => {
    for (const menu of menuList) {
      if (menu.path === currentPath) {
        return { activeKey: menu.id.toString(), openKeys: parentKeys };
      }
      if (menu.children && menu.children.length > 0) {
        const result = findActiveAndOpenKeys(menu.children, currentPath, [...parentKeys, menu.id.toString()]);
        if (result.activeKey) {
          return result;
        }
      }
    }
    return { activeKey: "", openKeys: [] };
  };
  
  const { activeKey, openKeys } = findActiveAndOpenKeys(menus, location.pathname);
  
  return (
    <Menu
      mode="inline"
      selectedKeys={activeKey ? [activeKey] : ["1"]}
      defaultOpenKeys={openKeys}
      items={convertMenusToAntMenu(menus)}
    />
  );
};

export default Sider;