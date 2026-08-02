import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, TreeSelect, message } from 'antd';
import { createCategoryApi, updateCategoryApi, getCategoryApi, getCategoryTreeApi } from '@/api/category';

interface EditCategoryProps {
  visible: boolean;
  title: string;
  type: 'add' | 'edit';
  id: number | null;
  onClose: (visible: boolean) => void;
}

interface CategoryOption {
  id: number;
  name: string;
  parentId: number | null;
  children?: CategoryOption[];
}

const EditCategory: React.FC<EditCategoryProps> = ({ visible, title, type, id, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // 获取分类树
  const fetchCategories = async () => {
    try {
      const res = await getCategoryTreeApi();
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error('获取分类树失败:', error);
    }
  };

  // 获取分类详情
  const fetchCategoryDetail = async () => {
    if (!id) return;
    try {
      const res = await getCategoryApi(id);
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        const category = res.data;
        if (!category) {
          message.error('分类不存在');
          return;
        }
        form.setFieldsValue({
          name: category.name,
          parentId: category.parentId || null,
          sort: category.sort || 0,
          description: category.description,
        });
      } else {
        message.error(res?.msg || '获取分类详情失败');
      }
    } catch (error) {
      console.error('获取分类详情失败:', error);
      message.error('获取分类详情失败');
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
      if (type === 'edit' && id) {
        fetchCategoryDetail();
      } else {
        form.resetFields();
      }
    }
  }, [visible, type, id]);

  // 构建树形选择数据
  const buildTreeData = (data: CategoryOption[]): any[] => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
      key: item.id,
      disabled: type === 'edit' && item.id === id, // 编辑时不能选择自己作为父分类
      children: item.children ? buildTreeData(item.children) : undefined,
    }));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let res;
      if (type === 'add') {
        res = await createCategoryApi(values);
      } else {
        res = await updateCategoryApi({ ...values, id });
      }

      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success(type === 'add' ? '创建成功' : '更新成功');
        onClose(false);
      } else {
        message.error(type === 'add' ? '创建失败' : '更新失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose(false);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={500}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          sort: 0,
        }}
      >
        <Form.Item
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" maxLength={50} />
        </Form.Item>

        <Form.Item
          name="parentId"
          label="父分类"
        >
          <TreeSelect
            placeholder="请选择父分类（不选则为顶级分类）"
            treeData={buildTreeData(categories)}
            allowClear
            treeDefaultExpandAll
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber
            placeholder="请输入排序"
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea
            placeholder="请输入分类描述"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategory;
