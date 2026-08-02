import { ReactNode } from 'react';
import { ColumnType } from 'antd/es/table';

// 搜索表单字段类型
export type SearchFieldType = 'input' | 'select' | 'datePicker' | 'dateRangePicker';

// 搜索表单配置
export interface SearchField {
  name: string; // 字段名
  label: string; // 显示标签
  type: SearchFieldType; // 字段类型
  required?: boolean; // 是否必填
  defaultValue?: any; // 默认值
  width?: number | string; // 宽度
  placeholder?: string; // 占位符
  tooltip?: string; // 提示文案
  options?: { label: string; value: any }[]; // 选择器选项（仅select类型）
  props?: Record<string, any>; // 其他属性
}

// 表格列配置
export interface TableColumn<T = any> extends ColumnType<T> {
  dataIndex: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean; // 是否可排序
  render?: (value: any, record: T, index: number) => ReactNode;
}

// 分页配置
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: string[];
  showTotal?: (total: number, range: [number, number]) => ReactNode;
}

// 排序配置
export interface SortConfig {
  field?: string;
  order?: 'ascend' | 'descend';
}

// 表格配置
export interface TableListProps<T = any> {
  // 数据相关
  dataSource: T[];
  loading?: boolean;
  
  // 搜索相关
  searchFields?: SearchField[];
  onSearch?: (params: Record<string, any>) => void;
  onReset?: () => void;
  
  // 表格相关
  columns: TableColumn<T>[];
  rowKey?: string | ((record: T) => string);
  
  // 分页相关
  pagination?: PaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  
  // 排序相关
  sortConfig?: SortConfig;
  onSortChange?: (sortConfig: SortConfig) => void;
  
  // 操作相关
  onAdd?: () => void;
  onBatchDelete?: (selectedRowKeys: React.Key[]) => void;
  
  // 自定义插槽
  actionButtons?: ReactNode;
  extraHeader?: ReactNode;
  
  // 其他配置
  showSearch?: boolean; // 是否显示搜索区域
  showToolbar?: boolean; // 是否显示工具栏
  defaultExpandSearch?: boolean; // 搜索区域默认是否展开
}

// 表格工具栏配置
export interface ToolbarConfig {
  showAdd?: boolean;
  showBatchDelete?: boolean;
  showColumnSettings?: boolean;
  showRefresh?: boolean;
}

// 列设置配置
export interface ColumnSetting {
  key: string;
  title: string;
  fixed?: boolean;
  visible?: boolean;
  width?: number;
}