import React, { useState, useEffect, useRef } from 'react';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import './index.css';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  token?: string | null;
  // 兼容旧调用，暂未实现暗色主题
  darkMode?: boolean;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder = '请输入内容',
  height = 400,
  token,
  darkMode,
}) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 源码模式
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(value);
  const editorRef = useRef<IDomEditor | null>(null);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['group-video', 'fullScreen'],
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    // 图片上传配置
    MENU_CONF: {
      uploadImage: {
        server: '/api/common/uploadFile',
        fieldName: 'file',
        maxFileSize: 5 * 1024 * 1024,
        allowedFileTypes: ['image/*'],
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        // 后端返回 { code, message, data: url }，自定义插入逻辑
        customInsert(res: any, insertFn: (url: string, alt: string, href: string) => void) {
          const url = res?.data || res?.url || res;
          if (url) insertFn(url, '', '');
        },
      },
      // 视频上传配置
      uploadVideo: {
        server: '/api/common/uploadFile',
        fieldName: 'file',
        maxFileSize: 100 * 1024 * 1024,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        customInsert(res: any, insertFn: (url: string, poster: string) => void) {
          const url = res?.data || res?.url || res;
          if (url) insertFn(url, '');
        },
      },
    },
  };

  // 组件卸载时销毁编辑器
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  // 编辑器创建回调
  const handleCreated = (newEditor: IDomEditor) => {
    editorRef.current = newEditor;
    setEditor(newEditor);
  };

  // 切换到源码模式
  const switchToSource = () => {
    const html = editorRef.current?.getHtml() || value || '';
    setSourceHtml(html);
    setIsSourceMode(true);
    // 清空 editor 引用，防止 Toolbar 使用已销毁实例
    setEditor(null);
  };

  // 切换到富文本模式
  const switchToRich = () => {
    // 先同步内容给父组件
    onChange(sourceHtml);
    // 切换到富文本模式，编辑器重新挂载并用 value 初始化
    setIsSourceMode(false);
  };

  return (
    <div className="rich-editor-wrapper">
      {/* 模式切换按钮 */}
      <div className="flex items-center justify-end mb-2">
        {isSourceMode ? (
          <button
            type="button"
            onClick={switchToRich}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            切换到富文本
          </button>
        ) : (
          <button
            type="button"
            onClick={switchToSource}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {'</> 源码模式'}
          </button>
        )}
      </div>

      {isSourceMode ? (
        <textarea
          value={sourceHtml}
          onChange={(e) => setSourceHtml(e.target.value)}
          placeholder="在此编辑 HTML 源码"
          style={{
            width: '100%',
            height,
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            padding: 12,
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
          }}
        />
      ) : (
        <div className="rich-editor-container" style={{ border: '1px solid #d9d9d9', borderRadius: 4, zIndex: 100 }}>
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #e5e5e5' }}
          />
          <Editor
            key="rich-editor"
            defaultConfig={editorConfig}
            value={value}
            onCreated={handleCreated}
            onChange={(newEditor) => onChange(newEditor.getHtml())}
            mode="default"
            style={{ height, overflowY: 'hidden' }}
          />
        </div>
      )}
    </div>
  );
};

export default RichEditor;
