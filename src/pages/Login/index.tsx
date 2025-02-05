import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
     const res = await login(values.username, values.password);
      if (res.code === 0) {
        dispatch(setUser(res.data));
        message.success('登录成功！');
        navigate('/');
      }

    } catch (error: any) {
      message.error(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>科科校园管理系统</h1>
          <p>Campus Management System</p>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined className={styles.icon} />} 
              placeholder="请输入用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined className={styles.icon} />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              className={styles.loginButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 