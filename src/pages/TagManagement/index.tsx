import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Form, Input, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getTagList, deleteTag, createTag } from '../../api/tag';
import type { Tag } from '../../api/tag/type';
import styles from './index.module.scss';

const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await getTagList();
      if (res.code === 0) {
        setTags(res.data);
      } else {
        message.error('获取标签列表失败');
      }
    } catch (error) {
      message.error('获取标签列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEdit = (record: Tag) => {
    setCurrentTag(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteTag(id);
      if (res.code === 0) {
        message.success('删除成功');
        fetchTags();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };



  const handleCreate = async (values: any) => {
    try {
      const res = await createTag({
        name: values.name,
      });
      if (res.code === 0) {
        message.success('创建标签成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        fetchTags();
      }
    } catch (error) {
      message.error('创建标签失败');
    }
  };

  const columns: ColumnsType<Tag> = [
    {
      title: '标签ID',
      dataIndex: '_id',
      key: '_id',
      width: 220,
    },
    {
      title: '标签名称',
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
      render: (_: any, record: Tag) => (
        <Space size="middle">

          <Popconfirm
            title="确定要删除这个标签吗？"
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

  const renderTagForm = (formInstance: any, onFinish: (values: any) => void) => (
    <Form form={formInstance} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="标签名称"
        name="name"
        rules={[{ required: true, message: '请输入标签名称' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>标签管理</h2>
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          新建标签
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="新建标签"
        open={createModalVisible}
        onOk={() => createForm.submit()}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
      >
        {renderTagForm(createForm, handleCreate)}
      </Modal>

    
    </div>
  );
};

export default TagManagement;