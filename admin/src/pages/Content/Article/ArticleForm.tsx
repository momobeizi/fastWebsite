import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Card, Space, Upload, Row, Col } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import RichEditor from '@/components/RichEditor';
import { createArticleApi, updateArticleApi, getArticleApi } from '@/api/article';
import { getCategoryTreeApi } from '@/api/category';
import { useAuthStore, useSettingStore } from '@/stores';

const { Option } = Select;
const { TextArea } = Input;

const ArticleForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { themeMode } = useSettingStore();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  // 获取分类列表
  useEffect(() => {
    getCategories();
    if (isEdit) {
      getArticleDetail();
    } else {
      form.resetFields();
      setContent('');
    }
  }, [id]);

  // 将树形分类数据转换为下拉选项
  const flattenCategories = (list: any[]): Array<{ value: string; label: string }> => {
    const result: Array<{ value: string; label: string }> = [];
    const traverse = (items: any[], prefix = '') => {
      items.forEach((item) => {
        result.push({
          value: item.id,
          label: prefix + item.name
        });
        if (item.children && item.children.length > 0) {
          traverse(item.children, prefix + '  ');
        }
      });
    };
    traverse(list);
    return result;
  };

  const getCategories = async () => {
    try {
      const res = await getCategoryTreeApi();
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        const categoryList = res.data || [];
        const options = flattenCategories(categoryList);
        setCategories(options);
        if (options.length === 0) {
          message.warning('暂无分类，请先在分类管理中创建分类');
        }
      } else {
        message.error(res?.msg || '获取分类失败');
      }
    } catch (error) {
      console.error('获取分类失败:', error);
      message.error('获取分类失败');
    }
  };

  const getArticleDetail = async () => {
    if (!id) return;
    try {
      const res = await getArticleApi(id);
      
      if (res?.code === 0 || res?.code === 200 || res?.success) {
        const article = res.data;
        if (!article) {
          message.error('文章不存在');
          return;
        }
        
        form.setFieldsValue({
          title: article.title,
          categoryId: article.categoryId,
          tags: article.tags,
          summary: article.summary,
          author: article.author,
          status: article.status,
          sort: article.sort,
          isTop: article.isTop,
          coverImage: article.coverImage
        });
        
        // 设置内容
        setContent(article.content || '');
        
        if (article.coverImage) {
          setCoverImageUrl(article.coverImage);
        }
      } else {
        message.error(res?.msg || '获取文章详情失败');
      }
    } catch (error) {
      console.error('获取文章详情失败:', error);
      message.error('获取文章详情失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const articleData = {
        ...values,
        content
      };

      let res;
      if (isEdit) {
        res = await updateArticleApi({ ...articleData, id });
      } else {
        res = await createArticleApi(articleData);
      }

      if (res?.code === 0 || res?.code === 200 || res?.success) {
        message.success(isEdit ? '更新成功' : '创建成功');
        navigate('/content/article');
      } else {
        message.error(isEdit ? '更新失败' : '创建失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleBack = () => {
    navigate('/content/article');
  };

  // 从 authStore 获取 token
  const token = useAuthStore((state) => state.token);

  // 封面上传配置
  const uploadProps = {
    name: 'file',
    action: '/api/common/uploadFile',
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === 'done') {
        const url = info.file.response?.data;
        if (url) {
          setCoverImageUrl(url);
          form.setFieldsValue({ coverImage: url });
          message.success('封面上传成功');
        }
      } else if (info.file.status === 'error') {
        message.error('封面上传失败');
      }
    },
  };

  // 封面上传按钮
  const uploadButton = (
    <div style={{ width: 200, height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed #d9d9d9', borderRadius: 4 }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传封面</div>
    </div>
  );

  return (
    <Card 
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            返回
          </Button>
          <span>{isEdit ? '编辑文章' : '新增文章'}</span>
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSubmit}
        >
          保存
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'draft',
          sort: 0,
          isTop: 0
        }}
      >
        {/* 第一行：标题、分类、作者 */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入标题" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="categoryId"
              label="分类"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select placeholder="请选择分类">
                {categories.map(cat => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="author"
              label="作者"
              rules={[{ required: true, message: '请输入作者' }]}
            >
              <Input placeholder="请输入作者" />
            </Form.Item>
          </Col>
        </Row>

        {/* 第二行：状态、排序、是否置顶 */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="status"
              label="状态"
            >
              <Select placeholder="请选择状态">
                <Option value="draft">草稿</Option>
                <Option value="published">已发布</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="sort"
              label="排序"
            >
              <Input type="number" placeholder="请输入排序" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="isTop"
              label="是否置顶"
            >
              <Select placeholder="请选择">
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 第三行：标签、封面图片 */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              name="tags"
              label="标签"
            >
              <Input placeholder="请输入标签，多个标签用逗号分隔" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              name="coverImage"
              label="封面图片"
            >
              <Upload {...uploadProps}>
                {coverImageUrl ? (
                  <img
                    src={coverImageUrl}
                    alt="封面"
                    style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* 第四行：摘要 */}
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              name="summary"
              label="摘要"
            >
              <TextArea rows={3} placeholder="请输入摘要" />
            </Form.Item>
          </Col>
        </Row>

        {/* 第五行：内容编辑器（放在最下面） */}
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              label="内容"
              required
            >
              <RichEditor
                value={content}
                onChange={handleContentChange}
                placeholder="请输入文章内容"
                height={400}
                token={token}
                darkMode={themeMode === 'dark'}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ArticleForm;
