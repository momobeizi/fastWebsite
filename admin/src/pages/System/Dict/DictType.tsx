import React, { useState, useEffect } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TableList, type SearchField, type TableColumn } from "@/components/TableList";
import { getDictTypeListApi, addDictTypeApi, updateDictTypeApi, deleteDictTypeApi } from "@/api/dict";

interface DictTypeItem {
  id: number;
  name: string;
  code: string;
  status: number;
  remark?: string;
  createTime: string;
}

const searchFields: SearchField[] = [
  { name: "search", label: "名称/编码", type: "input", placeholder: "请输入名称或编码", width: 200 },
];

const DictTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictTypeItem[]>([]);
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
      const res: any = await getDictTypeListApi({ page: pagination.current, limit: pagination.pageSize, search: searchParams.search });
      if (res?.data) {
        setData((res.data as any)?.list || []);
        setPagination(prev => ({ ...prev, total: (res.data as any)?.total || 0 }));
      }
    } catch { message.error("获取列表失败"); }
    finally { setLoading(false); }
  };

  const handleSearch = async (params: Record<string, any>) => {
    setSearchParams(params);
    const res: any = await getDictTypeListApi({ page: 1, limit: pagination.pageSize, search: params.search });
    if (res?.data) {
      setData((res.data as any)?.list || []);
      setPagination(prev => ({ ...prev, current: 1, total: (res.data as any)?.total || 0 }));
    }
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setIsEdit(false);
    setEditId(null);
    setModalVisible(true);
  };

  const handleEdit = async (record: DictTypeItem) => {
    setIsEdit(true);
    setEditId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDictTypeApi(id);
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
        await updateDictTypeApi({ id: editId, ...values });
        message.success("更新成功");
      } else {
        await addDictTypeApi(values);
        message.success("新增成功");
      }
      setModalVisible(false);
      getList();
    } catch { message.error(isEdit ? "更新失败" : "新增失败"); }
    finally { setModalLoading(false); }
  };

  const columns: TableColumn<DictTypeItem>[] = [
    { title: "序号", dataIndex: "index", width: 50, align: "center", render: (_v, _r, i) => i + 1 },
    { title: "字典名称", dataIndex: "name", width: 150 },
    {
      title: "字典编码", dataIndex: "code", width: 150,
      render: (v: string, record: DictTypeItem) => (
        <Button type="link" size="small" onClick={() => navigate(`/system/dict/data?code=${record.code}&name=${record.name}`)}>
          {v}
        </Button>
      ),
    },
    { title: "状态", dataIndex: "status", width: 80, align: "center", render: (v: number) => <Tag color={v === 1 ? "green" : "red"}>{v === 1 ? "启用" : "禁用"}</Tag> },
    { title: "备注", dataIndex: "remark", width: 150, render: (v: string) => v || "-" },
    { title: "创建时间", dataIndex: "createTime", width: 160, sortable: true },
    {
      title: "操作", dataIndex: "action", width: 120, align: "center",
      render: (_: any, record: DictTypeItem) => (
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
      <TableList dataSource={data} loading={loading} searchFields={searchFields} onSearch={handleSearch} onReset={() => { setSearchParams({}); getList(); }}
        columns={columns} rowKey="id" pagination={pagination} onPageChange={(p, ps) => { setPagination(prev => ({ ...prev, current: p, pageSize: ps })); getList(); }}
        onAdd={handleAdd} showSearch={true} showToolbar={true} defaultExpandSearch={false}
      />
      <Modal title={isEdit ? "编辑字典类型" : "新增字典类型"} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)} confirmLoading={modalLoading} width={500} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="字典名称" rules={[{ required: true, message: "请输入" }]}><Input placeholder="如：用户性别" /></Form.Item>
          <Form.Item name="code" label="字典编码" rules={[{ required: true, message: "请输入" }]}><Input placeholder="如：user_gender" disabled={isEdit} /></Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="status" label="状态"><Select options={[{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]} /></Form.Item>
            <Form.Item name="remark" label="备注"><Input placeholder="选填" /></Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default DictTypePage;
