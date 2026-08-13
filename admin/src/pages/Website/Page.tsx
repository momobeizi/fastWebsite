import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TableList, type TableColumn } from "@/components/TableList";
import { getPageListApi, getPageApi, addPageApi, updatePageApi, deletePageApi } from "@/api/website";

const PagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { getList(); }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.current, limit: pagination.pageSize };
      if (searchParams.search) params.search = searchParams.search;
      const res: any = await getPageListApi(params);
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleSearch = async (params: any) => {
    setSearchParams(params);
    try {
      const q: any = { page: 1, limit: pagination.pageSize };
      if (params.search) q.search = params.search;
      const res: any = await getPageListApi(q);
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, current: 1, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("搜索失败"); }
  };

  const handleAdd = () => { form.resetFields(); form.setFieldsValue({ status: 1, type: "about" }); setIsEdit(false); setEditId(null); setModalVisible(true); };
  const handleEdit = async (r: any) => {
    setIsEdit(true); setEditId(r.id); setModalVisible(true);
    try {
      const res: any = await getPageApi(r.id);
      const detail = res?.data || res;
      form.setFieldsValue(detail);
    } catch { message.error("加载详情失败"); setModalVisible(false); }
  };
  const handleDelete = async (id: number) => { try { await deletePageApi(id); message.success("删除成功"); getList(); } catch { message.error("删除失败"); } };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    setModalLoading(true);
    try {
      if (isEdit && editId) { await updatePageApi({ id: editId, ...values }); message.success("更新成功"); }
      else { await addPageApi(values); message.success("新增成功"); }
      setModalVisible(false); getList();
    } catch { message.error("操作失败"); }
    finally { setModalLoading(false); }
  };

  const columns: TableColumn<any>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "标题", dataIndex: "title", width: 180 },
    { title: "URL", dataIndex: "slug", width: 150 },
    { title: "类型", dataIndex: "type", width: 100, render: (v: string) => {
      const map: any = { about: "关于我们", contact: "联系我们", faq: "常见问题", join: "加入我们" };
      return <Tag>{map[v] || v}</Tag>;
    }},
    { title: "状态", dataIndex: "status", width: 70, align: "center", render: (v: number) => <Tag color={v === 1 ? "green" : "orange"}>{v === 1 ? "已发布" : "草稿"}</Tag> },
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
      <Modal title={isEdit ? "编辑页面" : "新增页面"} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} confirmLoading={modalLoading} width={700}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="页面标题" rules={[{ required: true }]}><Input /></Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item name="slug" label="URL" rules={[{ required: true }]}><Input placeholder="如：about" /></Form.Item>
            <Form.Item name="type" label="页面类型" rules={[{ required: true }]}>
              <Select options={[
                { label: "关于我们", value: "about" }, { label: "联系我们", value: "contact" },
                { label: "常见问题", value: "faq" }, { label: "加入我们", value: "join" },
                { label: "其他", value: "other" },
              ]} />
            </Form.Item>
          </div>
          <Form.Item name="status" label="状态"><Select options={[{ label: "已发布", value: 1 }, { label: "草稿", value: 0 }]} /></Form.Item>
          <Form.Item name="content" label="页面内容(HTML)"><Input.TextArea rows={10} placeholder="支持HTML" /></Form.Item>
          <Form.Item name="seoTitle" label="SEO标题"><Input /></Form.Item>
          <Form.Item name="seoKeywords" label="SEO关键词"><Input /></Form.Item>
          <Form.Item name="seoDescription" label="SEO描述"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PagePage;
