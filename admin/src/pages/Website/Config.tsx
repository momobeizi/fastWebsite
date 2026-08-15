import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Spin, Upload, Space, Select } from "antd";
import { SaveOutlined, UploadOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { getWebsiteConfigApi, saveWebsiteConfigApi } from "@/api/website";
import ImagePreview from "@/components/ImagePreview";
import { useAuthStore } from "@/stores/modules/authStore";

// 支持的社交平台
const SOCIAL_PLATFORMS = [
  { label: "GitHub", value: "github" },
  { label: "微信", value: "wechat" },
  { label: "微博", value: "weibo" },
  { label: "知乎", value: "zhihu" },
  { label: "Bilibili", value: "bilibili" },
  { label: "Twitter", value: "twitter" },
  { label: "YouTube", value: "youtube" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "掘金", value: "juejin" },
  { label: "其他", value: "other" },
];

const ConfigPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const token = useAuthStore((state) => state.token);

  useEffect(() => { loadConfig(); }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res: any = await getWebsiteConfigApi();
      const data = res?.data || res;
      if (data) form.setFieldsValue(data);
    } catch { message.error("加载配置失败"); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    setSaving(true);
    try {
      await saveWebsiteConfigApi(values);
      message.success("保存成功");
    } catch { message.error("保存失败"); }
    finally { setSaving(false); }
  };

  // 上传配置（根据字段名区分 logo / favicon）
  const makeUploadProps = (field: string) => ({
    name: "file",
    action: "/api/common/uploadFile",
    headers: { Authorization: `Bearer ${token || ""}` },
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === "done") {
        const url = info.file.response?.data || info.file.response;
        form.setFieldValue(field, url);
        message.success("上传成功");
      } else if (info.file.status === "error") {
        message.error("上传失败");
      }
    },
  });

  if (loading) return <div style={{ textAlign: "center", padding: 100 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>网站配置</h2>
      <Card>
        <Form form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <Form.Item name="siteName" label="网站名称" rules={[{ required: true }]}>
              <Input placeholder="如：某某科技有限公司" />
            </Form.Item>
            <Form.Item name="logo" label="Logo">
              <div>
                <Upload {...makeUploadProps("logo")}>
                  <Button icon={<UploadOutlined />} size="small">上传Logo</Button>
                </Upload>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const url = getFieldValue("logo");
                    return url ? (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                        <ImagePreview src={url} width={80} height={50} />
                        <span style={{ fontSize: 12, color: "#999", wordBreak: "break-all" }}>{url}</span>
                      </div>
                    ) : null;
                  }}
                </Form.Item>
              </div>
            </Form.Item>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <Form.Item name="favicon" label="网站图标(favicon)">
              <div>
                <Upload {...makeUploadProps("favicon")}>
                  <Button icon={<UploadOutlined />} size="small">上传图标</Button>
                </Upload>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const url = getFieldValue("favicon");
                    return url ? (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                        <ImagePreview src={url} width={50} height={50} />
                        <span style={{ fontSize: 12, color: "#999", wordBreak: "break-all" }}>{url}</span>
                      </div>
                    ) : null;
                  }}
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item name="icp" label="ICP备案号">
              <Input placeholder="如：粤ICP备xxxxxx号" />
            </Form.Item>
          </div>

          {/* 联系信息 */}
          <div style={{ marginTop: 8, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
            <h3 style={{ marginBottom: 16 }}>联系信息</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Form.Item name="email" label="联系邮箱">
                <Input placeholder="如：contact@example.com" />
              </Form.Item>
              <Form.Item name="contactPhone" label="联系电话">
                <Input placeholder="如：400-xxx-xxxx" />
              </Form.Item>
            </div>
            <Form.Item name="address" label="联系地址">
              <Input placeholder="如：广东省深圳市xx区xx路xx号" />
            </Form.Item>
          </div>

          {/* 社交账号 */}
          <div style={{ marginTop: 8, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
            <h3 style={{ marginBottom: 16 }}>社交账号</h3>
            <Form.List name="socials">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "platform"]}
                        rules={[{ required: true, message: "选择平台" }]}
                        style={{ marginBottom: 0, minWidth: 140 }}
                      >
                        <Select placeholder="选择平台" options={SOCIAL_PLATFORMS} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[{ required: true, message: "输入账号或昵称" }]}
                        style={{ marginBottom: 0, minWidth: 160 }}
                      >
                        <Input placeholder="账号/昵称" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "url"]}
                        style={{ marginBottom: 0, minWidth: 240 }}
                      >
                        <Input placeholder="链接（可选）" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "#ff4d4f" }} />
                    </Space>
                  ))}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="dashed" onClick={() => add({ platform: "github", name: "", url: "" })} block icon={<PlusOutlined />}>
                      添加社交账号
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          <Form.Item name="seoTitle" label="SEO标题" style={{ marginTop: 16 }}>
            <Input placeholder="默认页面标题" />
          </Form.Item>
          <Form.Item name="seoKeywords" label="SEO关键词">
            <Input placeholder="用逗号分隔" />
          </Form.Item>
          <Form.Item name="seoDescription" label="SEO描述">
            <Input.TextArea rows={3} placeholder="网站描述" />
          </Form.Item>
          <Form.Item name="footerInfo" label="页脚信息">
            <Input.TextArea rows={4} placeholder="支持HTML" />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} size="large">
            保存配置
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ConfigPage;
