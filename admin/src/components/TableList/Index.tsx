/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import React, { useState, useMemo } from "react";
import { Table, Empty, Spin, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import type { TableListProps, TableColumn, SortConfig } from "./types";
import SearchForm from "./components/SearchForm";
import TableToolbar from "./components/TableToolbar";
import ColumnSettings from "./components/ColumnSettings";

const TableList = <T extends any>({
  // 数据相关
  dataSource = [],
  loading = false,

  // 搜索相关
  searchFields = [],
  onSearch,
  onReset,

  // 表格相关
  columns: originalColumns = [],
  rowKey = "id",

  // 分页相关
  pagination,
  onPageChange,

  // 排序相关
  sortConfig,
  onSortChange,

  // 操作相关
  onAdd,
  onBatchDelete,

  // 自定义插槽
  actionButtons,
  extraHeader,

  // 其他配置
  showSearch = true,
  showToolbar = true,
  defaultExpandSearch = false,
}: TableListProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [localColumns, setLocalColumns] =
    useState<TableColumn<T>[]>(originalColumns);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // 处理搜索
  const handleSearch = (params: Record<string, any>) => {
    // 搜索时重置页码为1
    if (pagination && pagination.current !== 1) {
      onPageChange?.(1, pagination.pageSize);
    }
    onSearch?.(params);
  };

  // 处理重置
  const handleReset = () => {
    setSelectedRowKeys([]);
    onReset?.();
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    setSelectedRowKeys([]);
    onPageChange?.(page, pageSize || pagination?.pageSize || 10);
  };

  // 处理排序变化
  const handleSortChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter && sorter.column && sorter.column.sortable) {
      const newSortConfig: SortConfig = {
        field: sorter.field as string,
        order: sorter.order,
      };
      onSortChange?.(newSortConfig);
    } else {
      onSortChange?.({});
    }
  };

  // 处理批量删除
  const handleBatchDelete = (keys: React.Key[]) => {
    onBatchDelete?.(keys);
    setSelectedRowKeys([]);
  };

  // 处理列选择
  const handleRowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    fixed: true,
  };

  // 配置分页
  const paginationConfig = useMemo(() => {
    if (!pagination) return false;

    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: pagination.showSizeChanger ?? true,
      showQuickJumper: pagination.showQuickJumper ?? true,
      pageSizeOptions: pagination.pageSizeOptions ?? ["10", "20", "50", "100"],
      showTotal:
        pagination.showTotal ??
        ((total, range) => `共 ${total} 条`),
      onChange: handlePageChange,
      onShowSizeChange: handlePageChange,
    };
  }, [pagination, onPageChange]);

  // 处理列排序
  const processedColumns = useMemo(() => {
    return localColumns.map((column) => ({
      ...column,
      sorter: column.sortable ? true : false,
      align: column.align || "left",
      ellipsis: column.ellipsis ?? true,
    }));
  }, [localColumns]);

  // 空状态显示
  const emptyText = useMemo(() => {
    if (loading) return null;
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
    );
  }, [loading]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="p-2 bg-white dark:bg-[#333]">
        {/* 搜索区域 */}
        {showSearch && searchFields.length > 0 && (
          <SearchForm
            fields={searchFields}
            onSearch={handleSearch}
            onReset={handleReset}
            defaultExpand={defaultExpandSearch}
            loading={loading}
          />
        )}

        <div className="bg-white dark:bg-[#333] p-2">
          {/* 工具栏 */}
          {showToolbar && (
            <TableToolbar
              showAdd={!!onAdd}
              showBatchDelete={!!onBatchDelete}
              showColumnSettings={true}
              showRefresh={true}
              selectedRowKeys={selectedRowKeys}
              loading={loading}
              onAdd={onAdd}
              onBatchDelete={handleBatchDelete}
              onRefresh={handleReset}
              onColumnSettings={() => {
                setShowColumnSettings(true);
              }}
              actionButtons={actionButtons}
              extraHeader={extraHeader}
            />
          )}

          {/* 表格区域 */}
          <Spin spinning={loading}>
            <Table<T>
              columns={processedColumns}
              dataSource={dataSource}
              rowKey={rowKey}
              pagination={paginationConfig}
              onChange={handleSortChange}
              rowSelection={onBatchDelete ? handleRowSelection : undefined}
              locale={{ emptyText: emptyText }}
              scroll={{ x: "max-content" }}
              size="middle"
              bordered
            />
          </Spin>

          {/* 列设置 */}
          <ColumnSettings
            columns={originalColumns}
            visible={showColumnSettings}
            onVisibleChange={setShowColumnSettings}
            onColumnsChange={setLocalColumns}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TableList;
