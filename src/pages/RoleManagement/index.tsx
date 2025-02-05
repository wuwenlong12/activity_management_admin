import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Form, Input, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getRoleList, deleteRole, updateRole, createRole } from '../../api/role';
import type { Role } from '../../api/role/types';
import styles from './index.module.scss';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRoleList();
      if (res.code === 0) {
        setRoles(res.data);
      } else {
        message.error('获取角色列表失败');
      }
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (record: Role) => {
    setCurrentRole(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteRole(id);
      if (res.code === 0) {
        message.success('删除成功');
        fetchRoles();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!currentRole?._id) return;
    try {
      const res = await updateRole(currentRole._id, {
        name: values.name,
        key: values.key  // 更新角色key
      });
      if (res.code === 0) {
        message.success('更新成功');
        setEditModalVisible(false);
        fetchRoles();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const res = await createRole({
        name: values.name,
        key: values.key  // 新增角色key
      });
      if (res.code === 0) {
        message.success('创建角色成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        fetchRoles();
      }
    } catch (error) {
      message.error('创建角色失败');
    }
  };

  const columns: ColumnsType<Role> = [
    {
      title: '角色ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
    },
    {
      title: '角色key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
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
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个角色吗？"
            onConfirm={() => handleDelete(record._id || '')}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderRoleForm = (formInstance: any, onFinish: (values: any) => void) => (
    <Form form={formInstance} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="角色名称"
        name="name"
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="角色key"
        name="key"
        rules={[{ required: true, message: '请输入角色key' }]}  // 必填
      >
        <Input />
      </Form.Item>
    </Form>
  );

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>角色管理</h2>
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          新建角色
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="新建角色"
        open={createModalVisible}
        onOk={() => createForm.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
      >
        {renderRoleForm(createForm, handleCreate)}
      </Modal>

      <Modal
        title="编辑角色"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
      >
        {renderRoleForm(form, handleUpdate)}
      </Modal>
    </div>
  );
};

export default RoleManagement;