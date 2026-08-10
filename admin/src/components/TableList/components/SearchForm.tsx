import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import type { SearchField } from "../types";

const { RangePicker } = DatePicker;

interface SearchFormProps {
  fields?: SearchField[];
  onSearch?: (values: Record<string, any>) => void;
  onReset?: () => void;
  defaultExpand?: boolean;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  fields = [],
  onSearch,
  onReset,
  defaultExpand = false,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(defaultExpand);

  // 默认显示前4个字段，展开后显示所有
  const visibleFields = expanded ? fields : fields.slice(0, 4);
  
  // 所有字段（用于渲染到表单，即使隐藏也要渲染以便收集值）
  const allFields = fields;

  // 渲染表单字段
  const renderField = (field: SearchField) => {
    const { type, placeholder, options, props = {} } = field;

    const commonProps = {
      placeholder: placeholder || `请输入${field.label}`,
      style: { width: field.width || "100%" },
      allowClear: true,
      ...props,
    };

    switch (type) {
      case "input":
        return <Input {...commonProps} />;

      case "select":
        return (
          <Select {...commonProps}>
            {options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );

      case "datePicker":
        return <DatePicker {...commonProps} />;

      case "dateRangePicker":
        return <RangePicker {...commonProps} />;

      default:
        return <Input {...commonProps} />;
    }
  };

  // 处理搜索
  const handleSearch = () => {
    try {
      // 检查表单是否有任何字段
      console.log("Fields:", fields.map(f => f.name));
      
      // 获取所有表单值
      const values = form.getFieldsValue();
      console.log("表单原始值:", values);
      
      // 处理 dateRangePicker 类型字段，拆分为 startTime 和 endTime
      const processedValues: Record<string, any> = {};
      Object.keys(values).forEach(key => {
        const field = fields.find(f => f.name === key);
        if (field?.type === 'dateRangePicker' && values[key]) {
          // 如果是日期范围，拆分为两个字段
          if (Array.isArray(values[key]) && values[key].length === 2) {
            processedValues.startTime = values[key][0] ? values[key][0].format('YYYY-MM-DD') : undefined;
            processedValues.endTime = values[key][1] ? values[key][1].format('YYYY-MM-DD') : undefined;
          }
        } else {
          processedValues[key] = values[key];
        }
      });
      
      console.log("处理后的搜索参数:", processedValues);
      onSearch?.(processedValues);
    } catch (error) {
      console.error("表单处理失败:", error);
    }
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  // 切换展开状态
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#333] border-b border-[#E5E5E5] dark:border-[#555] border-dashed mb-2">
      <div className="flex justify-between items-center">
        <div className="dark:text-white  ml-4">搜索</div>
        <Button
          type="link"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={toggleExpand}
        >
          {expanded ? "收起" : "展开"}
        </Button>
      </div>
      <div className="px-4" style={{ display: expanded ? 'block' : 'none' }}>
        <Form
          form={form}
          initialValues={fields.reduce(
            (acc, field) => {
              acc[field.name] = field.defaultValue || '';
              return acc;
            },
            {} as Record<string, any>,
          )}
        >
          <Row gutter={[16, 0]}>
            {allFields.map((field) => {
              const isVisible = visibleFields.some(v => v.name === field.name);
              return (
                <Col key={field.name} span={6} style={!isVisible ? { display: 'none' } : undefined}>
                  <Form.Item
                    name={field.name}
                    label={field.tooltip ? <Tooltip title={field.tooltip}>{field.label}</Tooltip> : field.label}
                    rules={[
                      {
                        required: field.required,
                        message: `${field.label}不能为空`,
                      },
                    ]}
                  >
                    {renderField(field)}
                  </Form.Item>
                </Col>
              );
            })}

            <Col span={24} className="text-right">
              <Form.Item label=" " colon={false}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={loading}
                  >
                    搜索
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    disabled={loading}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default SearchForm;
