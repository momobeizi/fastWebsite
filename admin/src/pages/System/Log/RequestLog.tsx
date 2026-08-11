import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, ClearOutlined, EyeOutlined } from "@ant-design/icons";
import { TableList, type SearchField, type TableColumn } from "@/components/TableList";
import { getRequestLogListApi, deleteRequestLogApi, clearRequestLogsApi } from "@/api/log";

interface RequestLog {
  id: number;
  userId?: number;
  username?: string;
  url: string;
  method: string;
  params?: string;
  body?: string;
  ip?: string;
  statusCode?: number;
  duration: number;
  createTime: string;
}

const methodColors: Record<string, string> = {
  GET: "green",
  POST: "blue",
  PUT: "orange",
  DELETE: "red",
  PATCH: "purple",
};

const searchFields: SearchField[] = [
  {
    name: "search",
    label: "请求地址/用户",
    type: "input",
    placeholder: "请输入请求地址或用户名",
    width: 240,
  },
];

const RequestLogPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RequestLog[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<RequestLog | null>(null);

  useEffect(() => {
    getLogList();
  }, []);

  const getLogList = async () => {
    setLoading(true);
    try {
      const res: any = await getRequestLogListApi({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchParams.search || undefined,
      });
      if (res?.data) {
        setData((res.data as any)?.list || []);
        setPagination((prev) => ({
          ...prev,
          total: (res.data as any)?.total || 0,
        }));
      }
    } catch {
      message.error("获取日志列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params: Record<string, any>) => {
    setSearchParams(params);
    setLoading(true);
    try {
      const res: any = await getRequestLogListApi({
        page: 1,
        limit: pagination.pageSize,
        search: params.search || undefined,
      });
      if (res?.data) {
        setData((res.data as any)?.list || []);
        setPagination((prev) => ({
          ...prev,
          current: 1,
          total: (res.data as any)?.total || 0,
        }));
      }
    } catch {
      message.error("搜索失败");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({});
    getLogList();
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    getLogList();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRequestLogApi(id);
      message.success("删除成功");
      getLogList();
    } catch {
      message.error("删除失败");
    }
  };

  const handleClear = async () => {
    try {
      await clearRequestLogsApi();
      message.success("清空成功");
      getLogList();
    } catch {
      message.error("清空失败");
    }
  };

  const showDetail = (record: RequestLog) => {
    setDetailData(record);
    setDetailVisible(true);
  };

  const formatJson = (str?: string) => {
    if (!str) return "-";
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  const columns: TableColumn<RequestLog>[] = [
    {
      title: "序号",
      dataIndex: "index",
      width: 50,
      align: "center",
      render: (_v, _r, index: number) => index + 1,
    },
    {
      title: "请求方法",
      dataIndex: "method",
      width: 80,
      align: "center",
      render: (value: string) => <Tag color={methodColors[value] || "default"}>{value}</Tag>,
    },
    {
      title: "请求地址",
      dataIndex: "url",
      width: 220,
      ellipsis: true,
      render: (value: string) => (
        <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip>
      ),
    },
    {
      title: "用户",
      dataIndex: "username",
      width: 100,
      render: (value: string) => value || "-",
    },
    {
      title: "IP",
      dataIndex: "ip",
      width: 140,
      render: (value: string) => value || "-",
    },
    {
      title: "耗时",
      dataIndex: "duration",
      width: 80,
      align: "center",
      render: (value: number) => {
        const color = value > 1000 ? "red" : value > 500 ? "orange" : "green";
        return <Tag color={color}>{value}ms</Tag>;
      },
    },
    {
      title: "请求时间",
      dataIndex: "createTime",
      width: 170,
      sortable: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_: any, record: RequestLog) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => showDetail(record)}>
            详情
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableList
        dataSource={data}
        loading={loading}
        searchFields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        columns={columns}
        rowKey="id"
        pagination={pagination}
        onPageChange={handlePageChange}
        showSearch={true}
        showToolbar={true}
        defaultExpandSearch={false}
        actionButtons={
          <Popconfirm title="确定清空所有日志？" description="此操作不可恢复" onConfirm={handleClear}>
            <Button danger icon={<ClearOutlined />}>
              清空日志
            </Button>
          </Popconfirm>
        }
      />

      <Modal
        title="请求详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {detailData && (
          <div style={{ maxHeight: 500, overflow: "auto" }}>
            <p><strong>请求方法：</strong><Tag color={methodColors[detailData.method]}>{detailData.method}</Tag></p>
            <p><strong>请求地址：</strong>{detailData.url}</p>
            <p><strong>用户：</strong>{detailData.username || "-"} (ID: {detailData.userId || "-"})</p>
            <p><strong>IP：</strong>{detailData.ip || "-"}</p>
            <p><strong>耗时：</strong>{detailData.duration}ms</p>
            <p><strong>时间：</strong>{detailData.createTime}</p>
            <p><strong>Query 参数：</strong></p>
            <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4, maxHeight: 150, overflow: "auto" }}>
              {formatJson(detailData.params)}
            </pre>
            <p><strong>Body：</strong></p>
            <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4, maxHeight: 150, overflow: "auto" }}>
              {formatJson(detailData.body)}
            </pre>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RequestLogPage;
