import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Form, Input, Popconfirm, Select, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getUserList, deleteUser, updateUser, createUser } from '../../api/user';
import type { User } from '../../api/user/types';
import styles from './index.module.scss';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileInChunks } from '../../utils/uploadFileInChunks';
import { getRoleList } from '../../api/role';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [createForm] = Form.useForm();
  const [form] = Form.useForm();

  

  useEffect(() => {
    console.log('UserManagement mounted');
    fetchUsers();
  }, [currentPage, pageSize]);


  useEffect(() => {
    const fetchRoles = async () => {
      const res = await getRoleList();
      setRoleOptions(
        res.data.map((role) => ({
          label: role.name || '',
          value: role._id || ''
        }))
      );
    };
    fetchRoles();
  }, []);
  const fetchUsers = async () => {
    console.log('Fetching users...');
    try {
      setLoading(true);
      const res = await getUserList({ 
        page: currentPage, 
        limit: pageSize
      });
      console.log('完整的响应数据:', res.message);
      if (res.code === 0) {
        setUsers(res.data.users);
        setTotal(res.data.pagination.totalUsers);
      } else {
        message.error(res.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表错误:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    form.setFieldsValue({
      ...record,
      role: record.role._id,
      password: undefined
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteUser(id);
      if (res.code === 0) {
        message.success('删除成功');
        fetchUsers();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!currentUser) return;
    try {
      const changedFields = Object.keys(values).reduce((acc: any, key) => {
        if (key === 'role') {
          if (values.role !== currentUser.role._id) {
            acc.role = values.role;
          }
          return acc;
        }
        
        if (values[key] !== currentUser[key as keyof User] && values[key] !== undefined && values[key] !== '') {
          acc[key] = values[key];
        }
        return acc;
      }, {});

      if (Object.keys(changedFields).length === 0) {
        message.info('没有字段被修改');
        setEditModalVisible(false);
        return;
      }

      console.log('修改的字段:', changedFields);
      const res = await updateUser(currentUser._id, changedFields);
      
      if (res.code === 0) {
        message.success('更新成功');
        setEditModalVisible(false);
        fetchUsers();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const url = await uploadFileInChunks(file);
      form.setFieldValue('imgurl', url);
      message.success('头像上传成功');
    } catch (error) {
      message.error('头像上传失败');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const res = await createUser({
        ...values,
        role: values.role
      });
      if (res.code === 0) {
        message.success('创建用户成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        fetchUsers();
      }
    } catch (error) {
      message.error('创建用户失败');
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: '用户ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => role?.name || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '头像',
      dataIndex: 'imgurl',
      key: 'imgurl',
      render: (imgurl: string) => (
        <img 
          src={imgurl || '/user/user.png'} 
          alt="avatar" 
          style={{ width: 40, height: 40, borderRadius: '50%' }} 
        />
      ),
    },
    {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',

    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '个人简介',
      dataIndex: 'bio',
      key: 'bio',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>用户管理</h2>
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          新建用户
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 2000 }}
        pagination={{
          total,
          current: currentPage,
          pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />

      <Modal
        title="新建用户"
        open={createModalVisible}
        onOk={() => createForm.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={600}
      >
        <Form form={createForm} onFinish={handleCreate} layout="vertical">
          <Form.Item 
            label="角色" 
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>

          <Form.Item 
            label="用户名" 
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="密码" 
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                message: '密码必须包含大小写字母和数字，长度8-16位'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item 
            label="邮箱" 
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="头像" 
            name="imgurl"
          >
            <Input.Group compact>
              <Form.Item
                noStyle
                name="imgurl"
              >
                <Input style={{ width: 'calc(100% - 100px)' }} placeholder="头像URL" />
              </Form.Item>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={({ file }) => handleUpload(file as File)}
              >
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </Input.Group>
          </Form.Item>

          <Form.Item label="学校" name="school">
            <Input />
          </Form.Item>

          <Form.Item label="班级" name="className">
            <Input />
          </Form.Item>

          <Form.Item label="学号" name="studentId">
            <Input />
          </Form.Item>

          <Form.Item 
            label="手机号" 
            name="phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="个人简介" name="bio">
            <Input.TextArea rows={4} maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑用户"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
        width={600}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item 
            label="角色" 
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>

          <Form.Item 
            label="用户名" 
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="邮箱" 
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="头像" 
            name="imgurl"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Input.Group compact>
              <Form.Item
                noStyle
                name="imgurl"
              >
                <Input style={{ width: 'calc(100% - 100px)' }} placeholder="头像URL" />
              </Form.Item>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={({ file }) => handleUpload(file as File)}
              >
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </Input.Group>
          </Form.Item>

          <Form.Item label="学校" name="school">
            <Input />
          </Form.Item>

          <Form.Item label="班级" name="className">
            <Input />
          </Form.Item>

          <Form.Item label="学号" name="studentId">
            <Input />
          </Form.Item>

          <Form.Item 
            label="手机号" 
            name="phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="个人简介" name="bio">
            <Input.TextArea rows={4} maxLength={500} showCount />
          </Form.Item>

          <Form.Item 
            label="修改密码" 
            name="password"
            rules={[
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                message: '密码必须包含大小写字母和数字，长度8-16位'
              }
            ]}
          >
            <Input.Password placeholder="不修改请留空" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 