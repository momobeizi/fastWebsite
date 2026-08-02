import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Image } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getCarouselListApi, deleteCarouselApi, updateCarouselStatusApi } from "@/api/carousel";

interface Carousel {
  id: number;
  image: string;
  title: string;
  link: string;
  sort: number;
  status: string;
  createTime: string;
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: "title",
    label: "标题",
    type: "input",
    placeholder: "请输入标题",
    width: 200,
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "启用", value: "enabled" },
      { label: "禁用", value: "disabled" },
    ],
    width: 120,
  },
];

// 表格列配置
const columns: TableColumn<Carousel>[] = [
  {
    title: "序号",
    dataIndex: "index",
    width: 30,
    align: "center",
    render: (_value, _record, index: number) => (index + 1)
  },
  {
    title: "图片",
    dataIndex: "image",
    width: 100,
    align: "center",
    render: (value: string) => (
      <Image
        src={value}
        alt="轮播图"
        style={{ width: 80, height: 40, objectFit: 'cover' }}
      />
    ),
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 150,
  },
  {
    title: "链接",
    dataIndex: "link",
    width: 200,
  },
  {
    title: "排序",
    dataIndex: "sort",
    width: 80,
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 100,
    align: "center",
    render: (value: string) => (
      <Tag color={value === "enabled" ? "green" : "red"}>
        {value === "enabled" ? "启用" : "禁用"}
      </Tag>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 150,
    sortable: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 200,
    align: "center",
    fixed: "right",
    render: (_, record) => (
      <Space>
        <Button
          type="link"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
        {record.status === "disabled" ? (
          <Button
            type="link"
            icon={<CheckCircleOutlined />}
            size="small"
            onClick={() => handleStatus(record.id, "enabled")}
          >
            启用
          </Button>
        ) : (
          <Button
            type="link"
            icon={<CloseCircleOutlined />}
            size="small"
            onClick={() => handleStatus(record.id, "disabled")}
          >
            禁用
          </Button>
        )}
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      </Space>
    ),
  },
];

const CarouselList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Carousel[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  // 组件挂载时获取轮播图列表
  useEffect(() => {
    getCarouselList();
  }, []);

  const getCarouselList = async () => {
    setLoading(true);
    try {
      const res = await getCarouselListApi({
        ...searchParams,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        setData(res.data?.list || []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.total || 0,
        }));
      } else {
        message.error("获取轮播图列表失败");
      }
    } catch (error) {
      console.error("获取轮播图列表时发生错误:", error);
      message.error("获取轮播图列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async (params: Record<string, any>) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const res = await getCarouselListApi({
        ...params,
        pageNum: 1,
        pageSize: pagination.pageSize,
      });
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        setData(res.data?.list || []);
        setPagination((prev) => ({
          ...prev,
          current: 1,
          total: res.data?.total || 0,
        }));
      } else {
        message.error("搜索轮播图失败");
      }
    } catch (error) {
      console.error("搜索轮播图时发生错误:", error);
      message.error("搜索轮播图失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({});
    getCarouselList();
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    getCarouselList();
  };

  // 处理新增
  const handleAdd = () => {
    console.log("新增轮播图");
  };

  // 处理编辑
  const handleEdit = (record: Carousel) => {
    console.log("编辑轮播图:", record);
  };

  // 处理状态更新
  const handleStatus = async (id: number, status: string) => {
    try {
      const res = await updateCarouselStatusApi(id, status);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success(status === "enabled" ? "启用成功" : "禁用成功");
        getCarouselList();
      } else {
        message.error("更新状态失败");
      }
    } catch (error) {
      console.error("更新轮播图状态时发生错误:", error);
      message.error("更新状态失败");
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCarouselApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success("删除成功");
        getCarouselList();
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      console.error("删除轮播图时发生错误:", error);
      message.error("删除失败");
    }
  };

  // 处理批量删除
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      for (const id of selectedRowKeys) {
        await deleteCarouselApi(Number(id));
      }
      message.success("批量删除成功");
      getCarouselList();
    } catch (error) {
      console.error("批量删除轮播图时发生错误:", error);
      message.error("批量删除失败");
    }
  };

  return (
    <TableList
      // 数据相关
      dataSource={data}
      loading={loading}
      // 搜索相关
      searchFields={searchFields}
      onSearch={handleSearch}
      onReset={handleReset}
      // 表格相关
      columns={columns}
      rowKey="id"
      // 分页相关
      pagination={pagination}
      onPageChange={handlePageChange}
      // 操作相关
      onAdd={handleAdd}
      onBatchDelete={handleBatchDelete}
      // 其他配置
      showSearch={true}
      showToolbar={true}
      defaultExpandSearch={false}
    />
  );
};

export default CarouselList;