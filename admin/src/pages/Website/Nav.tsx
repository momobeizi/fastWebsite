import React, { useState, useEffect } from "react";
import { Button, Input, InputNumber, Select, Tag, Space, message, Card } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { getNavListApi, saveNavListApi } from "@/api/website";

interface NavItem {
  id?: number;
  name: string;
  url: string;
  parentId: number;
  sort: number;
  type: number;
  visible: number;
}

const NavPage: React.FC = () => {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await getNavListApi();
      const list = res?.data || res || [];
      setItems(list.length ? list : [{ name: "", url: "", parentId: 0, sort: 0, type: 0, visible: 1 }]);
    } catch { message.error("加载失败"); }
    finally { setLoading(false); }
  };

  const addItem = () => setItems(prev => [...prev, { name: "", url: "", parentId: 0, sort: prev.length, type: 0, visible: 1 }]);
  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof NavItem, value: any) => {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNavListApi(items);
      message.success("保存成功");
      load();
    } catch { message.error("保存失败"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>导航管理</h2>
        <Space>
          <Button icon={<PlusOutlined />} onClick={addItem}>添加菜单</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>保存</Button>
        </Space>
      </div>
      <Card loading={loading}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <Input placeholder="菜单名" value={item.name} onChange={e => updateItem(i, "name", e.target.value)} style={{ width: 120 }} />
            <Input placeholder="链接" value={item.url} onChange={e => updateItem(i, "url", e.target.value)} style={{ width: 180 }} />
            <Select value={item.type} onChange={v => updateItem(i, "type", v)} style={{ width: 130 }}>
              <Select.Option value={0}>自定义链接</Select.Option>
              <Select.Option value={1}>页面</Select.Option>
              <Select.Option value={2}>文章分类</Select.Option>
              <Select.Option value={3}>产品分类</Select.Option>
            </Select>
            <InputNumber placeholder="排序" value={item.sort} onChange={v => updateItem(i, "sort", v ?? 0)} min={0} style={{ width: 80 }} />
            <Tag color={item.visible === 1 ? "green" : "red"} style={{ cursor: "pointer" }} onClick={() => updateItem(i, "visible", item.visible === 1 ? 0 : 1)}>
              {item.visible === 1 ? "显示" : "隐藏"}
            </Tag>
            <Button danger icon={<DeleteOutlined />} size="small" onClick={() => removeItem(i)} />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default NavPage;
