import { Button, Avatar, Dropdown, Space, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";
import { authApi } from "@/api/auth";
import Setting from "./components/Setting";



const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header = ({ collapsed, onToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const { userInfo, logout: logoutStore } = useAuthStore();

  const handleLogout = async () => {
    await authApi.logout();
    logoutStore();
    message.success("退出登录成功");
    navigate("/login");
  };

  const userMenu = [
    {
      key: "1",
      label: (
        <div onClick={(e) => e.preventDefault()}>
          <UserOutlined /> 个人中心
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={(e) => e.preventDefault()}>
          <SettingOutlined /> 系统设置
        </div>
      ),
    },
    {
      key: "3",
      type: "divider" as const,
    },
    {
      key: "4",
      label: (
        <div onClick={handleLogout} style={{ color: "#ff4d4f" }}>
          <LogoutOutlined /> 退出登录
        </div>
      ),
    },
  ];

  return (
    <div className={`w-full h-14 bg-white dark:bg-black flex items-center justify-between px-2.5 border-b border-gray-200 dark:border-gray-600`}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        className="w-8 h-8 text-base"
      />

      <Space>
        <Setting />
        <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
          <Button
            type="text"
            className="flex items-center"
          >
            <Text className="text-sm font-medium">
              {userInfo?.username || "未知用户"}
            </Text>
            <Avatar
              icon={<UserOutlined />}
              src={userInfo?.photo}
              className="w-8 h-8 bg-amber-100"
            />
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Header;