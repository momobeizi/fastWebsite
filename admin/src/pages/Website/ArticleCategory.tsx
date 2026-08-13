import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, InputNumber, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TableList, type TableColumn } from "@/components/TableList";
import { getArticleCategoryListApi, addArticleCategoryApi, updateArticleCategoryApi, deleteArticleCategoryApi } from "@/api/website";

const ArticleCategoryPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { getList(); }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const res: any = await getArticleCategoryListApi({ page: pagination.current, limit: pagination.pageSize });
      if (res?.data) { setData((res.data as any)?.list || []); setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 })); }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleAdd = () => { form.resetFields(); form.setFieldsValue({ sort: 0 }); setIsEdit(false); setEditId(null); setModalVisible(true); };
  const handleEdit = (r: any) => { setIsEdit(true); setEditId(r.id); form.setFieldsValue(r); setModalVisible(true); };
  const handleDelete = async (id: number) => { try { await deleteArticleCategoryApi(id); message.success("删除成功"); getList(); } catch { message.error("删除失败"); } };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    try {
      if (isEdit && editId) { await updateArticleCategoryApi({ id: editId, ...values }); message.success("更新成功"); }
      else { await addArticleCategoryApi(values); message.success("新增成功"); }
      setModalVisible(false); getList();
    } catch { message.error("操作失败"); }
  };

  const columns: TableColumn<any>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "分类名称", dataIndex: "name", width: 200 },
    { title: "SEO URL", dataIndex: "slug", width: 200 },
    { title: "排序", dataIndex: "sort", width: 80, align: "center" },
    { title: "操作", dataIndex: "action", width: 120, align: "center",
      render: (_: any, r: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(r)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button type="link" danger icon={<DeleteOutlined />} size="small" /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableList dataSource={data} loading={loading} columns={columns} rowKey="id" pagination={pagination}
        onPageChange={(p, ps) => { setPagination(prev => ({ ...prev, current: p, pageSize: ps })); getList(); }}
        onAdd={handleAdd} showSearch={false} showToolbar={true} />
      <Modal title={isEdit ? "编辑分类" : "新增分类"} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} width={400}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="分类名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="SEO URL" rules={[{ required: true }]}><Input placeholder="如：news" /></Form.Item>
          <Form.Item name="sort" label="排序"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ArticleCategoryPage;
