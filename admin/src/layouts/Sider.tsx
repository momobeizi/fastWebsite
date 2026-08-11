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
  
  // 将菜单转换为Ant Design Menu组件需要的格式，过滤掉不可见的
  const convertMenusToAntMenu = (menuList: any[]): any[] => {
    return menuList
      .filter(menu => menu.visible !== 0)
      .map(menu => {
        const children = menu.children?.filter((child: any) => child.visible !== 0);
        const hasChildren = children && children.length > 0;
        const isLeaf = !hasChildren && menu.path && menu.component;

        const menuItem: any = {
          key: menu.id.toString(),
          icon: menu.icon ? IconMap[menu.icon] || <MenuOutlined /> : <MenuOutlined />,
          label: isLeaf ? (
            <Link to={menu.path}>{menu.name}</Link>
          ) : (
            menu.name
          ),
        };
        
        if (hasChildren) {
          menuItem.children = convertMenusToAntMenu(children);
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