import { useState, useEffect } from 'react';
import {
  Table, Button, Popconfirm, message, Modal, Form, Input,
  Select, TreeSelect, Switch, InputNumber, Space, Tag,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ExclamationCircleOutlined, SyncOutlined,
} from '@ant-design/icons';
import type { MenuOption } from '@/api/menu';
import { getAllMenus, addMenu, updateMenu, deleteMenu, getMenuById } from '@/api/menu';
import { useMenuStore } from '@/stores/modules/menuStore';

const { Option } = Select;

// ========== 工具函数 ==========

/** 将平铺菜单列表构建为树形结构（按 sort 排序） */
const buildTree = (list: MenuOption[]): MenuOption[] => {
  if (!list || list.length === 0) return [];
  const map = new Map<number, MenuOption>();
  const roots: MenuOption[] = [];

  list.forEach(item => map.set(item.id, { ...item, children: [] }));

  list.forEach(item => {
    const node = map.get(item.id)!;
    if (!item.parentId || item.parentId === 0) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        // 父节点不存在时作为根节点处理
        roots.push(node);
      }
    }
  });

  const sortNodes = (nodes: MenuOption[]): MenuOption[] =>
    nodes
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      .map(n => ({ ...n, children: n.children?.length ? sortNodes(n.children) : undefined }));

  return sortNodes(roots);
};

/** 将树形结构拍平为表格数据（附加 key、level 字段） */
const flattenTreeForTable = (nodes: MenuOption[], level = 0): any[] => {
  const result: any[] = [];
  nodes.forEach(node => {
    const row = { ...node, key: String(node.id), level };
    if (node.children && node.children.length > 0) {
      row.children = flattenTreeForTable(node.children, level + 1);
    } else {
      delete (row as any).children;
    }
    result.push(row);
  });
  return result;
};

/** 递归收集所有有子节点的 key（用于默认展开） */
const collectExpandedKeys = (nodes: MenuOption[]): string[] => {
  const keys: string[] = [];
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      keys.push(String(node.id));
      keys.push(...collectExpandedKeys(node.children));
    }
  });
  return keys;
};

/** 渲染类型标签 */
const TypeTag = ({ type }: { type?: number }) => {
  switch (type) {
    case 0: return <Tag color="orange">目录</Tag>;
    case 2: return <Tag color="red">权限</Tag>;
    case 1:
    default: return <Tag color="green">菜单</Tag>;
  }
};

// ========== 主组件 ==========

