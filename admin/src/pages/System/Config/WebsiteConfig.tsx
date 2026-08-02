import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateWebsiteConfig, getWebsiteConfig } from '@/api/websiteConfig';

const { TextArea } = Input;

const WebsiteConfigPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await getWebsiteConfig();
      if (response.code === 200) {
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('获取网站配置失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await updateWebsiteConfig(values);
      if (response.code === 200) {
        message.success('网站配置更新成功');
      } else {
        message.error('网站配置更新失败');
      }
    } catch (error) {
      message.error('网站配置更新失败');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="网站配置">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="siteName"
            label="网站名称"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>

          <Form.Item
            name="logo"
            label="网站Logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="file" listType="picture" action="/api/common/upload">
              <Button icon={<UploadOutlined />}>上传Logo</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="subTitle"
            label="网站副标题"
          >
            <Input placeholder="请输入网站副标题" />
          </Form.Item>

          <Form.Item
            name="icp"
            label="备案号"
          >
            <Input placeholder="请输入备案号" />
          </Form.Item>

          <Form.Item
            name="contact"
            label="联系方式"
          >
            <Input placeholder="请输入联系方式" />
          </Form.Item>

          <Form.Item
            name="copyright"
            label="版权信息"
          >
            <TextArea rows={4} placeholder="请输入版权信息" />
          </Form.Item>

          <Divider />

          <Form.Item
            name="homeCarouselEnabled"
            label="首页轮播图"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>

          <Form.Item
            name="homeRecommendEnabled"
            label="推荐文章"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>

          <Form.Item
            name="homeHotCategoriesEnabled"
            label="热门分类"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default WebsiteConfigPage;