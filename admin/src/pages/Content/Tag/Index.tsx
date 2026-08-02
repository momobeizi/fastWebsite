import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getTagListApi, deleteTagApi } from "@/api/tag";

interface Tag {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  createTime: string;
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: "name",
    label: "标签名称",
    type: "input",
    placeholder: "请输入标签名称",
    width: 200,
  },
];

// 表格列配置
const columns: TableColumn<Tag>[] = [
  {
    title: "序号",
    dataIndex: "index",
    width: 30,
    align: "center",
    render: (_value, _record, index: number) => (index + 1)
  },
  {
    title: "标签名称",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "文章数",
    dataIndex: "articleCount",
    width: 80,
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "description",
    width: 200,
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
    width: 150,
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

const TagList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Tag[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  // 组件挂载时获取标签列表
  useEffect(() => {
    getTagList();
  }, []);

  const getTagList = async () => {
    setLoading(true);
    try {
      const res = await getTagListApi({
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
        message.error("获取标签列表失败");
      }
    } catch (error) {
      console.error("获取标签列表时发生错误:", error);
      message.error("获取标签列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async (params: Record<string, any>) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const res = await getTagListApi({
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
        message.error("搜索标签失败");
      }
    } catch (error) {
      console.error("搜索标签时发生错误:", error);
      message.error("搜索标签失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({});
    getTagList();
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    getTagList();
  };

  // 处理新增
  const handleAdd = () => {
    console.log("新增标签");
  };

  // 处理编辑
  const handleEdit = (record: Tag) => {
    console.log("编辑标签:", record);
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTagApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success("删除成功");
        getTagList();
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      console.error("删除标签时发生错误:", error);
      message.error("删除失败");
    }
  };

  // 处理批量删除
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      for (const id of selectedRowKeys) {
        await deleteTagApi(Number(id));
      }
      message.success("批量删除成功");
      getTagList();
    } catch (error) {
      console.error("批量删除标签时发生错误:", error);
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

export default TagList;