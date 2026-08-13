import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Select, InputNumber, Popconfirm, Image } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TableList, type TableColumn } from "@/components/TableList";
import { getProductListApi, getProductApi, addProductApi, updateProductApi, deleteProductApi } from "@/api/website";
import { getProductCategoryListApi } from "@/api/website";

const ProductPage: React.FC = () => {
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

  useEffect(() => { getList(); loadCategories(); }, []);

  const loadCategories = async () => {
    try { const res: any = await getProductCategoryListApi({ limit: 100 }); setCategories((res?.data as any)?.list || []); } catch {}
  };

  const getList = async () => {
    setLoading(true);
    try {
      const params: any = { page: pagination.current, limit: pagination.pageSize, sortBy: "sort:ASC" };
      if (searchParams.search) params.search = searchParams.search;
      const res: any = await getProductListApi(params);
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleSearch = async (params: any) => {
    setSearchParams(params);
    try {
      const q: any = { page: 1, limit: pagination.pageSize, sortBy: "sort:ASC" };
      if (params.search) q.search = params.search;
      const res: any = await getProductListApi(q);
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, current: 1, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("搜索失败"); }
  };

  const handleAdd = () => { form.resetFields(); form.setFieldsValue({ status: 1, sort: 0 }); setIsEdit(false); setEditId(null); setModalVisible(true); };
  const handleEdit = async (r: any) => {
    setIsEdit(true); setEditId(r.id); setModalVisible(true);
    try {
      const res: any = await getProductApi(r.id);
      const detail = res?.data || res;
      form.setFieldsValue({ ...detail, images: detail.images ? JSON.parse(detail.images).join("\n") : "" });
    } catch { message.error("加载详情失败"); setModalVisible(false); }
  };
  const handleDelete = async (id: number) => { try { await deleteProductApi(id); message.success("删除成功"); getList(); } catch { message.error("删除失败"); } };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    const payload = { ...values, images: values.images ? JSON.stringify(values.images.split("\n").filter(Boolean)) : null };
    setModalLoading(true);
    try {
      if (isEdit && editId) { await updateProductApi({ id: editId, ...payload }); message.success("更新成功"); }
      else { await addProductApi(payload); message.success("新增成功"); }
      setModalVisible(false); getList();
    } catch { message.error("操作失败"); }
    finally { setModalLoading(false); }
  };

  const columns: TableColumn<any>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "封面", dataIndex: "cover", width: 80, render: (v: string) => v ? <Image src={v} width={40} /> : "-" },
    { title: "名称", dataIndex: "name", width: 180 },
    { title: "分类", dataIndex: "categoryId", width: 100, render: (v: number) => categories.find(c => c.id === v)?.name || "-" },
    { title: "价格", dataIndex: "price", width: 80, align: "center", render: (v: number) => v != null ? `¥${v}` : "-" },
    { title: "排序", dataIndex: "sort", width: 70, align: "center" },
    { title: "状态", dataIndex: "status", width: 70, align: "center", render: (v: number) => <Tag color={v === 1 ? "green" : "red"}>{v === 1 ? "上架" : "下架"}</Tag> },
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

  const searchFields = [{ name: "search", label: "产品名称", type: "input", placeholder: "搜索产品", width: 200 } as any];

  return (
    <>
      <TableList dataSource={data} loading={loading} columns={columns} rowKey="id" pagination={pagination}
        searchFields={searchFields} onSearch={handleSearch} onReset={() => { setSearchParams({}); getList(); }}
        onPageChange={(p, ps) => { setPagination(prev => ({ ...prev, current: p, pageSize: ps })); getList(); }}
        onAdd={handleAdd} showSearch={true} showToolbar={true} defaultExpandSearch={false} />
      <Modal title={isEdit ? "编辑产品" : "新增产品"} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} confirmLoading={modalLoading} width={700}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item name="slug" label="SEO URL" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="categoryId" label="分类"><Select options={categories.map(c => ({ label: c.name, value: c.id }))} /></Form.Item>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
            <Form.Item name="cover" label="封面图"><Input placeholder="URL" /></Form.Item>
            <Form.Item name="price" label="价格"><InputNumber min={0} precision={2} style={{ width: "100%" }} /></Form.Item>
            <Form.Item name="sort" label="排序"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          </div>
          <Form.Item name="summary" label="简介"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="content" label="详情(HTML)"><Input.TextArea rows={6} placeholder="支持HTML" /></Form.Item>
          <Form.Item name="images" label="产品图集（每行一个URL）"><Input.TextArea rows={4} placeholder="https://..." /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ label: "上架", value: 1 }, { label: "下架", value: 0 }]} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductPage;
