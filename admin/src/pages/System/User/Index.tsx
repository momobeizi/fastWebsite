import React, { useState, useEffect, useMemo } from "react";
import { Button, Tag, Space, message, Modal, Form, Input, Radio, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  TableList,
  type SearchField,
  type TableColumn,
} from "@/components/TableList";
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi } from "@/api/user";
import EditUser from "./components/EditUser";

interface User {
  id: string;
  name: string;
}

const mockData: User[] = [];

const searchFields: SearchField[] = [
  {
    name: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
    width: 200,
  },
  {
    name: "gender",
    label: "性别",
    type: "select",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
    width: 120,
  },
  {
    name: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "激活", value: "active" },
      { label: "禁用", value: "inactive" },
    ],
    width: 120,
  },
  {
    name: "createTime",
    label: "创建时间",
    type: "dateRangePicker",
    width: 240,
  },
];

const TableListDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>(mockData);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: mockData.length,
  });
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [userModal, setUserModal] = useState({
    visible: false,
    title: '新增',
    type: 'add',
    id: ''
  })
  const [form] = Form.useForm();
  
  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    setLoading(true);
    const res = await getUserListApi({
      ...searchParams,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });
    setData(res.data.list);
    setPagination((prev) => ({
      ...prev,
      total: res.data.total,
    }));
    setLoading(false);
  };

  const handleSearch = async (params: Record<string, any>) => {
    setLoading(true);
    console.log("搜索参数:", params);
    setSearchParams(params);

    try {
      const res = await getUserListApi({
        ...params,
        page: 1,
        pageSize: pagination.pageSize,
      });
      if (res?.code === 0 || res?.success) {
        setData(res.data?.list || res.data || []);
        setPagination((prev) => ({
          ...prev,
          current: 1,
          total: res.data?.total || res.data?.length || 0,
        }));
      } else {
        console.error("搜索用户列表失败:", res?.message || "未知错误");
      }
    } catch (error) {
      console.error("搜索用户列表时发生错误:", error);
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
    setUserModal({
      ...userModal,
      visible: true,
      title: '新增',
      type: 'add'
    })
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setUserModal({
      ...userModal,
      visible: true,
      title: '编辑',
      type: 'edit',
      id: record.id
    });
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${record.name} 吗？`,
      onOk: async () => {
        try {
          const res = await deleteUserApi(record.id);
          if (res.code === 200) {
            message.success('删除成功');
            getUserList();
          } else {
            message.error(res.msg || '删除失败');
          }
        } catch (error) {
          console.error('删除用户时发生错误:', error);
          message.error('删除失败');
        }
      }
    });
  };

  const closeEditUserModal = async (val: boolean) => {
    if (val === false) {
      setUserModal({
        ...userModal,
        visible: val
      })
      return;
    }
    
    try {
      const values = await form.validateFields();
      
      if (userModal.type === 'add') {
        // 将 role 数组转换为逗号分隔的字符串
        const submitData = {
          ...values,
          role: values.role ? values.role.join(',') : ''
        };
        const res = await createUserApi(submitData);
        if (res.code === 200) {
          message.success('新增成功');
          getUserList();
          setUserModal({
            ...userModal,
            visible: false
          });
          form.resetFields();
        } else {
          message.error(res.msg || '新增失败');
        }
      } else if (userModal.type === 'edit') {
        // 将 role 数组转换为逗号分隔的字符串
        const submitData = {
          ...values,
          id: userModal.id,
          role: values.role ? values.role.join(',') : ''
        };
        const res = await updateUserApi(submitData);
        if (res.code === 200) {
          message.success('编辑成功');
          getUserList();
          setUserModal({
            ...userModal,
            visible: false
          });
          form.resetFields();
        } else {
          message.error(res.msg || '编辑失败');
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }

  const handleBatchDelete = (selectedRowKeys: React.Key[]) => {
    console.log("批量删除:", selectedRowKeys);
    const newData = data.filter((item) => !selectedRowKeys.includes(item.id));
    setData(newData);
    setPagination((prev) => ({
      ...prev,
      total: newData.length,
    }));
  };

  const columns: TableColumn<User>[] = useMemo(() => [
    {
      title: "序号",
      dataIndex: "index",
      width: 30,
      align: "center",
      render: (_value, _record, index: number) => (index + 1)
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: 120,
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: 80,
    },
    {
      title: "性别",
      dataIndex: "gender",
      width: 80,
      align: "center",
      render: (value: string) => (
        <Tag color={value === "male" ? "blue" : "pink"}>
          {value === "male" ? "男" : "女"}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      align: "center",
      render: (value: string) => (
        <Tag color={value === "active" ? "green" : "red"}>
          {value === "active" ? "激活" : "禁用"}
        </Tag>
      ),
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
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
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
  ], []);

  const actionButtons = (
    <Button type="dashed" onClick={() => console.log("自定义操作")}>
      自定义操作
    </Button>
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
      <EditUser 
        userModal={userModal} 
        closeEditUserModal={closeEditUserModal}
        form={form}
      ></EditUser>
    </>
  );
};

export default TableListDemo;
