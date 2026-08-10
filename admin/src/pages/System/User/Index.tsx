import React, { useState, useEffect, useMemo } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Radio, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi, getUserDetailApi } from "@/api/user";
import { getAllRolesApi } from "@/api/role";

interface UserItem {
  id: number;
  username: string;
  nickname?: string;
  phone?: string;
  role: string;
  status: number;
  createTime: string;
}

const searchFields: SearchField[] = [
  {
    name: "search",
    label: "用户名/昵称",
    type: "input",
    placeholder: "请输入用户名或昵称",
    width: 200,
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "启用", value: "1" },
      { label: "禁用", value: "0" },
    ],
    width: 120,
  },
];

const UserPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  // Modal 状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    getUserList();
    loadRoles();
  }, []);

  // 加载角色列表
  const loadRoles = async () => {
    try {
      const res: any = await getAllRolesApi();
      const roles = res?.data || [];
      setRoleOptions(roles.map((r: any) => ({ label: r.name, value: r.code })));
    } catch {
      console.error("加载角色失败");
    }
  };

  const getUserList = async () => {
    setLoading(true);
    try {
      const res: any = await getUserListApi({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchParams.search || undefined,
      });
      if (res?.data) {
        // paginateData 返回 { list, total, page, pageSize, totalPages }
        // 经过 TransformInterceptor 包装后放在 res.data 里
        setData((res.data as any)?.list || []);
        setPagination((prev) => ({
          ...prev,
          total: (res.data as any)?.total || 0,
        }));
      }
    } catch (error) {
      console.error("获取用户列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params: Record<string, any>) => {
    setSearchParams(params);
    setLoading(true);
    try {
      const res: any = await getUserListApi({
        page: 1,
        limit: pagination.pageSize,
        search: params.search || undefined,
      });
      if (res?.data) {
        setData((res.data as any)?.list || []);
        setPagination((prev) => ({
          ...prev,
          current: 1,
          total: (res.data as any)?.total || 0,
        }));
      }
    } catch (error) {
      console.error("搜索用户失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({});
    getUserList();
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
    getUserList();
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ status: 1, role: "editor" });
    setIsEdit(false);
    setEditId(null);
    setModalVisible(true);
  };

  const handleEdit = async (record: UserItem) => {
    setIsEdit(true);
    setEditId(record.id);
    setModalVisible(true);
    try {
      const res: any = await getUserDetailApi(record.id);
      const detail = res?.data || res;
      form.setFieldsValue({
        username: detail.username,
        nickname: detail.nickname || "",
        phone: detail.phone || "",
        role: detail.role || "editor",
        status: detail.status ?? 1,
      });
    } catch {
      message.error("加载用户详情失败");
      setModalVisible(false);
    }
  };

  const handleDelete = (record: UserItem) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除用户 ${record.username} 吗？`,
      onOk: async () => {
        try {
          const res: any = await deleteUserApi(record.id);
          if (res?.data?.code === 200 || res?.code === 200) {
            message.success("删除成功");
            getUserList();
          } else {
            message.error("删除失败");
          }
        } catch {
          message.error("删除失败");
        }
      },
    });
  };

  const handleSave = async () => {
    let values: any;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const payload = {
      username: values.username,
      password: values.password || undefined,
      nickname: values.nickname,
      phone: values.phone,
      role: values.role,
      status: values.status,
    };

    setModalLoading(true);
    try {
      if (isEdit && editId) {
        await updateUserApi({ id: editId, ...payload });
        message.success("更新成功");
      } else {
        await createUserApi(payload);
        message.success("新增成功");
      }
      setModalVisible(false);
      getUserList();
    } catch {
      message.error(isEdit ? "更新失败" : "新增失败");
    } finally {
      setModalLoading(false);
    }
  };

  const handleBatchDelete = async (selectedRowKeys: React.Key[]) => {
    try {
      for (const id of selectedRowKeys) {
        await deleteUserApi(Number(id));
      }
      message.success("批量删除成功");
      getUserList();
    } catch {
      message.error("批量删除失败");
    }
  };

  const columns: TableColumn<UserItem>[] = useMemo(
    () => [
      {
        title: "序号",
        dataIndex: "index",
        width: 30,
        align: "center",
        render: (_value, _record, index: number) => index + 1,
      },
      {
        title: "用户名",
        dataIndex: "username",
        width: 120,
      },
      {
        title: "昵称",
        dataIndex: "nickname",
        width: 120,
      },
      {
        title: "手机号",
        dataIndex: "phone",
        width: 130,
      },
      {
        title: "角色",
        dataIndex: "role",
        width: 100,
        align: "center",
        render: (value: string) => <Tag>{value}</Tag>,
      },
      {
        title: "状态",
        dataIndex: "status",
        width: 80,
        align: "center",
        render: (value: number) => (
          <Tag color={value === 1 ? "green" : "red"}>
            {value === 1 ? "启用" : "禁用"}
          </Tag>
        ),
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        width: 160,
        sortable: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: 150,
        align: "center",
        fixed: "right",
        render: (_: any, record: UserItem) => (
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
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <>
      <TableList
        dataSource={data}
        loading={loading}
        searchFields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        columns={columns}
        rowKey="id"
        pagination={pagination}
        onPageChange={handlePageChange}
        onAdd={handleAdd}
        onBatchDelete={handleBatchDelete}
        showSearch={true}
        showToolbar={true}
        defaultExpandSearch={false}
      />

      {/* 新增/编辑 Modal */}
      <Modal
        title={isEdit ? "编辑用户" : "新增用户"}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入" disabled={isEdit} />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: !isEdit, message: "请输入密码" },
              {
                pattern: /^[a-zA-Z0-9]{6,12}$/,
                message: "密码为6-12位字母或数字",
                validateTrigger: "blur",
              },
            ]}
          >
            <Input.Password placeholder={isEdit ? "不修改请留空" : "请输入密码"} />
          </Form.Item>

          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item name="role" label="角色" rules={[{ required: true, message: "请选择角色" }]}>
            <Select placeholder="请选择角色" options={roleOptions} />
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserPage;
