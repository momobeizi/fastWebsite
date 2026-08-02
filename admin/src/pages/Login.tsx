import { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Input, Button, Card, message, Image, Typography } from 'antd';
import { LockOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from "@/stores";

const { Title, Text } = Typography;

interface CaptchaResponse {
  captchaKey: string;
  captchaImage: string;
}

// 眼睛组件 - 跟随鼠标转动
interface EyeProps {
  mouseX: number;
  mouseY: number;
  eyeRef: React.RefObject<HTMLDivElement>;
  size?: number;
}

const Eye: React.FC<EyeProps> = ({ mouseX, mouseY, eyeRef, size = 24 }) => {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!eyeRef.current) return;
    
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    // 计算鼠标相对于眼睛中心的角度
    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    
    // 计算距离（限制最大移动距离）
    const maxDistance = size * 0.25;
    const distance = Math.min(
      maxDistance,
      Math.sqrt(Math.pow(mouseX - eyeCenterX, 2) + Math.pow(mouseY - eyeCenterY, 2)) / 10
    );
    
    // 计算瞳孔位置
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    setPupilPos({ x, y });
  }, [mouseX, mouseY, eyeRef, size]);

  return (
    <div
      ref={eyeRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: '50%',
          backgroundColor: '#1a1a2e',
          transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
    </div>
  );
};

// 卡通角色组件
interface CharacterProps {
  mouseX: number;
  mouseY: number;
  type: 'purple' | 'black' | 'yellow' | 'orange';
}

const Character: React.FC<CharacterProps> = ({ mouseX, mouseY, type }) => {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  
  const configs = {
    purple: {
      width: 140,
      height: 220,
      borderRadius: '20px 20px 0 0',
      background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
      bottom: 0,
      left: 60,
      eyeSize: 28,
      eyeGap: 50,
      eyeTop: 50,
    },
    black: {
      width: 100,
      height: 160,
      borderRadius: '16px 16px 0 0',
      background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
      bottom: 0,
      left: 180,
      eyeSize: 22,
      eyeGap: 40,
      eyeTop: 45,
    },
    yellow: {
      width: 100,
      height: 140,
      borderRadius: '50px 50px 20px 20px',
      background: 'linear-gradient(180deg, #fcd34d 0%, #f59e0b 100%)',
      bottom: 0,
      left: 260,
      eyeSize: 20,
      eyeGap: 45,
      eyeTop: 40,
      hasMouth: true,
    },
    orange: {
      width: 160,
      height: 100,
      borderRadius: '80px 80px 20px 20px',
      background: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)',
      bottom: 0,
      left: 0,
      eyeSize: 18,
      eyeGap: 70,
      eyeTop: 35,
    },
  };
  
  const config = configs[type];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: config.bottom,
        left: config.left,
        width: config.width,
        height: config.height,
        borderRadius: config.borderRadius,
        background: config.background,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      }}
    >
      {/* 眼睛容器 */}
      <div
        style={{
          position: 'absolute',
          top: config.eyeTop,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: config.eyeGap - config.eyeSize,
          alignItems: 'center',
        }}
      >
        <Eye mouseX={mouseX} mouseY={mouseY} eyeRef={leftEyeRef} size={config.eyeSize} />
        <Eye mouseX={mouseX} mouseY={mouseY} eyeRef={rightEyeRef} size={config.eyeSize} />
      </div>
      
      {/* 黄色角色的嘴巴 */}
      {type === 'yellow' && (
        <div
          style={{
            position: 'absolute',
            bottom: 35,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: 4,
            backgroundColor: '#374151',
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
};

// 卡通角色场景
const CartoonScene: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 角色容器 */}
      <div
        style={{
          position: 'relative',
          width: 360,
          height: 280,
          marginTop: 60,
        }}
      >
        <Character mouseX={mousePos.x} mouseY={mousePos.y} type="orange" />
        <Character mouseX={mousePos.x} mouseY={mousePos.y} type="purple" />
        <Character mouseX={mousePos.x} mouseY={mousePos.y} type="black" />
        <Character mouseX={mousePos.x} mouseY={mousePos.y} type="yellow" />
      </div>
    </div>
  );
};

const Login = () => {
  const [form] = Form.useForm();
  const [captchaUrl, setCaptchaUrl] = useState<string>('');
  const [captchaKey, setCaptchaKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const isMounted = useRef(false);

  const getCaptcha = async () => {
    try {
      const res = await authApi.getCaptcha();
      const captchaData = res.data as unknown as CaptchaResponse;
      setCaptchaUrl(captchaData.captchaImage);
      setCaptchaKey(captchaData.captchaKey);
      form.setFieldValue('captchaKey', captchaData.captchaKey);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      getCaptcha();
    }
  }, []);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const loginValues = {
        ...values,
        captchaKey: captchaKey || values.captchaKey,
      };

      const res = await authApi.login(loginValues);
      const { token, userInfo } = res.data;
      loginStore(token, userInfo);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error(error);
      getCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* 左侧 - 卡通角色区域 */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
          position: 'relative',
        }}
      >
        <CartoonScene />
      </div>

      {/* 右侧 - 登录表单 */}
      <div
        style={{
          width: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '0 60px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: 40,
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            用户登录
          </Title>

          <Form
            form={form}
            onFinish={handleLogin}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              style={{ display: 'none' }}
              name="captchaKey"
              initialValue={captchaKey}
            >
              <Input type="hidden" />
            </Form.Item>

            <Form.Item
              name="username"
              label="账号"
              rules={[{ required: true, message: '请输入用户名!' }]}
              style={{ marginBottom: 20 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                placeholder="请输入用户名"
                size="large"
                style={{
                  height: 44,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码!' }]}
              style={{ marginBottom: 20 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="请输入密码"
                size="large"
                style={{
                  height: 44,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item
              name="captcha"
              label="验证码"
              rules={[{ required: true, message: '请输入验证码!' }]}
              style={{ marginBottom: 24 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Input
                  placeholder="请输入验证码"
                  size="large"
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 8,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {captchaUrl ? (
                    <Image
                      src={captchaUrl}
                      alt="验证码"
                      style={{
                        height: 44,
                        width: 120,
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb',
                      }}
                      onClick={getCaptcha}
                      preview={false}
                    />
                  ) : (
                    <div
                      style={{
                        height: 44,
                        width: 120,
                        backgroundColor: '#f3f4f6',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: 12,
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      加载中...
                    </div>
                  )}
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={getCaptcha}
                    size="large"
                    style={{ color: '#6b7280' }}
                  />
                </div>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  height: 44,
                  fontSize: 16,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #3730a3 0%, #581c87 100%)',
                  border: 'none',
                }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
