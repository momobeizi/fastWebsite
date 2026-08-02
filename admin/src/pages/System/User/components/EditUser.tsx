import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Radio, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import request from '@/utils/request'
import { getUserDetailApi } from '@/api/user'

enum UserOperateType {
    ADD = "add",
    EDIT = "edit",
    DETAILS = "details"
}

interface UserModal {
    visible: boolean;
    title: string;
    type: UserOperateType;
    id?: string;
}

interface EditUserProps {
    userModal: UserModal
    closeEditUserModal: (modalVisible: boolean) => void;
    form: any;
}

interface UserFormValues {
    name?: string;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    address?: string;
    photo?: string;
    gender?: string;
    role?: string[];
    status?: string;
}

const EditUser: React.FC<EditUserProps> = ({ userModal, closeEditUserModal, form }) => {
    const [loading, setLoading] = useState(false);
    const photoUrl = Form.useWatch('photo', form) || '';

    useEffect(() => {
        if (userModal.visible) {
            if (userModal.type === 'add') {
                // 新增时设置初始值
                form.setFieldsValue({
                    gender: 'male',
                    status: 'active',
                    photo: '',
                });
            } else if (userModal.type === 'edit' && userModal.id) {
                // 编辑时获取用户详情
                fetchUserDetail();
            }
        }
    }, [userModal.visible, userModal.type, userModal.id, form]);

    // 获取用户详情
    const fetchUserDetail = async () => {
        if (!userModal.id) return;

        setLoading(true);
        try {
            const res = await getUserDetailApi(userModal.id);
            if (res.code === 200 && res.data) {
                const userData = res.data;
                form.setFieldsValue({
                    username: userData.username,
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    address: userData.address,
                    photo: userData.photo,
                    gender: userData.gender || 'male',
                    role: userData.role ? userData.role.split(',') : [],
                    status: userData.status || 'active'
                });
            } else {
                message.error(res.msg || '获取用户详情失败');
            }
        } catch (error) {
            console.error('获取用户详情失败:', error);
            message.error('获取用户详情失败');
        } finally {
            setLoading(false);
        }
    };

    const handleOk = () => {
        closeEditUserModal(true)
    }

    const handleCancel = () => {
        closeEditUserModal(false)
    }

    // 上传前的处理
    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
            message.error('只能上传图片文件!')
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB!')
            return false
        }
        return true
    }

    // 处理上传
    const handleUpload = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await request.post<{ data: string }>('/common/uploadFile', formData as any, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (res.data) {
            form.setFieldsValue({ photo: res.data })
            message.success('上传成功')
        }
        return false // 阻止默认上传行为
    }

    // 上传按钮
    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    )

    return (
        <>
            <Modal
                title={userModal.title}
                width={680}
                destroyOnHidden={true}
                open={userModal.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="保存"
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    style={{ maxWidth: 520 }}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item<UserFormValues>
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名称!' }]}
                    >
                        <Input placeholder='请输入' disabled={userModal.type === 'edit'} />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="头像"
                        name="photo"
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            customRequest={({ file }) => handleUpload(file as File)}
                            showUploadList={false}
                        >
                            {photoUrl ? (
                                <img draggable={false} src={photoUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="密码"
                        name="password"
                        rules={[
                            { required: userModal.type === 'add', message: '请输入登录密码!' },
                            {
                                pattern: /^([a-zA-Z0-9]{6,12})?$/,
                                message: '密码必须为6到12位字母或数字',
                                validateTrigger: 'blur'
                            }
                        ]}
                    >
                        <Input.Password placeholder={userModal.type === 'edit' ? '不修改请留空' : '请输入'} />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="用户昵称"
                        name="name"
                        rules={[{ required: true, message: '请输入用户昵称!' }]}
                    >
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="性别"
                        name="gender"
                    >
                        <Radio.Group
                            options={[
                                { value: 'male', label: '男' },
                                { value: 'female', label: '女' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号!' },
                            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确!' }
                        ]}
                    >
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱!' },
                            { type: 'email', message: '邮箱格式不正确!' }
                        ]}
                    >
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="地址"
                        name="address"
                    >
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="角色"
                        name="role"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder="请选择"
                            options={[
                                { value: 'admin', label: '管理员' },
                                { value: 'user', label: '普通用户' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<UserFormValues>
                        label="状态"
                        name="status"
                        initialValue="active"
                    >
                        <Radio.Group
                            options={[
                                { value: 'active', label: '启用' },
                                { value: 'inactive', label: '停用' }
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default EditUser