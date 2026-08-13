import React, { useState } from "react";
import { Modal, Tooltip } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  CloseOutlined,
} from "@ant-design/icons";

interface ImagePreviewProps {
  /** 图片地址 */
  src: string;
  /** 缩略图宽度 */
  width?: number | string;
  /** 缩略图高度 */
  height?: number | string;
  /** 缩略图样式 */
  style?: React.CSSProperties;
  /** 是否圆角 */
  rounded?: boolean;
  /** 图片说明 */
  alt?: string;
}

/**
 * 公共图片预览组件
 * 点击缩略图后全屏预览，支持缩放和旋转
 */
const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  width = 120,
  height,
  style,
  rounded = true,
  alt = "图片",
}) => {
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const open = () => {
    setScale(1);
    setRotation(0);
    setVisible(true);
  };

  const close = () => setVisible(false);

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 4));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.25));
  const reset = () => { setScale(1); setRotation(0); };
  const rotate = (deg: number) => setRotation(r => r + deg);

  return (
    <>
      <Tooltip title="点击预览">
        <div
          onClick={open}
          style={{
            cursor: "zoom-in",
            display: typeof width === "string" && width.includes("%") ? "block" : "inline-block",
            width: typeof width === "string" && width.includes("%") ? width : undefined,
            ...style,
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: typeof width === "string" && width.includes("%") ? "100%" : width,
              height,
              objectFit: "cover",
              borderRadius: rounded ? 6 : 0,
              border: "1px solid #eee",
              display: "block",
            }}
          />
        </div>
      </Tooltip>

      <Modal
        open={visible}
        onCancel={close}
        footer={null}
        width="100vw"
        centered
        closable={false}
        styles={{
          content: {
            background: "rgba(0,0,0,0.85)",
            padding: 0,
            margin: 0,
            borderRadius: 0,
            boxShadow: "none",
          },
          body: {
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          },
        }}
      >
        {/* 图片 */}
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "90vw",
            maxHeight: "85vh",
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease",
            userSelect: "none",
            cursor: "grab",
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={reset}
        />

        {/* 底部工具栏 */}
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            padding: "10px 20px",
            borderRadius: 40,
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="放大"><button onClick={zoomIn} style={toolBtnStyle}><ZoomInOutlined /></button></Tooltip>
          <Tooltip title="缩小"><button onClick={zoomOut} style={toolBtnStyle}><ZoomOutOutlined /></button></Tooltip>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.3)" }} />
          <Tooltip title="左转"><button onClick={() => rotate(-90)} style={toolBtnStyle}><RotateLeftOutlined /></button></Tooltip>
          <Tooltip title="右转"><button onClick={() => rotate(90)} style={toolBtnStyle}><RotateRightOutlined /></button></Tooltip>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.3)" }} />
          <span style={{ color: "#fff", fontSize: 12, minWidth: 40, textAlign: "center" }}>{Math.round(scale * 100)}%</span>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.3)" }} />
          <Tooltip title="关闭"><button onClick={close} style={toolBtnStyle}><CloseOutlined /></button></Tooltip>
        </div>

        {/* 右上角关闭按钮 */}
        <button
          onClick={close}
          style={{
            position: "fixed",
            top: 20,
            right: 24,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <CloseOutlined />
        </button>
      </Modal>
    </>
  );
};

const toolBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
};

export default ImagePreview;
