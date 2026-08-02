import { Card, Row, Col, Typography, Space, Avatar, Divider } from 'antd';
import {
  RocketOutlined,
  TeamOutlined,
  MailOutlined,
  GithubOutlined,
  BulbOutlined,
  HeartOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const About = () => {
  const teamMembers = [
    { name: '张三', role: '前端开发', avatar: 'Z', color: '#FF6B6B' },
    { name: '李四', role: '后端开发', avatar: 'L', color: '#4ECDC4' },
    { name: '王五', role: '产品设计', avatar: 'W', color: '#45B7D1' },
  ];

  const features = [
    {
      icon: <RocketOutlined />,
      title: '高性能',
      desc: '基于 Vite 构建，开发体验流畅',
      color: '#FF6B6B',
    },
    {
      icon: <BulbOutlined />,
      title: '可扩展',
      desc: '模块化设计，便于功能扩展',
      color: '#4ECDC4',
    },
    {
      icon: <GlobalOutlined />,
      title: '响应式',
      desc: '完美适配各种设备屏幕',
      color: '#45B7D1',
    },
    {
      icon: <HeartOutlined />,
      title: '用户体验',
      desc: 'Ant Design 组件，美观大方',
      color: '#96CEB4',
    },
  ];

  const techStack = {
    frontend: ['React 18', 'TypeScript', 'Vite', 'Ant Design', 'React Router'],
    backend: ['Spring Boot', 'Java', 'Maven', 'MySQL'],
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 24px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title
            level={1}
            style={{
              color: '#fff',
              fontSize: 48,
              marginBottom: 16,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            关于我们
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
            用心打造每一行代码，为您提供最佳的解决方案
          </Text>
        </div>

        {/* Features */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          {features.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}99 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: 32,
                    color: '#fff',
                    boxShadow: `0 8px 20px ${item.color}50`,
                  }}
                >
                  {item.icon}
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {item.title}
                </Title>
                <Text type="secondary">{item.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Project Intro */}
          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                minHeight: 320,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
              bodyStyle={{ padding: '40px' }}
            >
              <Space align="center" style={{ marginBottom: 24 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: '#fff',
                  }}
                >
                  <RocketOutlined />
                </div>
                <Title level={3} style={{ margin: 0 }}>
                  项目介绍
                </Title>
              </Space>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#555' }}>
                这是一个基于 <Text strong style={{ color: '#667eea' }}>Vite + React + TypeScript + Ant Design</Text>{' '}
                构建的现代化 Web 应用。我们致力于提供高效、可靠、美观的解决方案，让开发者和用户都能获得最佳的体验。
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#555' }}>
                无论您是开发者还是普通用户，我们的目标是打造一款既美观又实用的产品，满足您的各种需求。
              </Paragraph>
            </Card>
          </Col>

          {/* Tech Stack */}
          <Col xs={24} lg={10}>
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                minHeight: 320,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
              bodyStyle={{ padding: '40px' }}
            >
              <Space align="center" style={{ marginBottom: 24 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: '#fff',
                  }}
                >
                  <BulbOutlined />
                </div>
                <Title level={3} style={{ margin: 0 }}>
                  技术栈
                </Title>
              </Space>
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 16, color: '#333' }}>
                  前端技术
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Space wrap size={[8, 8]}>
                  {techStack.frontend.map((tech, i) => (
                    <Text
                      key={i}
                      style={{
                        background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
                        color: '#667eea',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontWeight: 500,
                        border: '1px solid #667eea33',
                      }}
                    >
                      {tech}
                    </Text>
                  ))}
                </Space>
              </div>
              <div>
                <Text strong style={{ fontSize: 16, color: '#333' }}>
                  后端技术
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Space wrap size={[8, 8]}>
                  {techStack.backend.map((tech, i) => (
                    <Text
                      key={i}
                      style={{
                        background: 'linear-gradient(135deg, #f093fb22 0%, #f5576c22 100%)',
                        color: '#f5576c',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontWeight: 500,
                        border: '1px solid #f5576c33',
                      }}
                    >
                      {tech}
                    </Text>
                  ))}
                </Space>
              </div>
            </Card>
          </Col>

          {/* Team */}
          <Col xs={24}>
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
              bodyStyle={{ padding: '40px' }}
            >
              <Space align="center" style={{ marginBottom: 40 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44a08d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: '#fff',
                  }}
                >
                  <TeamOutlined />
                </div>
                <Title level={3} style={{ margin: 0 }}>
                  开发团队
                </Title>
              </Space>
              <Row gutter={[48, 24]} justify="center">
                {teamMembers.map((member, index) => (
                  <Col key={index}>
                    <div style={{ textAlign: 'center' }}>
                      <Avatar
                        size={100}
                        style={{
                          background: `linear-gradient(135deg, ${member.color} 0%, ${member.color}cc 100%)`,
                          fontSize: 40,
                          fontWeight: 'bold',
                          boxShadow: `0 10px 30px ${member.color}50`,
                          border: '4px solid #fff',
                        }}
                      >
                        {member.avatar}
                      </Avatar>
                      <div style={{ marginTop: 16 }}>
                        <Title level={4} style={{ marginBottom: 4 }}>
                          {member.name}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          {member.role}
                        </Text>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* Contact */}
          <Col xs={24}>
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
              bodyStyle={{ padding: '40px', textAlign: 'center' }}
            >
              <Title level={3} style={{ marginBottom: 24 }}>
                联系我们
              </Title>
              <Space size={48} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                <Space direction="vertical" align="center" size="small">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: '#fff',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                    }}
                  >
                    <MailOutlined />
                  </div>
                  <Text strong>contact@example.com</Text>
                </Space>
                <Space direction="vertical" align="center" size="small">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: '#fff',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <GithubOutlined />
                  </div>
                  <Text strong>github.com/example</Text>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 48, color: 'rgba(255,255,255,0.7)' }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
            © 2026 All Rights Reserved. Made with ❤️
          </Text>
        </div>
      </div>
    </div>
  );
};

export default About;
