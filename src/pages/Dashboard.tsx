import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>欢迎使用科科校园管理系统</h2>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活动数量"
              value={93}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="社团数量"
              value={42}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 