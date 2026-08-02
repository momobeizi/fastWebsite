import { Card, Row, Col, Statistic, Typography, Space, Table, Tag, List, Avatar, Progress, theme } from "antd";
import { 
  FileTextOutlined, 
  FolderOutlined, 
  UserOutlined, 
  TagOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  EditOutlined,
  SettingOutlined,
  MessageOutlined
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";

const { Title, Text } = Typography;

// 模拟统计数据
const statistics = [
  { title: "文章总数", value: 128, icon: <FileTextOutlined />, color: "#1890ff", change: 12 },
  { title: "分类数量", value: 16, icon: <FolderOutlined />, color: "#52c41a", change: 2 },
  { title: "用户总数", value: 45, icon: <UserOutlined />, color: "#fa8c16", change: 5 },
  { title: "标签总数", value: 89, icon: <TagOutlined />, color: "#eb2f96", change: 8 },
];

// 快捷入口配置
const quickActions = [
  { title: "写文章", icon: <EditOutlined />, color: "#1890ff", path: "/content/article/create" },
  { title: "轮播图管理", icon: <BarChartOutlined />, color: "#52c41a", path: "/content/carousel" },
  { title: "分类管理", icon: <FolderOutlined />, color: "#fa8c16", path: "/content/category" },
  { title: "网站设置", icon: <SettingOutlined />, color: "#722ed1", path: "/system/config" },
];

// 近期文章数据
interface ArticleRecord {
  key: string;
  title: string;
  author: string;
  category: string;
  views: number;
  status: "published" | "draft";
  date: string;
}

const recentArticles: ArticleRecord[] = [
  { key: "1", title: "React 19 新特性深度解析", author: "管理员", category: "技术", views: 1234, status: "published", date: "2026-04-12" },
  { key: "2", title: "Tailwind CSS 4 完全指南", author: "编辑", category: "前端", views: 892, status: "published", date: "2026-04-11" },
  { key: "3", title: "TypeScript 5.x 实用技巧", author: "管理员", category: "技术", views: 567, status: "draft", date: "2026-04-10" },
  { key: "4", title: "Ant Design 组件最佳实践", author: "编辑", category: "前端", views: 445, status: "published", date: "2026-04-09" },
];

const articleColumns: TableColumnsType<ArticleRecord> = [
  { title: "标题", dataIndex: "title", key: "title", ellipsis: true },
  { title: "作者", dataIndex: "author", key: "author", width: 80 },
  { title: "分类", dataIndex: "category", key: "category", width: 80 },
  { title: "浏览", dataIndex: "views", key: "views", width: 80 },
  { 
    title: "状态", 
    dataIndex: "status", 
    key: "status", 
    width: 80,
    render: (status: string) => (
      <Tag color={status === "published" ? "green" : "orange"}>
        {status === "published" ? "已发布" : "草稿"}
      </Tag>
    )
  },
  { title: "日期", dataIndex: "date", key: "date", width: 100 },
];

// 系统信息数据
const systemInfo = [
  { label: "系统版本", value: "v1.0.0" },
  { label: "Node.js", value: "20.x" },
  { label: "React", value: "19.2.0" },
  { label: "Ant Design", value: "6.1.2" },
];

const Home = () => {
  const { token } = theme.useToken();

  return (
    <div className="p-6">
      {/* 欢迎语 */}
      <div className="mb-6">
        <Title level={3} style={{ margin: 0 }}>欢迎回来，管理员</Title>
        <Text type="secondary">今天是 2026年4月12日 星期日，祝您工作愉快！</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                suffix={
                  <Text type="success" className="ml-2 text-sm">
                    <RiseOutlined /> {stat.change}%
                  </Text>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 快捷操作 */}
        <Col xs={24} lg={8}>
          <Card title="快捷操作" className="mb-4">
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col span={12} key={index}>
                  <Card 
                    hoverable 
                    className="text-center cursor-pointer transition-all hover:shadow-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${action.color}15, ${action.color}05)`,
                      borderColor: `${action.color}30`
                    }}
                  >
                    <div style={{ color: action.color, fontSize: 24 }}>
                      {action.icon}
                    </div>
                    <Text>{action.title}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* 系统信息 */}
          <Card title="系统信息">
            <List
              dataSource={systemInfo}
              renderItem={(item) => (
                <List.Item>
                  <Text type="secondary">{item.label}</Text>
                  <Text strong>{item.value}</Text>
                </List.Item>
              )}
            />
            <div className="mt-4">
              <Text type="secondary" className="mb-2 block">存储使用</Text>
              <Progress percent={45} status="active" />
              <Text type="secondary" className="text-xs">45% / 100GB 已使用</Text>
            </div>
          </Card>
        </Col>

        {/* 近期文章 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                近期文章
              </Space>
            }
            extra={<a href="/content/article">查看全部</a>}
          >
            <Table
              columns={articleColumns}
              dataSource={recentArticles}
              pagination={false}
              size="small"
            />
          </Card>

          {/* 数据趋势 */}
          <Card 
            title="本周数据趋势" 
            className="mt-4"
            extra={<a href="/system/log">查看详情</a>}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="本周新增文章" 
                  value={12} 
                  prefix={<RiseOutlined style={{ color: "#52c41a" }} />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="本周访问量" 
                  value={3421} 
                  prefix={<BarChartOutlined style={{ color: "#1890ff" }} />} 
                />
              </Col>
            </Row>
            <div className="mt-4">
              <Text type="secondary" className="mb-2 block">访问量趋势</Text>
              <Progress 
                percent={72} 
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }} 
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
