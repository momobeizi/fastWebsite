import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Checkbox, 
  InputNumber, 
  Space, 
  Button, 
  Divider,
  Typography 
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { TableColumn } from '../types';

const { Text } = Typography;

interface ColumnSettingsProps<T = any> {
  columns: TableColumn<T>[];
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onColumnsChange?: (columns: TableColumn<T>[]) => void;
}

interface ColumnSetting {
  key: string;
  title: string;
  visible: boolean;
  width?: number;
  fixed?: boolean;
}

const ColumnSettings = <T extends any>({
  columns,
  visible = false,
  onVisibleChange,
  onColumnsChange
}: ColumnSettingsProps<T>) => {
  const [localVisible, setLocalVisible] = useState(visible);
  
  // 同步外部visible状态到内部状态
  useEffect(() => {
    setLocalVisible(visible);
  }, [visible]);
  const [columnSettings, setColumnSettings] = useState<ColumnSetting[]>(() => {
    return columns.map(col => ({
      key: col.dataIndex as string,
      title: col.title as string,
      visible: true,
      width: typeof col.width === 'number' ? col.width : undefined,
      fixed: col.fixed as boolean
    }));
  });

  // 处理可见性变化
  const handleVisibleChange = (key: string, visible: boolean) => {
    const newSettings = columnSettings.map(setting =>
      setting.key === key ? { ...setting, visible } : setting
    );
    setColumnSettings(newSettings);
  };

  // 处理宽度变化
  const handleWidthChange = (key: string, width: number | null) => {
    const newSettings = columnSettings.map(setting =>
      setting.key === key ? { ...setting, width: width || undefined } : setting
    );
    setColumnSettings(newSettings);
  };

  // 处理固定列变化
  const handleFixedChange = (key: string, fixed: boolean) => {
    const newSettings = columnSettings.map(setting =>
      setting.key === key ? { ...setting, fixed } : setting
    );
    setColumnSettings(newSettings);
  };

  // 应用设置
  const handleApply = () => {
    const newColumns = columns.map(col => {
      const setting = columnSettings.find(s => s.key === col.dataIndex);
      if (!setting) return col;
      
      return {
        ...col,
        width: setting.width,
        fixed: setting.fixed,
        // 如果列被隐藏，设置宽度为0
        ...(setting.visible ? {} : { width: 0, ellipsis: false })
      };
    }).filter(col => {
      const setting = columnSettings.find(s => s.key === col.dataIndex);
      return setting?.visible !== false;
    });

    onColumnsChange?.(newColumns);
    handleClose();
  };

  // 重置设置
  const handleReset = () => {
    const resetSettings = columns.map(col => ({
      key: col.dataIndex as string,
      title: col.title as string,
      visible: true,
      width: typeof col.width === 'number' ? col.width : undefined,
      fixed: col.fixed as boolean
    }));
    setColumnSettings(resetSettings);
  };

  // 关闭弹窗
  const handleClose = () => {
    setLocalVisible(false);
    onVisibleChange?.(false);
  };

  // 显示弹窗
  const handleShow = () => {
    setLocalVisible(true);
    onVisibleChange?.(true);
  };

  // 处理取消按钮
  const handleCancel = () => {
    handleClose();
  };

  return (
    <>
      {/* <Button 
        icon={<SettingOutlined />} 
        onClick={handleShow}
        title="列设置"
      /> */}
      
      <Modal
        title="列设置"
        open={localVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="reset" onClick={handleReset}>
            重置
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply}>
            应用
          </Button>
        ]}
        width={600}
      >
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {columnSettings.map((setting, index) => (
              <div key={setting.key}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    <Checkbox
                      checked={setting.visible}
                      onChange={(e) => handleVisibleChange(setting.key, e.target.checked)}
                    >
                      <Text ellipsis={{ tooltip: setting.title }} style={{ width: '120px' }}>
                        {setting.title}
                      </Text>
                    </Checkbox>
                  </Space>
                  
                  <Space>
                    <Text>宽度:</Text>
                    <InputNumber
                      min={0}
                      max={500}
                      value={setting.width}
                      onChange={(value) => handleWidthChange(setting.key, value)}
                      disabled={!setting.visible}
                      style={{ width: '80px' }}
                    />
                    
                    <Checkbox
                      checked={setting.fixed}
                      onChange={(e) => handleFixedChange(setting.key, e.target.checked)}
                      disabled={!setting.visible}
                    >
                      固定
                    </Checkbox>
                  </Space>
                </Space>
                
                {index < columnSettings.length - 1 && <Divider style={{ margin: '8px 0' }} />}
              </div>
            ))}
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default ColumnSettings;