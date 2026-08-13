import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, InputNumber, Select, Popconfirm, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { TableList, type TableColumn } from "@/components/TableList";
import { getBannerListApi, addBannerApi, updateBannerApi, deleteBannerApi } from "@/api/website";
import { useAuthStore } from "@/stores/modules/authStore";
import ImagePreview from "@/components/ImagePreview";

const BannerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();
  // 图片来源：upload 上传 / url 在线地址
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
  const token = useAuthStore((state) => state.token);

  useEffect(() => { getList(); }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const res: any = await getBannerListApi({ page: pagination.current, limit: pagination.pageSize });
      if (res?.data) {
        setData((res.data as any)?.list || []);
        setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 }));
      }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleAdd = () => { form.resetFields(); form.setFieldsValue({ position: "home", sort: 0, status: 1 }); setImageSource("upload"); setIsEdit(false); setEditId(null); setModalVisible(true); };
  const handleEdit = async (record: any) => { setIsEdit(true); setEditId(record.id); form.setFieldsValue(record); setImageSource("url"); setModalVisible(true); };

  // 上传配置
  const uploadProps = {
    name: "file",
    action: "/api/common/uploadFile",
    headers: { Authorization: `Bearer ${token || ""}` },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === "done") {
        const url = info.file.response?.data;
        form.setFieldValue("image", url);
        message.success("上传成功");
      } else if (info.file.status === "error") {
        message.error("上传失败");
      }
    },
  };
  const handleDelete = async (id: number) => { try { await deleteBannerApi(id); message.success("删除成功"); getList(); } catch { message.error("删除失败"); } };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    setModalLoading(true);
    try {
      if (isEdit && editId) { await updateBannerApi({ id: editId, ...values }); message.success("更新成功"); }
      else { await addBannerApi(values); message.success("新增成功"); }
      setModalVisible(false); getList();
    } catch { message.error("操作失败"); }
    finally { setModalLoading(false); }
  };

  const columns: TableColumn<any>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "图片", dataIndex: "image", width: 100, render: (v: string) => <ImagePreview src={v} width={60} height={40} /> },
    { title: "标题", dataIndex: "title", width: 150, render: (v: string) => v || "-" },
    { title: "副标题", dataIndex: "subtitle", width: 150, render: (v: string) => v || "-" },
    { title: "位置", dataIndex: "position", width: 80, render: (v: string) => <Tag>{v}</Tag> },
    { title: "排序", dataIndex: "sort", width: 70, align: "center" },
    { title: "状态", dataIndex: "status", width: 80, align: "center", render: (v: number) => <Tag color={v === 1 ? "green" : "red"}>{v === 1 ? "启用" : "禁用"}</Tag> },
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

  return (
    <>
      <TableList dataSource={data} loading={loading} columns={columns} rowKey="id" pagination={pagination}
        onPageChange={(p, ps) => { setPagination(prev => ({ ...prev, current: p, pageSize: ps })); getList(); }}
        onAdd={handleAdd} showSearch={false} showToolbar={true} />
      <Modal title={isEdit ? "编辑Banner" : "新增Banner"} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} confirmLoading={modalLoading} width={800}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
            {/* 左侧：填写信息 */}
            <div>
              <Form.Item label="图片来源" style={{ marginBottom: 12 }}>
                <Select
                  value={imageSource}
                  onChange={v => { setImageSource(v); }}
                  options={[
                    { label: "本地上传", value: "upload" },
                    { label: "在线地址", value: "url" },
                  ]}
                  style={{ width: 200 }}
                />
              </Form.Item>

              <Form.Item name="image" label="图片地址" rules={[{ required: true, message: "请上传图片或填写图片地址" }]}>
                {imageSource === "upload" ? (
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>点击上传图片</Button>
                  </Upload>
                ) : (
                  <Input placeholder="https://..." />
                )}
              </Form.Item>
              <Form.Item name="title" label="标题"><Input /></Form.Item>
              <Form.Item name="subtitle" label="副标题"><Input /></Form.Item>
              <Form.Item name="link" label="跳转链接"><Input placeholder="/products" /></Form.Item>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
                <Form.Item name="position" label="位置"><Select options={[{ label: "首页", value: "home" }, { label: "关于我们", value: "about" }]} /></Form.Item>
                <Form.Item name="sort" label="排序"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
                <Form.Item name="status" label="状态"><Select options={[{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]} /></Form.Item>
              </div>
            </div>

            {/* 右侧：图片预览 */}
            <div style={{ border: "1px dashed #d9d9d9", borderRadius: 8, padding: 16, background: "#fafafa", alignSelf: "flex-start" }}>
              <div style={{ textAlign: "center", color: "#999", marginBottom: 12, fontWeight: 500 }}>图片预览</div>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const url = getFieldValue("image");
                  return url ? (
                    <ImagePreview src={url} width="100%" height={180} />
                  ) : (
                    <div style={{ width: "100%", height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", background: "#f5f5f5", borderRadius: 6 }}>
                      暂无图片
                    </div>
                  );
                }}
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default BannerPage;
