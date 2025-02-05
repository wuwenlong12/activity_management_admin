import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Form, Input, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getSchoolList, deleteSchool, updateSchool, createSchool } from '../../api/school';
import type { School } from '../../api/school/types';
import styles from './index.module.scss';

const SchoolManagement: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await getSchoolList();
      if (res.code === 0) {
        setSchools(res.data);
      } else {
        message.error('获取学校列表失败');
      }
    } catch (error) {
      message.error('获取学校列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleEdit = (record: School) => {
    setCurrentSchool(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSchool(id);
      if (res.code === 0) {
        message.success('删除成功');
        fetchSchools();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!currentSchool?._id) return;
    try {
      const res = await updateSchool(currentSchool._id, {
        name: values.name,
      });
      if (res.code === 0) {
        message.success('更新成功');
        setEditModalVisible(false);
        fetchSchools();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const res = await createSchool({
        name: values.name,
      });
      if (res.code === 0) {
        message.success('创建学校成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        fetchSchools();
      }
    } catch (error) {
      message.error('创建学校失败');
    }
  };

  const columns: ColumnsType<School> = [
    {
      title: '学校ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
    },
    {
      title: '学校名称',
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
      render: (_: any, record: School) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个学校吗？"
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

  const renderSchoolForm = (formInstance: any, onFinish: (values: any) => void) => (
    <Form form={formInstance} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="学校名称"
        name="name"
        rules={[{ required: true, message: '请输入学校名称' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>学校管理</h2>
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          新建学校
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={schools}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="新建学校"
        open={createModalVisible}
        onOk={() => createForm.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
      >
        {renderSchoolForm(createForm, handleCreate)}
      </Modal>

      <Modal
        title="编辑学校"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
      >
        {renderSchoolForm(form, handleUpdate)}
      </Modal>
    </div>
  );
};

export default SchoolManagement;