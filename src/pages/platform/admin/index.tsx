import React from 'react';
import { Form, Input, Select, Row, Col, Modal } from 'antd';
import TableListAndModal, { ChildrenProp } from '@/components/TableListAndModal';
import { ProColumns } from '@ant-design/pro-table';
import AutoListView, { AutoListViewOption } from '@/components/AutoListView';
import { queryAdmin, updateAdmin, addAdmin, removeAdmin } from './service';
import { AdminItem } from './data.d';
const FormItem = Form.Item;
const { Option } = Select;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};
const columns: ProColumns<AdminItem>[] = [
  {
    title: 'ID',
    dataIndex: 'uid',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '真实姓名',
    dataIndex: 'realname',
  },
  {
    title: '角色',
    dataIndex: 'role_name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      1: { text: '正常' },
      2: { text: '禁止' },
    },
  },
];
const Admin: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const handleSelectSearchChange = (value: string | undefined, option: AutoListViewOption) => {
    const { optiondata } = option;
    form.setFieldsValue({ role_id: optiondata['role_id'] });
  };
  const handleUpdateFun = (id: any, data: {}) => {
    if (id) {
      return updateAdmin({ uid: id, ...data });
    } else {
      return addAdmin(data);
    }
  };
  return (
    <TableListAndModal<AdminItem>
      rowKey="uid"
      getData={queryAdmin}
      columns={columns}
      form={form}
      handleUpdateFun={handleUpdateFun}
      handleRemoveFun={removeAdmin}
    >
      {(params: ChildrenProp) => {
        const { addFlag, createModalVisible, onCancel, onSubmit } = params;
        return (
          <Modal
            forceRender
            // destroyOnClose
            title={addFlag ? '新建' : '修改'}
            visible={createModalVisible}
            onCancel={() => {
              onCancel();
            }}
            onOk={async () => {
              const values = await form.validateFields();
              onSubmit(values);
            }}
          >
            <Form {...layout} form={form}>
              <FormItem
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请填写用户名' }, { max: 30 }]}
              >
                <Input placeholder="请输入" />
              </FormItem>
              <FormItem
                label="真实姓名"
                name="realname"
                rules={[{ required: true, message: '请填写真实姓名' }, { max: 5 }]}
              >
                <Input placeholder="请输入" />
              </FormItem>
              <FormItem label="角色">
                <Input.Group compact>
                  <FormItem
                    name="role_name"
                    noStyle
                    rules={[{ required: true, message: '请选择角色' }]}
                  >
                    <AutoListView
                      style={{ width: '100%' }}
                      url="/api/role/list"
                      columns={[
                        {
                          title: '角色',
                          dataIndex: 'role_name',
                          key: 'role_name',
                        },
                      ]}
                      valueColumn="role_name"
                      placeholder="角色"
                      showMenuHeader={false}
                      onChange={handleSelectSearchChange}
                      type="select"
                    />
                  </FormItem>
                  <FormItem name="role_id" noStyle>
                    <Input type="hidden" />
                  </FormItem>
                </Input.Group>
              </FormItem>
              <FormItem
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">禁止</Option>
                </Select>
              </FormItem>
              {addFlag && (
                <>
                  <FormItem
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请填写密码' }, { max: 32 }]}
                  >
                    <Input type="password" />
                  </FormItem>
                  <FormItem
                    label="重复密码"
                    name="repassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: '请填写重复密码' },
                      { max: 32 },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('重复密码与密码不一致');
                        },
                      }),
                    ]}
                  >
                    <Input type="password" />
                  </FormItem>
                </>
              )}
              {!addFlag && (
                <>
                  <Row gutter={[0, 16]}>
                    <Col offset={2}>提示：重置密码时填写</Col>
                  </Row>
                  <FormItem label="密码" name="password" rules={[{ max: 32 }]}>
                    <Input type="password" />
                  </FormItem>
                  <FormItem
                    label="重复密码"
                    name="repassword"
                    dependencies={['password']}
                    rules={[
                      { max: 32 },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          const password = getFieldValue('password');
                          if (password && !value) {
                            return Promise.reject('请填写重复密码');
                          }
                          if (!value || password === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('重复密码与密码不一致');
                        },
                      }),
                    ]}
                  >
                    <Input type="password" />
                  </FormItem>
                </>
              )}
            </Form>
          </Modal>
        );
      }}
    </TableListAndModal>
  );
};

export default Admin;
