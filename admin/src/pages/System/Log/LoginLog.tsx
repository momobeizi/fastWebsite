import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { loginLogListApi } from '@/api/loginLog';
import { ReloadOutlined } from '@ant-design/icons';

interface LoginLogItem {
  id: number;
  username: string;
  nickname: string;
  ip: string;
  device: string;
  os: string;
  browser: string;
  status: string;
  failReason: string;
  createTime: string;
}

const LoginLog: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<LoginLogItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取登录日志列表
  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await loginLogListApi({
        pageNum: page,
        pageSize: pageSize,
      });
      if (res.code === 200 || res.code === 0) {
        setDataSource(res.data?.list || []);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: res.data?.total || 0,
        });
      } else {
        message.error(res.msg || '获取登录日志失败');
      }
    } catch (error) {
      console.error('获取登录日志失败:', error);
      message.error('获取登录日志失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 表格列定义
  const columns: ColumnsType<LoginLogItem> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
    },
    {
      title: '设备类型',
      dataIndex: 'device',
      key: 'device',
      width: 100,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      width: 100,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      width: 100,
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      key: 'failReason',
      width: 150,
      ellipsis: true,
    },
    {
      title: '登录时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
  ];

  // 分页变化
  const handleTableChange = (pag: any) => {
    fetchData(pag.current, pag.pageSize);
  };

  return (
    <Card
      title="登录日志"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData()}>
            刷新
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default LoginLog;
