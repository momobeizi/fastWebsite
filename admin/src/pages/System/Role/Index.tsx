import React, { useState, useEffect } from "react";
import { Button, Space, message, Modal, Form, Input, TreeSelect, InputNumber, Select } from "antd";
import { EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getRoleListApi, deleteRoleApi, createRoleApi, updateRoleApi, getRoleApi } from "@/api/role";
import { getAllMenus, type MenuOption } from "@/api/menu";

interface RoleItem {
  id: number;
  name: string;
  code: string;
  description: string;
  userCount: number;
  menuIds: number[];
  status: number;
  sort: number;
  createTime: string;
}

// 构建菜单树给 TreeSelect
const buildMenuTree = (list: MenuOption[]): any[] => {
  const map = new Map<number, any>();
  const roots: any[] = [];

  list.forEach(item => map.set(item.id, { ...item, children: [] }));

  list.forEach(item => {
    const node = map.get(item.id)!;
    if (!item.parentId || item.parentId === 0) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  const formatTree = (nodes: any[]): any[] =>
    nodes.map(node => ({
      value: node.id,
      title: node.name,
      children: node.children?.length ? formatTree(node.children) : undefined,
    }));

  return formatTree(roots);
};

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    name: "name",
    label: "角色名称",
    type: "input",
    placeholder: "请输入角色名称",
    width: 200,
  },
];

const RoleList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoleItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  // Modal 相关状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [menuTree, setMenuTree] = useState<any[]>([]);
  const [form] = Form.useForm();

  // 组件挂载时获取角色列表和菜单树
  useEffect(() => {
    getRoleList();
    loadMenuTree();
  }, []);

  // 加载菜单树
  const loadMenuTree = async () => {
    try {
      const res = await getAllMenus();
      const menuList = res.data ?? [];
      setMenuTree(buildMenuTree(menuList));
    } catch {
      console.error("加载菜单失败");
    }
  };

  const getRoleList = async () => {
    setLoading(true);
    try {
      const res: any = await getRoleListApi({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchParams.name || undefined,
      });
      if (res?.data) {
        // nestjs-paginate 返回 { data: [...], meta: { totalItems, ... } }
        setData((res.data as any)?.data || []);
        setPagination((prev) => ({
          ...prev,
          total: (res.data as any)?.meta?.totalItems || 0,
        }));
      } else {
        message.error("获取角色列表失败");
      }
    } catch (error) {
      console.error("获取角色列表时发生错误:", error);
      message.error("获取角色列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async (params: Record<string, any>) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const res: any = await getRoleListApi({
        page: 1,
        limit: pagination.pageSize,
        search: params.name || undefined,
      });
      if (res?.data) {
        setData((res.data as any)?.data || []);
        setPagination((prev) => ({
          ...prev,
          current: 1,
          total: (res.data as any)?.meta?.totalItems || 0,
        }));
      } else {
        message.error("搜索角色失败");
      }
    } catch (error) {
      console.error("搜索角色时发生错误:", error);
      message.error("搜索角色失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({});
    getRoleList();
  };

  // 处理分页
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    getRoleList();
  };

  // 处理新增
  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ status: 1, sort: 0, menuIds: [] });
    setIsEdit(false);
    setEditId(null);
    setModalVisible(true);
  };

  // 处理编辑
  const handleEdit = async (record: RoleItem) => {
    setIsEdit(true);
    setEditId(record.id);
    setModalVisible(true);
    try {
      const res = await getRoleApi(record.id);
      const detail = res.data;
      form.setFieldsValue({
        name: detail.name,
        code: detail.code,
        description: detail.description || '',
        status: detail.status ?? 1,
        sort: detail.sort ?? 0,
        menuIds: detail.menuIds ?? [],
      });
    } catch {
      message.error("加载角色详情失败");
      setModalVisible(false);
    }
  };

  // 处理权限设置
  const handlePermission = async (record: RoleItem) => {
    try {
      const res = await getRoleApi(record.id);
      const detail = res.data;
      form.setFieldsValue({
        name: detail.name,
        code: detail.code,
        description: detail.description || '',
        status: detail.status ?? 1,
        sort: detail.sort ?? 0,
        menuIds: detail.menuIds ?? [],
      });
      setIsEdit(true);
      setEditId(record.id);
      setModalVisible(true);
    } catch {
      message.error("加载角色详情失败");
    }
  };

  // 处理保存
  const handleSave = async () => {
    let values: any;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const payload = {
      name: values.name,
      code: values.code,
      description: values.description,
      status: values.status,
      sort: values.sort,
      menuIds: values.menuIds ?? [],
    };

    setModalLoading(true);
    try {
      if (isEdit && editId) {
        await updateRoleApi({ ...payload, id: editId });
        message.success("更新成功");
      } else {
        await createRoleApi(payload);
        message.success("新增成功");
      }
      setModalVisible(false);
      getRoleList();
    } catch {
      message.error(isEdit ? "更新失败" : "新增失败");
    } finally {
      setModalLoading(false);
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteRoleApi(id) as any;
      if (res?.code === 200) {
        message.success("删除成功");
        getRoleList();
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      console.error("删除角色时发生错误:", error);
      message.error("删除失败");
    }
  };

  // 表格列配置
  const columns: TableColumn<RoleItem>[] = [
    {
      title: "序号",
      dataIndex: "index",
      width: 30,
      align: "center",
      render: (_value, _record, index: number) => (index + 1)
    },
    {
      title: "角色名称",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "描述",
      dataIndex: "description",
      width: 200,
    },
    {
      title: "关联用户数",
      dataIndex: "userCount",
      width: 120,
      align: "center",
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
      width: 220,
      align: "center",
      fixed: "right",
      render: (_: any, record: RoleItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<SettingOutlined />}
            size="small"
            onClick={() => handlePermission(record)}
          >
            权限设置
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理批量删除
  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      for (const id of selectedRowKeys) {
        await deleteRoleApi(Number(id));
      }
      message.success("批量删除成功");
      getRoleList();
    } catch (error) {
      console.error("批量删除角色时发生错误:", error);
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
        columns={columns}
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

      {/* 新增/编辑 Modal */}
      <Modal
        title={isEdit ? "编辑角色" : "新增角色"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
              <Input placeholder="如：管理员" />
            </Form.Item>

            <Form.Item name="code" label="角色编码" rules={[{ required: true, message: '请输入角色编码' }]}>
              <Input placeholder="如：admin" disabled={isEdit} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="角色描述">
            <Input.TextArea placeholder="请输入角色描述" rows={2} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="status" label="状态">
              <Select>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="sort" label="排序">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="数值越小越靠前" />
            </Form.Item>
          </div>

          <Form.Item name="menuIds" label="菜单权限">
            <TreeSelect
              treeData={menuTree}
              placeholder="请选择菜单权限"
              treeCheckable
              showCheckedStrategy="SHOW_PARENT"
              maxTagCount={5}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoleList;