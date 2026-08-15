import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Select, InputNumber, DatePicker, Popconfirm, Switch, Tabs, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ImagePreview from "@/components/ImagePreview";
import { TableList, type TableColumn } from "@/components/TableList";
import { getArticleListApi, getArticleApi, addArticleApi, updateArticleApi, deleteArticleApi } from "@/api/website";
import { getArticleCategoryListApi } from "@/api/website";
import dayjs from "dayjs";
import RichEditor from "@/components/RichEditor";
import { useAuthStore } from "@/stores/modules/authStore";

const ArticlePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form] = Form.useForm();
  const token = useAuthStore((state) => state.token);

  useEffect(() => { getList(); loadCategories(); }, []);

  const loadCategories = async () => {
    try { const res: any = await getArticleCategoryListApi({ limit: 100 }); setCategories((res?.data as any)?.list || []); } catch {}
  };

  const getList = async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.current, limit: pagination.pageSize, sortBy: "createTime:DESC" };
      if (searchParams.search) params.search = searchParams.search;
      const res: any = await getArticleListApi(params);
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleSearch = async (params: any) => {
    setSearchParams(params);
    try {
      const q: any = { page: 1, limit: pagination.pageSize, sortBy: "createTime:DESC" };
      if (params.search) q.search = params.search;
      const res: any = await getArticleListApi(q);
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, current: 1, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("搜索失败"); }
  };

  const handleAdd = () => { form.resetFields(); form.setFieldsValue({ status: 1, categoryId: categories[0]?.id || 0 }); setIsEdit(false); setEditId(null); setModalVisible(true); };
  const handleEdit = async (r: any) => {
    setIsEdit(true); setEditId(r.id); setModalVisible(true);
    try {
      const res: any = await getArticleApi(r.id);
      const detail = res?.data || res;
      form.setFieldsValue({ ...detail, publishTime: detail.publishTime ? dayjs(detail.publishTime) : undefined });
    } catch { message.error("加载详情失败"); setModalVisible(false); }
  };
  const handleDelete = async (id: number) => { try { await deleteArticleApi(id); message.success("删除成功"); getList(); } catch { message.error("删除失败"); } };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    const payload = { ...values, publishTime: values.publishTime?.format?.("YYYY-MM-DD HH:mm:ss") || values.publishTime };
    setModalLoading(true);
    try {
      if (isEdit && editId) { await updateArticleApi({ id: editId, ...payload }); message.success("更新成功"); }
      else { await addArticleApi(payload); message.success("新增成功"); }
      setModalVisible(false); getList();
    } catch { message.error("操作失败"); }
    finally { setModalLoading(false); }
  };

  // 封面上传配置
  const uploadProps = {
    name: "file",
    action: "/api/common/uploadFile",
    headers: { Authorization: `Bearer ${token || ""}` },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === "done") {
        const url = info.file.response?.data || info.file.response;
        form.setFieldValue("cover", url);
        message.success("上传成功");
      } else if (info.file.status === "error") {
        message.error("上传失败");
      }
    },
  };

  const columns: TableColumn<any>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "标题", dataIndex: "title", width: 200, ellipsis: true },
    { title: "分类", dataIndex: "categoryId", width: 100, render: (v: number) => categories.find(c => c.id === v)?.name || "-" },
    { title: "浏览", dataIndex: "viewCount", width: 70, align: "center" },
    { title: "状态", dataIndex: "status", width: 70, align: "center", render: (v: number) => <Tag color={v === 1 ? "green" : "orange"}>{v === 1 ? "已发布" : "草稿"}</Tag> },
    { title: "发布时间", dataIndex: "publishTime", width: 160, render: (v: string) => v?.slice(0, 10) || "-" },
    {
      title: "操作", dataIndex: "action", width: 120, align: "center",
      render: (_: any, r: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button type="link" danger icon={<DeleteOutlined />} size="small" /></Popconfirm>
        </Space>
      ),
    },
  ];

  const searchFields = [{ name: "search", label: "标题", type: "input", placeholder: "搜索标题", width: 200 } as any];

  return (
    <>
      <TableList dataSource={data} loading={loading} columns={columns} rowKey="id" pagination={pagination}
        searchFields={searchFields} onSearch={handleSearch} onReset={() => { setSearchParams({}); getList(); }}
        onPageChange={(p, ps) => { setPagination(prev => ({ ...prev, current: p, pageSize: ps })); getList(); }}
        onAdd={handleAdd} showSearch={true} showToolbar={true} defaultExpandSearch={false} />
      <Modal
        title={isEdit ? "编辑文章" : "新增文章"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={1200}
        styles={{ body: { overflow: 'visible' }, content: { overflow: 'visible' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Tabs
            defaultActiveKey="info"
            items={[
              {
                key: "info",
                label: "基础信息",
                children: (
                  <>
                    <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
                    {/* 第一行：SEO URL、分类、标签 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
                      <Form.Item name="slug" label="SEO URL" rules={[{ required: true }]}><Input placeholder="如：company-news-2024" /></Form.Item>
                      <Form.Item name="categoryId" label="分类" rules={[{ required: true }]}>
                        <Select options={categories.map(c => ({ label: c.name, value: c.id }))} />
                      </Form.Item>
                      <Form.Item name="tags" label="标签"><Input placeholder="逗号分隔" /></Form.Item>
                    </div>
                    {/* 第二行：封面图、状态、发布时间 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
                      <Form.Item name="cover" label="封面图">
                        <div>
                          <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />} size="small">上传封面</Button>
                          </Upload>
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const url = getFieldValue("cover");
                              return url ? (
                                <div style={{ marginTop: 8 }}>
                                  <ImagePreview src={url} width={80} height={60} />
                                </div>
                              ) : null;
                            }}
                          </Form.Item>
                        </div>
                      </Form.Item>
                      <Form.Item name="status" label="状态"><Select options={[{ label: "已发布", value: 1 }, { label: "草稿", value: 0 }]} /></Form.Item>
                      <Form.Item name="publishTime" label="发布时间"><DatePicker showTime style={{ width: "100%" }} /></Form.Item>
                    </div>
                    <Form.Item name="summary" label="摘要"><Input.TextArea rows={3} /></Form.Item>
                    <Form.Item name="seoTitle" label="SEO标题"><Input /></Form.Item>
                    <Form.Item name="seoKeywords" label="SEO关键词"><Input /></Form.Item>
                    <Form.Item name="seoDescription" label="SEO描述"><Input.TextArea rows={2} /></Form.Item>
                  </>
                ),
              },
              {
                key: "content",
                label: "文章内容",
                children: (
                  <Form.Item name="content" label="文章内容">
                    <RichEditor
                      value={form.getFieldValue("content") || ""}
                      onChange={(html) => form.setFieldValue("content", html)}
                      height={450}
                      token={token}
                    />
                  </Form.Item>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </>
  );
};

export default ArticlePage;