const MenuPage = () => {
  const [form] = Form.useForm();
  // 平铺的原始列表
  const [menus, setMenus] = useState<MenuOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const menuStore = useMenuStore();

  // -------- 数据加载 --------

  const loadMenus = async () => {
    setLoading(true);
    try {
      const res = await getAllMenus();
      const list: MenuOption[] = res.data ?? [];
      setMenus(list);
      // 默认展开有子节点的行
      const tree = buildTree(list);
      setExpandedRowKeys(collectExpandedKeys(tree));
    } catch (error) {
      message.error('加载菜单失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // -------- 新增 --------

  const handleAdd = (parentMenu?: MenuOption) => {
    form.resetFields();
    form.setFieldsValue({
      parentId: parentMenu?.id ?? 0,
      sort: 0,
      status: 1,
      visible: true,
      keepAlive: false,
      isRoute: true,
      type: 1,
    });
    setIsEdit(false);
    setEditId(null);
    setModalVisible(true);
  };

  // -------- 编辑 --------

  const handleEdit = async (record: MenuOption) => {
    setIsEdit(true);
    setEditId(record.id);
    setModalVisible(true);
    setModalLoading(true);
    try {
      const res = await getMenuById(record.id);
      const detail = res.data;
      form.setFieldsValue({
        name: detail.name,
        type: detail.type ?? 1,
        path: detail.path,
        component: detail.component,
        icon: detail.icon,
        parentId: detail.parentId || 0,
        sort: detail.sort ?? 0,
        status: detail.status ?? 1,
        permission: detail.permission,
        visible: detail.visible === 1,
        keepAlive: detail.keepAlive === 1,
        isRoute: detail.isRoute !== 0,
      });
    } catch {
      message.error('加载菜单详情失败');
      setModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  // -------- 删除 --------

  const handleDelete = async (record: MenuOption) => {
    // 检查是否有子菜单
    const hasChildren = menus.some(m => m.parentId === record.id);
    if (hasChildren) {
      message.warning('该菜单下存在子菜单，请先删除子菜单');
      return;
    }
    try {
      await deleteMenu(record.id);
      message.success('删除成功');
      loadMenus();
      menuStore.loadMenus();
    } catch {
      message.error('删除失败');
    }
  };

  // -------- 保存 --------

  const handleSave = async () => {
    let values: any;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const payload: Partial<MenuOption> = {
      name: values.name,
      type: values.type,
      path: values.path ?? '',
      component: values.component,
      icon: values.icon,
      parentId: values.parentId ?? 0,
      sort: values.sort ?? 0,
      status: values.status,
      permission: values.permission,
      visible: values.visible ? 1 : 0,
      keepAlive: values.keepAlive ? 1 : 0,
      isRoute: values.isRoute ? 1 : 0,
    };

    setModalLoading(true);
    try {
      if (isEdit && editId) {
        await updateMenu({ ...payload, id: editId });
        message.success('更新成功');
      } else {
        await addMenu(payload);
        message.success('新增成功');
      }
      setModalVisible(false);
      loadMenus();
      menuStore.loadMenus();
    } catch {
      message.error(isEdit ? '更新失败' : '新增失败');
    } finally {
      setModalLoading(false);
    }
  };

  // -------- 表格数据 --------

  const treeData = buildTree(menus);
  const tableData = flattenTreeForTable(treeData);

  // -------- 父菜单 TreeSelect 数据（编辑时禁止选自身） --------
  const buildSelectTree = (nodes: MenuOption[]): any[] =>
    nodes.map(node => ({
      value: node.id,
      title: node.name,
      disabled: node.id === editId,
      children: node.children?.length ? buildSelectTree(node.children) : undefined,
    }));

  const selectTreeData = [
    { value: 0, title: '无（顶级菜单）', children: undefined },
    ...buildSelectTree(treeData),
  ];

  // -------- 表格列 --------

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: number) => <TypeTag type={type} />,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 120,
      render: (icon: string) => icon || '-',
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      render: (path: string) => path || '-',
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      render: (component: string) => component || '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 70,
      render: (sort: number) => sort ?? 0,
    },
    {
      title: '显示',
      dataIndex: 'visible',
      key: 'visible',
      width: 70,
      render: (visible: number) => <Switch checked={visible === 1} disabled size="small" />,
    },
    {
      title: '缓存',
      dataIndex: 'keepAlive',
      key: 'keepAlive',
      width: 70,
      render: (keepAlive: number) => <Switch checked={keepAlive === 1} disabled size="small" />,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: any) => {
        const menu: MenuOption = record as MenuOption;
        return (
          <Space size="small">
            {menu.type !== 2 && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => handleAdd(menu)}
              >
                新增
              </Button>
            )}
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(menu)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除该菜单吗？"
              description="删除后不可恢复"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(menu)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // -------- 渲染 --------

  return (
    <div style={{ padding: 24 }}>
      {/* 顶部操作栏 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>菜单管理</h2>
        <Space>
          <Button icon={<SyncOutlined />} onClick={loadMenus} loading={loading}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
            新增菜单
          </Button>
        </Space>
      </div>

      {/* 菜单树形表格 */}
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="key"
        loading={loading}
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
        }}
        scroll={{ x: 1000 }}
        bordered
        size="small"
      />

      {/* 新增/编辑 Modal */}
      <Modal
        title={isEdit ? '编辑菜单' : '新增菜单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={820}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item name="type" label="菜单类型" rules={[{ required: true }]}>
            <Select>
              <Option value={0}>目录（无页面，仅用于折叠分组）</Option>
              <Option value={1}>菜单（指向具体页面）</Option>
              <Option value={2}>权限（按钮级别权限标识）</Option>
            </Select>
          </Form.Item>

            <Form.Item name="name" label="菜单名称" rules={[{ required: true, message: '请输入菜单名称' }]}>
              <Input placeholder="如：用户管理" />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.type !== curr.type}
            >
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                return (
                  <>
                  {type !== 2 && (
                    <Form.Item name="path" label="路由路径" rules={[{ required: type !== 2, message: '请输入路由路径' }]}>
                      <Input placeholder="如：/system/user" />
                    </Form.Item>
                  )}
                  {type === 1 && (
                    <Form.Item name="component" label="组件名称" rules={[{ required: true, message: '请输入组件名称' }]}>
                      <Input placeholder="如：User（对应 pages/System/User/Index.tsx）" />
                    </Form.Item>
                  )}
                  {type !== 2 && (
                      <Form.Item name="icon" label="图标名称">
                        <Input placeholder="如：UserOutlined" />
                      </Form.Item>
                    )}
                  </>
                );
              }}
            </Form.Item>

            <Form.Item name="parentId" label="父级菜单">
              <TreeSelect
                treeData={selectTreeData}
                placeholder="默认为顶级菜单"
                allowClear
                treeDefaultExpandAll
              />
            </Form.Item>

            <Form.Item name="permission" label="权限标识" rules={[{ required: true, message: '请输入权限标识' }]}>
              <Input placeholder="如：system:user:list" />
            </Form.Item>


            <Form.Item name="sort" label="排序号">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="数值越小越靠前" />
            </Form.Item>

            <Form.Item name="status" label="状态">
              <Select>
                <Option value={1}>启用</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Form.Item>

            <Form.Item name="visible" label="侧边栏显示" valuePropName="checked">
              <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
            </Form.Item>

            <Form.Item name="keepAlive" label="路由缓存" valuePropName="checked">
              <Switch checkedChildren="缓存" unCheckedChildren="不缓存" />
            </Form.Item>

            <Form.Item name="isRoute" label="是否路由" valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuPage;
