import React, { useState } from "react";
import { Button, Input, InputNumber, Space, Table, Tag, Modal, Form, Upload, message, Popconfirm, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import ImagePreview from "@/components/ImagePreview";

export interface SkuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  status: number;
  content?: string;
}

interface SkuEditorProps {
  value?: SkuItem[];
  onChange?: (skus: SkuItem[]) => void;
  token?: string;
}

const SkuEditor: React.FC<SkuEditorProps> = ({ value = [], onChange, token }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

  const skus = value || [];

  const triggerChange = (newSkus: SkuItem[]) => {
    onChange?.(newSkus);
  };

  const handleAdd = () => {
    setEditingIndex(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, stock: 0, price: 0 });
    setModalVisible(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(skus[index]);
    setModalVisible(true);
  };

  const handleDelete = (index: number) => {
    const newSkus = skus.filter((_, i) => i !== index);
    triggerChange(newSkus);
  };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;

    const sku: SkuItem = {
      id: editingIndex !== null ? skus[editingIndex].id : `sku-${Date.now()}`,
      name: values.name,
      price: values.price ?? 0,
      image: values.image,
      stock: values.stock ?? 0,
      status: values.status,
      content: values.content,
    };

    let newSkus: SkuItem[];
    if (editingIndex !== null) {
      newSkus = skus.map((s, i) => (i === editingIndex ? sku : s));
    } else {
      newSkus = [...skus, sku];
    }

    triggerChange(newSkus);
    setModalVisible(false);
    message.success("保存成功");
  };

  const uploadProps = {
    name: "file",
    action: "/api/common/uploadFile",
    headers: { Authorization: `Bearer ${token || ""}` },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === "done") {
        const url = info.file.response?.data || info.file.response;
        form.setFieldValue("image", url);
        message.success("上传成功");
      } else if (info.file.status === "error") {
        message.error("上传失败");
      }
    },
  };

  const columns = [
    { title: "规格名称", dataIndex: "name", width: 120 },
    { title: "图片", dataIndex: "image", width: 80, render: (v: string) => v ? <ImagePreview src={v} width={40} height={40} /> : "-" },
    { title: "价格", dataIndex: "price", width: 90, render: (v: number) => `¥${v ?? 0}` },
    { title: "库存", dataIndex: "stock", width: 80, render: (v: number) => v ?? 0 },
    { title: "状态", dataIndex: "status", width: 80, render: (v: number) => <Tag color={v === 1 ? "green" : "red"}>{v === 1 ? "启用" : "禁用"}</Tag> },
    {
      title: "操作", dataIndex: "action", width: 120, align: "center",
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(index)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(index)}>
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 12 }}>
        添加规格
      </Button>
      {skus.length > 0 && (
        <Table
          dataSource={skus}
          columns={columns as any}
          rowKey="id"
          size="small"
          pagination={false}
        />
      )}

      <Modal
        title={editingIndex !== null ? "编辑规格" : "新增规格"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
        destroyOnClose
        forceRender
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="规格名称" rules={[{ required: true, message: "请输入规格名称" }]}>
            <Input placeholder="如：标准版 / 豪华版 / 黑色 / 32GB" />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
            <Form.Item name="price" label="价格" rules={[{ required: true }]}>
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="stock" label="库存">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select options={[{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]} />
            </Form.Item>
          </div>
          <Form.Item name="image" label="规格图片">
            <div>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} size="small">上传图片</Button>
              </Upload>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const url = getFieldValue("image");
                  return url ? (
                    <div style={{ marginTop: 8 }}>
                      <ImagePreview src={url} width={80} height={60} />
                    </div>
                  ) : null;
                }}
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="content" label="规格详情(可选)">
            <Input.TextArea rows={3} placeholder="该规格的专属介绍，支持HTML" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SkuEditor;
