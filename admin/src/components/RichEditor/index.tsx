import React, { useEffect, useRef, useState, useCallback } from 'react';
import E from 'wangeditor';
import './index.css';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  token?: string | null;
  darkMode?: boolean;
}

const RichEditor: React.FC<RichEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = '请输入内容', 
  height = 500,
  token,
  darkMode = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<E | null>(null);
  // 标记是否是外部设置内容（非用户输入），避免 onchange 回写导致光标重置
  const isExternalUpdate = useRef(false);

  // 创建编辑器
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = new E(editorRef.current);

    // 配置编辑器
    editor.config.placeholder = placeholder;
    editor.config.height = height;
    editor.config.onchange = (newHtml: string) => {
      // 如果是外部更新触发的内容变化，不回调 onChange
      if (isExternalUpdate.current) {
        isExternalUpdate.current = false;
        return;
      }
      onChange(newHtml);
    };

    // 配置上传图片
    editor.config.uploadImgServer = '/api/common/uploadFile';
    editor.config.uploadImgMaxSize = 5 * 1024 * 1024;
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif'];
    if (token) {
      editor.config.uploadImgHeaders = {
        Authorization: `Bearer ${token}`
      };
    }

    // 配置上传视频
    editor.config.uploadVideoServer = '/api/common/uploadFile';
    editor.config.uploadVideoMaxSize = 100 * 1024 * 1024;
    if (token) {
      editor.config.uploadVideoHeaders = {
        Authorization: `Bearer ${token}`
      };
    }

    // 创建编辑器
    editor.create();
    editorInstance.current = editor;

    // 设置初始内容
    if (value && value.trim()) {
      isExternalUpdate.current = true;
      editor.txt.html(value);
    }

    // 应用当前的暗夜模式
    if (darkMode) {
      editorRef.current.classList.add('wang-editor-dark');
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []); // 仅挂载时创建一次

  // 监听 value 变化，同步到编辑器（编辑模式加载文章内容时）
  useEffect(() => {
    if (!editorInstance.current) return;
    const currentHtml = editorInstance.current.txt.html();
    // 只有当外部 value 和编辑器当前内容不同时才更新
    if (value !== currentHtml) {
      isExternalUpdate.current = true;
      if (value && value.trim()) {
        editorInstance.current.txt.html(value);
      } else {
        editorInstance.current.txt.html('');
      }
    }
  }, [value]);

  // 监听 darkMode 变化
  useEffect(() => {
    if (!editorRef.current) return;
    if (darkMode) {
      editorRef.current.classList.add('wang-editor-dark');
    } else {
      editorRef.current.classList.remove('wang-editor-dark');
    }
  }, [darkMode]);

  return (
    <div ref={editorRef} className="rich-editor-container"></div>
  );
};

export default RichEditor;
