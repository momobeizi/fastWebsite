import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getArticleListApi, deleteArticleApi, publishArticleApi, withdrawArticleApi, getArticleApi } from "@/api/article";
import { useNavigate } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  categoryName: string;
  author: string;
  status: string;
  readCount: number;
  createTime: string;
  isTop: number;
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
    name: "categoryId",
    label: "分类",
    type: "select",
    options: [
      { label: "技术文章", value: 1 },
      { label: "经验分享", value: 2 },
      { label: "其他", value: 3 },
    ],
    width: 150,
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "草稿", value: "draft" },
      { label: "已发布", value: "published" },
    ],
    width: 120,
  },
  {
    name: "createTime",
    label: "创建时间",
    type: "dateRangePicker",
    width: 240,
  },
];

// 表格列配置 - 在组件内部定义
const getColumns = (
  handleEdit: (record: Article) => void,
  handlePreview: (record: Article) => void,
  handlePublish: (id: string) => void,
  handleWithdraw: (id: string) => void,
  handleDelete: (id: string) => void
): TableColumn<Article>[] => [
  {
    title: "序号",
    dataIndex: "index",
    width: 30,
    align: "center",
    render: (_value, _record, index: number) => (index + 1)
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 200,
  },
  {
    title: "分类",
    dataIndex: "categoryName",
    width: 120,
  },
  {
    title: "作者",
    dataIndex: "author",
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 100,
    align: "center",
    render: (value: string) => (
      <Tag color={value === "published" ? "green" : "blue"}>
        {value === "published" ? "已发布" : "草稿"}
      </Tag>
    ),
  },
  {
    title: "阅读量",
    dataIndex: "readCount",
    width: 80,
    align: "center",
  },
  {
    title: "是否置顶",
    dataIndex: "isTop",
    width: 100,
    align: "center",
    render: (value: number) => (
      <Tag color={value === 1 ? "red" : "default"}>
        {value === 1 ? "是" : "否"}
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
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handlePreview(record)}
        >
          预览
        </Button>
        <Button
          type="link"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
        {record.status === "draft" ? (
          <Popconfirm
            title="确认发布"
            description="确定要发布这篇文章吗？"
            onConfirm={() => handlePublish(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              size="small"
            >
              发布
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="确认撤回"
            description="确定要撤回这篇文章吗？"
            onConfirm={() => handleWithdraw(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              icon={<CloseCircleOutlined />}
              size="small"
            >
              撤回
            </Button>
          </Popconfirm>
        )}
        <Popconfirm
          title="确认删除"
          description="确定要删除这篇文章吗？删除后不可恢复！"
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

const ArticleList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Article[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [previewModal, setPreviewModal] = useState({
    visible: false,
    title: '',
    content: ''
  });

  // 组件挂载时获取文章列表
  useEffect(() => {
    getArticleList();
  }, []);

  const getArticleList = async () => {
    setLoading(true);
    try {
      const res = await getArticleListApi({
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
        message.error("获取文章列表失败");
      }
    } catch (error) {
      console.error("获取文章列表时发生错误:", error);
      message.error("获取文章列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async (params: Record<string, any>) => {
    setLoading(true);
    setSearchParams(params);
    // 处理日期范围参数
    const { createTime, ...rest } = params;
    const searchParams = {
      ...rest,
      startTime: createTime?.[0]?.format ? createTime[0].format('YYYY-MM-DD') : undefined,
      endTime: createTime?.[1]?.format ? createTime[1].format('YYYY-MM-DD') : undefined,
    };
    try {
      const res = await getArticleListApi({
        ...searchParams,
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
        message.error("搜索文章失败");
      }
    } catch (error) {
      console.error("搜索文章时发生错误:", error);
      message.error("搜索文章失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({});
    getArticleList();
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    getArticleList();
  };

  // 处理新增 - 跳转到新增页面
  const handleAdd = () => {
    navigate('/content/article/create');
  };

  // 处理编辑 - 跳转到编辑页面
  const handleEdit = (record: Article) => {
    navigate(`/content/article/edit/${record.id}`);
  };

  // 处理预览
  const handlePreview = async (record: Article) => {
    try {
      const res = await getArticleApi(record.id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        const article = res.data;
        setPreviewModal({
          visible: true,
          title: article.title,
          content: article.content || ''
        });
      } else {
        message.error('获取文章详情失败');
      }
    } catch (error) {
      console.error('获取文章详情失败:', error);
      message.error('获取文章详情失败');
    }
  };

  // 关闭预览弹窗
  const closePreviewModal = () => {
    setPreviewModal({
      ...previewModal,
      visible: false
    });
  };

  // 处理发布
  const handlePublish = async (id: string) => {
    try {
      const res = await publishArticleApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success("发布成功");
        getArticleList();
      } else {
        message.error("发布失败");
      }
    } catch (error) {
      console.error("发布文章时发生错误:", error);
      message.error("发布失败");
    }
  };

  // 处理撤回
  const handleWithdraw = async (id: string) => {
    try {
      const res = await withdrawArticleApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success("撤回成功");
        getArticleList();
      } else {
        message.error("撤回失败");
      }
    } catch (error) {
      console.error("撤回文章时发生错误:", error);
      message.error("撤回失败");
    }
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteArticleApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success("删除成功");
        getArticleList();
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      console.error("删除文章时发生错误:", error);
      message.error("删除失败");
    }
  };

  // 处理批量删除
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      for (const id of selectedRowKeys) {
        await deleteArticleApi(String(id));
      }
      message.success("批量删除成功");
      getArticleList();
    } catch (error) {
      console.error("批量删除文章时发生错误:", error);
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
        columns={getColumns(handleEdit, handlePreview, handlePublish, handleWithdraw, handleDelete)}
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
      <Modal
        title={previewModal.title}
        open={previewModal.visible}
        onCancel={closePreviewModal}
        footer={[
          <Button key="close" onClick={closePreviewModal}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <div
          style={{ maxHeight: 600, overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: previewModal.content }}
        />
      </Modal>
    </>
  );
};

export default ArticleList;