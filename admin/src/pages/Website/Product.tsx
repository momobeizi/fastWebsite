import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Select, InputNumber, Popconfirm, Upload, Tabs } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { TableList, type TableColumn } from "@/components/TableList";
import { getProductListApi, getProductApi, addProductApi, updateProductApi, deleteProductApi } from "@/api/website";
import { getProductCategoryListApi } from "@/api/website";
import { useAuthStore } from "@/stores/modules/authStore";
import RichEditor from "@/components/RichEditor";
import ImagePreview from "@/components/ImagePreview";
import SkuEditor, { type SkuItem } from "./components/SkuEditor";

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
  const token = useAuthStore((state) => state.token);
  const [imageFileList, setImageFileList] = useState<any[]>([]);

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

  const handleAdd = () => { form.resetFields(); form.setFieldsValue({ status: 1, sort: 0 }); setImageFileList([]); setIsEdit(false); setEditId(null); setModalVisible(true); };
  const handleEdit = async (r: any) => {
    setIsEdit(true); setEditId(r.id); setModalVisible(true);
    try {
      const res: any = await getProductApi(r.id);
      const detail = res?.data || res;
      const images: string[] = detail.images ? JSON.parse(detail.images) : [];
      form.setFieldsValue({ ...detail, images });
      setImageFileList(images.map((url, i) => ({ uid: String(-i - 1), name: `图片${i + 1}`, status: "done", url })));
    } catch { message.error("加载详情失败"); setModalVisible(false); }
  };
  const handleDelete = async (id: number) => { try { await deleteProductApi(id); message.success("删除成功"); getList(); } catch { message.error("删除失败"); } };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    const payload = {
      ...values,
      content: values.content,
      images: values.images?.length ? JSON.stringify(values.images) : null,
    };
    setModalLoading(true);
    try {
      if (isEdit && editId) { await updateProductApi({ id: editId, ...payload }); message.success("更新成功"); }
      else { await addProductApi(payload); message.success("新增成功"); }
      setModalVisible(false); getList();
    } catch { message.error("操作失败"); }
    finally { setModalLoading(false); }
  };

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
    { title: "封面", dataIndex: "cover", width: 80, render: (v: string) => v ? <ImagePreview src={v} width={40} height={40} /> : "-" },
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
      <Modal
        title={isEdit ? "编辑产品" : "新增产品"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={900}
        styles={{ body: { overflow: 'visible' }, content: { overflow: 'visible' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Tabs
            defaultActiveKey="info"
            items={[
              {
                key: "info",
                label: "商品信息",
                children: (
                  <>
                    <Form.Item name="name" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>

                    {/* 第一行：URL、分类、价格、排序 */}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "0 16px" }}>
                      <Form.Item name="slug" label="SEO URL" rules={[{ required: true }]}><Input /></Form.Item>
                      <Form.Item name="categoryId" label="分类"><Select options={categories.map(c => ({ label: c.name, value: c.id }))} /></Form.Item>
                      <Form.Item name="price" label="价格"><InputNumber min={0} precision={2} style={{ width: "100%" }} /></Form.Item>
                      <Form.Item name="sort" label="排序"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
                    </div>

                    {/* 第二行：封面图 + 图集挨着 */}
                    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "0 24px" }}>
                      <Form.Item name="cover" label="产品封面">
                        <div>
                          <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />} size="small">上传封面</Button>
                          </Upload>
                          <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                              const url = getFieldValue("cover");
                              return url ? (
                                <div style={{ marginTop: 8 }}>
                                  <ImagePreview src={url} width={150} height={110} />
                                </div>
                              ) : null;
                            }}
                          </Form.Item>
                        </div>
                      </Form.Item>
                      <Form.Item name="images" label="产品图集">
                        <Upload
                          name="file"
                          action="/api/common/uploadFile"
                          headers={{ Authorization: `Bearer ${token || ""}` }}
                          listType="picture-card"
                          fileList={imageFileList}
                          onChange={(info: any) => {
                            setImageFileList(info.fileList);
                            const urls = info.fileList
                              .filter((f: any) => f.status === "done")
                              .map((f: any) => f.response?.data || f.response || f.url);
                            form.setFieldValue("images", urls);
                          }}
                        >
                          {imageFileList.length >= 8 ? null : (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>上传</div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </div>

                    <Form.Item name="status" label="状态"><Select style={{ width: 150 }} options={[{ label: "上架", value: 1 }, { label: "下架", value: 0 }]} /></Form.Item>

                    {/* SKU 规格配置 */}
                    <Form.Item name="skus" label="SKU 规格配置">
                      <SkuEditor token={token} />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: "detail",
                label: "产品详情",
                children: (
                  <Form.Item name="content" label="产品详情内容">
                    <RichEditor
                      value={form.getFieldValue("content") || ""}
                      onChange={(html) => form.setFieldValue("content", html)}
                      height={380}
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

export default ProductPage;
