import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, InputNumber, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { TableList, type SearchField, type TableColumn } from "@/components/TableList";
import { getDictDataListApi, addDictDataApi, updateDictDataApi, deleteDictDataApi } from "@/api/dict";
import { useNavigate, useSearchParams } from "react-router-dom";

interface DictDataItem {
  id: number;
  typeCode: string;
  label: string;
  value: string;
  sort: number;
  status: number;
  remark?: string;
  createTime: string;
}

const searchFields: SearchField[] = [
  { name: "search", label: "标签/值", type: "input", placeholder: "请输入标签或值", width: 200 },
];

const DictDataPage: React.FC = () => {
  const [searchParams2] = useSearchParams();
  const typeCode = searchParams2.get("code") || "";
  const typeName = searchParams2.get("name") || "";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictDataItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { getList(); }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const res: any = await getDictDataListApi({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchParams.search,
        filter: { typeCode },
      });
      if (res?.data) {
        setData((res.data as any)?.list || []);
        setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 }));
      }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleSearch = async (params: Record<string, any>) => {
    setSearchParams(params);
    const res: any = await getDictDataListApi({ page: 1, limit: pagination.pageSize, search: params.search, filter: { typeCode } });
    if (res?.data) {
      setData((res.data as any)?.list || []);
      setPagination(prev => ({ ...prev, current: 1, total: (res.data as any)?.total || 0 }));
    }
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ typeCode, status: 1, sort: 0 });
    setIsEdit(false);
    setEditId(null);
    setModalVisible(true);
  };

  const handleEdit = async (record: DictDataItem) => {
    setIsEdit(true);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDictDataApi(id);
      message.success("删除成功");
      getList();
    } catch { message.error("删除失败"); }
  };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    setModalLoading(true);
    try {
      if (isEdit && editId) {
        await updateDictDataApi({ id: editId, ...values });
        message.success("更新成功");
      } else {
        await addDictDataApi(values);
        message.success("新增成功");
      }
      setModalVisible(false);
      getList();
    } catch { message.error(isEdit ? "更新失败" : "新增失败"); }
    finally { setModalLoading(false); }
  };

  const columns: TableColumn<DictDataItem>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "字典标签", dataIndex: "label", width: 150 },
    { title: "字典值", dataIndex: "value", width: 150 },
    { title: "排序", dataIndex: "sort", width: 70, align: "center" },
    { title: "状态", dataIndex: "status", width: 80, align: "center", render: (v: number) => <Tag color={v === 1 ? "green" : "red"}>{v === 1 ? "启用" : "禁用"}</Tag> },
    { title: "备注", dataIndex: "remark", width: 150, render: (v: string) => v || "-" },
    { title: "创建时间", dataIndex: "createTime", width: 160 },
    {
      title: "操作", dataIndex: "action", width: 120, align: "center",
      render: (_: any, record: DictDataItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/system/dict/type")}>返回</Button>
        <h3 style={{ margin: 0 }}>字典数据 - {typeName} ({typeCode})</h3>
      </div>
      <TableList dataSource={data} loading={loading} searchFields={searchFields} onSearch={handleSearch} onReset={() => { setSearchParams({}); getList(); }}
        columns={columns} rowKey="id" pagination={pagination} onPageChange={(p, ps) => { setPagination(prev => ({ ...prev, current: p, pageSize: ps })); getList(); }}
        onAdd={handleAdd} showSearch={true} showToolbar={true} defaultExpandSearch={false}
      />
      <Modal title={isEdit ? "编辑字典数据" : "新增字典数据"} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} confirmLoading={modalLoading} width={500} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="typeCode" label="字典编码" hidden><Input /></Form.Item>
          <Form.Item name="label" label="字典标签" rules={[{ required: true, message: "请输入" }]}><Input placeholder="如：男" /></Form.Item>
          <Form.Item name="value" label="字典值" rules={[{ required: true, message: "请输入" }]}><Input placeholder="如：male" /></Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="sort" label="排序"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item name="status" label="状态"><Select options={[{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]} /></Form.Item>
          </div>
          <Form.Item name="remark" label="备注"><Input placeholder="选填" /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DictDataPage;
