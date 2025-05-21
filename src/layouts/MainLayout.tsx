import React from 'react';
import { Layout, Menu, Typography, Avatar, Space, Badge, Dropdown } from 'antd';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  AuditOutlined
} from '@ant-design/icons';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import RoleManagement from '../pages/RoleManagement';
import Settings from '../pages/Settings';
import TagManagement from '../pages/TagManagement';
import SchoolManagement from '../pages/SchoolManagement';
import VerificationManagement from '../pages/VerificationManagement';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const headerItems = [
    {
      key: '1',
      label: '个人中心',
      icon: <UserSwitchOutlined />
    },
    {
      key: '2',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo" style={{ 
          height: 64, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            科科校园管理
          </Title>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: <Link to="/">仪表盘</Link>
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: <Link to="/users">用户管理</Link>
            },
            {
              key: '3',
              icon: <TeamOutlined />,
              label: <Link to="/roles">角色管理</Link>
            },
            {
              key: '4',
              icon: <SettingOutlined />,
              label: <Link to="/settings">系统设置</Link>
            },
            {
              key: '5',
              icon: <SettingOutlined />,
              label: <Link to="/tags">标签设置</Link>
            },
            {
              key: '6',
              icon: <SettingOutlined />,
              label: <Link to="/schools">学校管理</Link>
            },
            {
              key: '7',
              icon: <AuditOutlined />,
              label: <Link to="/verifications">认证审核</Link>
            }
          ]}
        />

      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Space size={24}>
            <Badge count={5} dot>
              <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: headerItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          borderRadius: '4px'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tags" element={<TagManagement />} />
            <Route path="/schools" element={<SchoolManagement />} />
            <Route path="/verifications" element={<VerificationManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 