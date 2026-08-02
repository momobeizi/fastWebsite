import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  ReloadOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

interface TableToolbarProps {
  // 操作配置
  showAdd?: boolean;
  showBatchDelete?: boolean;
  showColumnSettings?: boolean;
  showRefresh?: boolean;
  
  // 状态
  selectedRowKeys?: React.Key[];
  loading?: boolean;
  
  // 事件处理
  onAdd?: () => void;
  onBatchDelete?: (selectedRowKeys: React.Key[]) => void;
  onRefresh?: () => void;
  onColumnSettings?: () => void;
  
  // 自定义插槽
  actionButtons?: React.ReactNode;
  extraHeader?: React.ReactNode;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  showAdd = true,
  showBatchDelete = true,
  showColumnSettings = true,
  showRefresh = true,
  selectedRowKeys = [],
  loading = false,
  onAdd,
  onBatchDelete,
  onRefresh,
  onColumnSettings,
  actionButtons,
  extraHeader
}) => {
  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    onBatchDelete?.(selectedRowKeys);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '16px',
      padding: '0 8px'
    }}>
      {/* 左侧操作按钮 */}
      <Space>
        {showAdd && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={onAdd}
            disabled={loading}
          >
            新增
          </Button>
        )}
        
        {showBatchDelete && (
          <Tooltip 
            title={selectedRowKeys.length === 0 ? '请选择要删除的数据' : undefined}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0 || loading}
            >
              批量删除 ({selectedRowKeys.length})
            </Button>
          </Tooltip>
        )}
        
        {/* 自定义操作按钮 */}
        {actionButtons}
      </Space>

      {/* 右侧操作按钮 */}
      <Space>
        {/* 额外头部内容 */}
        {extraHeader}
        
        {showRefresh && (
          <Tooltip title="刷新">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={onRefresh}
              loading={loading}
            />
          </Tooltip>
        )}
        
        {showColumnSettings && (
          <Tooltip title="列设置">
            <Button 
              icon={<SettingOutlined />} 
              onClick={onColumnSettings}
            />
          </Tooltip>
        )}
      </Space>
    </div>
  );
};

export default TableToolbar;