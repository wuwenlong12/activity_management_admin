import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Tag, Input, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getVerificationList, reviewVerification } from '../../api/verification';
import type { Verification } from '../../api/verification/types';
import styles from './index.module.scss';

const VerificationManagement: React.FC = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchVerifications = async (page = '1', limit = '10') => {
    setLoading(true);
    try {
      const res = await getVerificationList({ page, limit });
      if (res.code === 0) {
        setVerifications(res.data.list);
        setTotal(res.data.total);
      } else {
        message.error('获取认证申请列表失败');
      }
    } catch (error) {
      message.error('获取认证申请列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(String(currentPage), String(pageSize));
  }, [currentPage, pageSize]);

  const handleReview = async (record: Verification, approved: boolean, rejectReason?: string) => {
    try {
      const res = await reviewVerification({
        verificationId: record._id,
        approved,
        rejectReason
      });
      if (res.code === 0) {
        message.success(approved ? '已通过认证申请' : '已拒绝认证申请');
        fetchVerifications(String(currentPage), String(pageSize));
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<Verification> = [
    {
      title: '申请ID',
      dataIndex: '_id',
      width: 220,
    },
    {
      title: '申请人',
      dataIndex: ['user', 'username'],
      width: 120,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 120,
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      width: 120,
    },
    {
      title: '联系方式',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical">
          <span>电话：{record.phone}</span>
          <span>邮箱：{record.email}</span>
        </Space>
      ),
    },
    {
      title: '认证类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'personal' ? 'blue' : 'green'}>
          {type === 'personal' ? '个人认证' : '机构认证'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'gold', text: '待审核' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' }
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '学生证照片',
      dataIndex: 'studentCardImage',
      width: 120,
      render: (image: string) => (
        <Image
          src={image}
          alt="学生证照片"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: '拒绝原因',
      dataIndex: 'rejectReason',
      width: 150,
      render: (reason: string) => reason || '-',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                onClick={() => handleReview(record, true)}
              >
                通过
              </Button>
              <Button 
                type="link" 
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '拒绝认证',
                    content: (
                      <div>
                        <p>请输入拒绝原因：</p>
                        <Input.TextArea 
                          id="rejectReason"
                          rows={4}
                        />
                      </div>
                    ),
                    onOk: () => {
                      const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement).value;
                      if (!reason) {
                        message.error('请输入拒绝原因');
                        return Promise.reject();
                      }
                      return handleReview(record, false, reason);
                    }
                  });
                }}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16 }}>
        <h2>认证审核管理</h2>
      </div>

      <Table
        columns={columns}
        dataSource={verifications}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 2000 }}
        pagination={{
          total,
          current: currentPage,
          pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default VerificationManagement;