import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, message, Card, DatePicker, Space, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { listOperationLogs, cleanOperationLogs } from '@/api/operationLog';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OperationLog {
  id: number;
  operator: string;
  module: string;
  content: string;
  ip: string;
  device: string;
  createTime: string;
}

const OperationLogPage = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    module: '',
    operator: '',
    startTime: '',
    endTime: '',
  });
  const [cleanModalVisible, setCleanModalVisible] = useState(false);
  const [cleanTimeRange, setCleanTimeRange] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, searchParams]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await listOperationLogs({
        pageNum: page,
        pageSize: pageSize,
        ...searchParams,
      });
      if (response.code === 200) {
        setLogs(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('获取操作日志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCleanLogs = async () => {
    if (!cleanTimeRange || cleanTimeRange.length !== 2) {
      message.error('请选择清理时间范围');
      return;
    }

    try {
      const startTime = cleanTimeRange[0].format('YYYY-MM-DD HH:mm:ss');
      const endTime = cleanTimeRange[1].format('YYYY-MM-DD HH:mm:ss');
      const response = await cleanOperationLogs(startTime, endTime);
      if (response.code === 200) {
        message.success('操作日志清理成功');
        setCleanModalVisible(false);
        fetchLogs();
      } else {
        message.error('操作日志清理失败');
      }
    } catch (error) {
      message.error('操作日志清理失败');
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setSearchParams({
      module: '',
      operator: '',
      startTime: '',
      endTime: '',
    });
    setPage(1);
  };

  const columns = [
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="操作日志">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input
              placeholder="操作人"
              value={searchParams.operator}
              onChange={(e) => setSearchParams({ ...searchParams, operator: e.target.value })}
              style={{ width: 200 }}
            />
            <Select
              placeholder="操作模块"
              value={searchParams.module}
              onChange={(value) => setSearchParams({ ...searchParams, module: value })}
              style={{ width: 200 }}
            >
              <Option value="">全部</Option>
              <Option value="article">文章管理</Option>
              <Option value="category">分类管理</Option>
              <Option value="tag">标签管理</Option>
              <Option value="carousel">轮播图管理</Option>
              <Option value="user">用户管理</Option>
              <Option value="role">角色管理</Option>
              <Option value="menu">菜单管理</Option>
              <Option value="websiteConfig">网站配置</Option>
            </Select>
            <RangePicker
              onChange={(dates) => {
                if (dates) {
                  setSearchParams({
                    ...searchParams,
                    startTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
                    endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
                  });
                } else {
                  setSearchParams({
                    ...searchParams,
                    startTime: '',
                    endTime: '',
                  });
                }
              }}
            />
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </div>
          <Button danger icon={<DeleteOutlined />} onClick={() => setCleanModalVisible(true)}>
            清理日志
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />

        <Modal
          title="清理操作日志"
          open={cleanModalVisible}
          onOk={handleCleanLogs}
          onCancel={() => setCleanModalVisible(false)}
        >
          <p>请选择要清理的日志时间范围：</p>
          <RangePicker
            style={{ width: '100%', marginTop: 16 }}
            onChange={(dates) => setCleanTimeRange(dates || [])}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default OperationLogPage;