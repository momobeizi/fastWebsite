import { useState, useEffect } from "react";
import { Card, Row, Col, Table, Tag, Spin, Typography, Space, Progress, Alert, Descriptions, Badge } from "antd";
import { 
  DesktopOutlined, 
  LaptopOutlined, 
  ApiOutlined, 
  RobotOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  HeartOutlined
} from "@ant-design/icons";
import request from "@/utils/request";

const { Title, Text } = Typography;

// 技术栈表格列定义
interface TechItem {
  name: string;
  version: string;
  description?: string;
}

// 系统信息类型
interface SystemInfo {
  hostname: string;
  hostAddress: string;
  osName: string;
  osVersion: string;
  osArch: string;
  javaVersion: string;
  javaVendor: string;
  javaHome: string;
  jvmVersion: string;
  jvmName: string;
  availableProcessors: number;
  totalMemory: string;
  freeMemory: string;
  maxMemory: string;
  usedMemory: string;
  cpuUsage: number;
  appName: string;
  appVersion: string;
  springBootVersion: string;
  uptime: string;
}

// 技术栈类型
interface TechStack {
  backend: Record<string, string>;
  frontend: Record<string, string>;
  devTools: Record<string, string>;
}

const Monitor = () => {
  const [loading, setLoading] = useState(true);
  const [systemLoading, setSystemLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取系统信息
  const fetchSystemInfo = async () => {
    setSystemLoading(true);
    try {
      const res = await request.get("/api/system/monitor/info");
      if (res.code === 200) {
        setSystemInfo(res.data);
      }
    } catch (err) {
      console.error("获取系统信息失败", err);
      setError("获取系统信息失败，请检查后端服务是否启动");
    } finally {
      setSystemLoading(false);
    }
  };

  // 获取技术栈信息
  const fetchTechStack = async () => {
    try {
      const res = await request.get("/api/system/monitor/tech-stack");
      if (res.code === 200) {
        setTechStack(res.data);
      }
    } catch (err) {
      console.error("获取技术栈信息失败", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
    fetchTechStack();
    
    // 每30秒刷新一次系统信息
    const interval = setInterval(fetchSystemInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  // 渲染后端技术栈表格
  const renderBackendTable = () => {
    if (!techStack?.backend) return null;
    
    const data: TechItem[] = [
      { name: "Spring Boot", version: techStack.backend.springBoot, description: "后端核心框架" },
      { name: "Java", version: techStack.backend.java, description: "运行环境" },
      { name: "MyBatis-Plus", version: techStack.backend.mybatisPlus, description: "ORM框架" },
      { name: "MySQL", version: techStack.backend.mysql, description: "关系型数据库" },
      { name: "Redis", version: techStack.backend.redis, description: "缓存数据库" },
      { name: "JWT", version: techStack.backend.jwt, description: "身份认证" },
      { name: "Hutool", version: techStack.backend.hutool, description: "Java工具库" },
      { name: "Lombok", version: techStack.backend.lombok, description: "简化代码" },
      { name: "SpringDoc OpenAPI", version: techStack.backend.springdoc, description: "API文档" },
      { name: "PageHelper", version: techStack.backend.pagehelper, description: "分页插件" },
      { name: "EasyCaptcha", version: techStack.backend.easyCaptcha, description: "验证码" },
    ];
    
    return (
      <Table 
        dataSource={data} 
        rowKey="name"
        size="small"
        pagination={false}
        columns={[
          { title: "技术/框架", dataIndex: "name", key: "name", render: (text) => <Text strong>{text}</Text> },
          { title: "版本", dataIndex: "version", key: "version", render: (v) => <Tag color="blue">{v}</Tag> },
          { title: "说明", dataIndex: "description", key: "description" },
        ]}
      />
    );
  };

  // 渲染前端技术栈表格
  const renderFrontendTable = () => {
    if (!techStack?.frontend) return null;
    
    const data: TechItem[] = [
      { name: "React", version: techStack.frontend.react, description: "UI框架" },
      { name: "TypeScript", version: techStack.frontend.typescript, description: "类型系统" },
      { name: "Ant Design", version: techStack.frontend.antDesign, description: "UI组件库" },
      { name: "Tailwind CSS", version: techStack.frontend.tailwindCss, description: "CSS框架" },
      { name: "Zustand", version: techStack.frontend.zustand, description: "状态管理" },
      { name: "React Router", version: techStack.frontend.reactRouter, description: "路由管理" },
      { name: "Vite", version: techStack.frontend.vite, description: "构建工具" },
      { name: "Axios", version: techStack.frontend.axios, description: "HTTP客户端" },
      { name: "WangEditor", version: techStack.frontend.wangeditor, description: "富文本编辑器" },
    ];
    
    return (
      <Table 
        dataSource={data} 
        rowKey="name"
        size="small"
        pagination={false}
        columns={[
          { title: "技术/框架", dataIndex: "name", key: "name", render: (text) => <Text strong>{text}</Text> },
          { title: "版本", dataIndex: "version", key: "version", render: (v) => <Tag color="green">{v}</Tag> },
          { title: "说明", dataIndex: "description", key: "description" },
        ]}
      />
    );
  };

  // 计算内存使用率
  const getMemoryUsage = () => {
    if (!systemInfo) return 0;
    const used = parseFloat(systemInfo.usedMemory);
    const total = parseFloat(systemInfo.totalMemory);
    if (isNaN(used) || isNaN(total) || total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  return (
    <div className="p-6">
      <Title level={3} className="mb-4">系统监控</Title>
      
      {error && (
        <Alert message={error} type="error" showIcon className="mb-4" />
      )}

      {/* 技术栈概览 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ 
              background: "linear-gradient(135deg, #1890ff15, #1890ff05)",
              borderColor: "#1890ff30"
            }}
          >
            <Space>
              <ApiOutlined style={{ fontSize: 32, color: "#1890ff" }} />
              <div>
                <Text type="secondary">后端技术栈</Text>
                <Title level={4} style={{ margin: 0 }}>Spring Boot</Title>
                <Text type="secondary">Java 微服务框架</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ 
              background: "linear-gradient(135deg, #52c41a15, #52c41a05)",
              borderColor: "#52c41a30"
            }}
          >
            <Space>
              <DesktopOutlined style={{ fontSize: 32, color: "#52c41a" }} />
              <div>
                <Text type="secondary">前端技术栈</Text>
                <Title level={4} style={{ margin: 0 }}>React + TS</Title>
                <Text type="secondary">现代化前端框架</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ 
              background: "linear-gradient(135deg, #fa8c1615, #fa8c1605)",
              borderColor: "#fa8c1630"
            }}
          >
            <Space>
              <CloudServerOutlined style={{ fontSize: 32, color: "#fa8c16" }} />
              <div>
                <Text type="secondary">应用版本</Text>
                <Title level={4} style={{ margin: 0 }}>v1.0.0</Title>
                <Text type="secondary">当前运行版本</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 系统信息 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <LaptopOutlined />
                服务器信息
                {systemLoading && <Spin size="small" />}
              </Space>
            }
            extra={
              <a onClick={fetchSystemInfo} disabled={systemLoading}>
                <SyncOutlined spin={systemLoading} /> 刷新
              </a>
            }
          >
            {systemInfo ? (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="主机名">{systemInfo.hostname}</Descriptions.Item>
                <Descriptions.Item label="IP地址">{systemInfo.hostAddress}</Descriptions.Item>
                <Descriptions.Item label="操作系统">{systemInfo.osName} {systemInfo.osVersion} ({systemInfo.osArch})</Descriptions.Item>
                <Descriptions.Item label="CPU核心数">{systemInfo.availableProcessors} 核心</Descriptions.Item>
                <Descriptions.Item label="Java版本">{systemInfo.javaVersion}</Descriptions.Item>
                <Descriptions.Item label="Java供应商">{systemInfo.javaVendor}</Descriptions.Item>
                <Descriptions.Item label="JVM版本">{systemInfo.jvmName} {systemInfo.jvmVersion}</Descriptions.Item>
                <Descriptions.Item label="Java安装目录">{systemInfo.javaHome}</Descriptions.Item>
              </Descriptions>
            ) : (
              <div className="text-center py-8">
                <Spin size="large" />
              </div>
            )}
          </Card>
        </Col>

        {/* 资源使用 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <DatabaseOutlined />
                资源使用
                {systemLoading && <Spin size="small" />}
              </Space>
            }
          >
            {systemInfo ? (
              <>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Text>JVM 内存使用</Text>
                    <Text type="secondary">{systemInfo.usedMemory} / {systemInfo.totalMemory}</Text>
                  </div>
                  <Progress 
                    percent={getMemoryUsage()} 
                    status={getMemoryUsage() > 80 ? "exception" : "active"}
                    strokeColor={getMemoryUsage() > 80 ? "#ff4d4f" : "#1890ff"}
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Text>CPU 使用率</Text>
                    <Text type="secondary">{systemInfo.cpuUsage}%</Text>
                  </div>
                  <Progress 
                    percent={systemInfo.cpuUsage} 
                    status={systemInfo.cpuUsage > 80 ? "exception" : "active"}
                    strokeColor={systemInfo.cpuUsage > 80 ? "#ff4d4f" : "#52c41a"}
                  />
                </div>

                <Descriptions column={1} size="small">
                  <Descriptions.Item label="应用名称">{systemInfo.appName}</Descriptions.Item>
                  <Descriptions.Item label="应用版本">{systemInfo.appVersion}</Descriptions.Item>
                  <Descriptions.Item label="Spring Boot">{systemInfo.springBootVersion}</Descriptions.Item>
                  <Descriptions.Item label="运行时间">{systemInfo.uptime}</Descriptions.Item>
                  <Descriptions.Item label="最大内存">{systemInfo.maxMemory}</Descriptions.Item>
                  <Descriptions.Item label="空闲内存">{systemInfo.freeMemory}</Descriptions.Item>
                </Descriptions>
              </>
            ) : (
              <div className="text-center py-8">
                <Spin size="large" />
              </div>
            )}
          </Card>
        </Col>

        {/* 后端技术栈 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RobotOutlined style={{ color: "#1890ff" }} />
                后端技术栈
                <Tag color="blue">Backend</Tag>
              </Space>
            }
            extra={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          >
            {loading ? <Spin /> : renderBackendTable()}
          </Card>
        </Col>

        {/* 前端技术栈 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CodeOutlined style={{ color: "#52c41a" }} />
                前端技术栈
                <Tag color="green">Frontend</Tag>
              </Space>
            }
            extra={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          >
            {loading ? <Spin /> : renderFrontendTable()}
          </Card>
        </Col>

        {/* 开发工具 */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <DesktopOutlined />
                开发工具与环境
                <Tag>Dev Tools</Tag>
              </Space>
            }
          >
            {techStack?.devTools && (
              <Row gutter={[16, 16]}>
                {Object.entries(techStack.devTools).map(([key, value]) => (
                  <Col xs={12} sm={6} key={key}>
                    <Card size="small" hoverable>
                      <Space>
                        <Badge status="success" />
                        <Text strong style={{ textTransform: 'uppercase' }}>{key}</Text>
                      </Space>
                      <div className="mt-1">
                        <Tag color="processing">{value}</Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      {/* 底部状态 */}
      <Card className="mt-4" style={{ background: "#fafafa" }}>
        <Space>
          <HeartOutlined style={{ color: "#eb2f96" }} />
          <Text type="secondary">
            系统监控已开启 • 每30秒自动刷新 • 数据仅供参考
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default Monitor;
