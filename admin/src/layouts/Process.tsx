import { useState } from "react";
import { Button } from "antd";
import { HomeOutlined, LeftOutlined, FullscreenOutlined, FullscreenExitOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useSettingStore } from "@/stores";
import { ThemeModeEnum } from "@/enums";

const Process = () => {
  const navigate = useNavigate();
  const { themeMode } = useSettingStore();
  // 全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 刷新按钮旋转状态
  const [isSpinning, setIsSpinning] = useState(false);

  /**
   * 切换全屏状态
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  /**
   * 刷新页面
   * 点击后图标会旋转1秒，然后刷新页面
   */
  const handleRefresh = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className={`w-full bg-${themeMode === ThemeModeEnum.Dark ? 'dark' : 'white'} flex px-2.5 py-1.5 mb-2.5`}>
      <div className="flex items-center">
        <Button size="small" icon={<LeftOutlined />} onClick={() => navigate(-1)} />
        <Button size="small" icon={<SyncOutlined spin={isSpinning} />} className="ml-0.5" onClick={handleRefresh} />
        <Button size="small" icon={<HomeOutlined />} className="ml-0.5" onClick={() => navigate("/")} />
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center">
        <Button size="small" icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} className="ml-0.5" onClick={toggleFullscreen} />
      </div>
    </div>
  );
};

export default Process;
