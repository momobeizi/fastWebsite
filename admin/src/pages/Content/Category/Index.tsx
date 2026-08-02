import React, { useState, useEffect } from "react";
import { Button, Space, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getCategoryListApi, deleteCategoryApi } from "@/api/category";
import EditCategory from "./components/EditCategory";

interface Category {
  id: number;
  name: string;
  parentName: string;
  sort: number;
  description: string;
  articleCount: number;
  createTime: string;
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: "name",
    label: "分类名称",
    type: "input",
    placeholder: "请输入分类名称",
    width: 200,
  },
];

const CategoryList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [categoryModal, setCategoryModal] = useState({
    visible: false,
    title: '新增',
    type: 'add' as 'add' | 'edit',
    id: null as number | null,
  });

  // 获取分类列表
  const getCategoryList = async () => {
    setLoading(true);
    try {
      const res = await getCategoryListApi({
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
        message.error("获取分类列表失败");
      }
    } catch (error) {
      console.error("获取分类列表时发生错误:", error);
      message.error("获取分类列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = (record: Category) => {
    setCategoryModal({
      visible: true,
      title: '编辑分类',
      type: 'edit',
      id: record.id,
    });
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCategoryApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success("删除成功");
        getCategoryList();
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      console.error("删除分类时发生错误:", error);
      message.error("删除失败");
    }
  };

  // 表格列配置
  const columns: TableColumn<Category>[] = [
    {
      title: "序号",
      dataIndex: "index",
      width: 30,
      align: "center",
      render: (_value, _record, index: number) => (index + 1)
    },
    {
      title: "分类名称",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "父分类",
      dataIndex: "parentName",
      width: 150,
      render: (value: string) => value || "无",
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: 80,
      align: "center",
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
          <Popconfirm
            title="确认删除"
            description={`确定要删除分类 "${record.name}" 吗？`}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 组件挂载时获取分类列表
  useEffect(() => {
    getCategoryList();
  }, []);

  // 处理搜索
  const handleSearch = async (params: Record<string, any>) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const res = await getCategoryListApi({
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
        message.error("搜索分类失败");
      }
    } catch (error) {
      console.error("搜索分类时发生错误:", error);
      message.error("搜索分类失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({});
    getCategoryList();
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    getCategoryList();
  };

  // 处理新增
  const handleAdd = () => {
    setCategoryModal({
      visible: true,
      title: '新增分类',
      type: 'add',
      id: null,
    });
  };

  // 关闭编辑弹窗
  const closeEditCategoryModal = (visible: boolean) => {
    setCategoryModal((prev) => ({
      ...prev,
      visible,
    }));
    if (!visible) {
      getCategoryList();
    }
  };

  // 处理批量删除
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      for (const id of selectedRowKeys) {
        await deleteCategoryApi(Number(id));
      }
      message.success("批量删除成功");
      getCategoryList();
    } catch (error) {
      console.error("批量删除分类时发生错误:", error);
      message.error("批量删除失败");
    }
  };

  return (
    <>
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
      <EditCategory
        visible={categoryModal.visible}
        title={categoryModal.title}
        type={categoryModal.type}
        id={categoryModal.id}
        onClose={closeEditCategoryModal}
      />
    </>
  );
};

export default CategoryList;