import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import TableListAndModal from '@/components/TableListAndModal';
import { ProColumns } from '@ant-design/pro-table';
import { RoleItem } from './data.d';
import { queryRole, queryPremits, updateRole, addRole, removeRole } from './service';

const fetchPremits = (callback: Function) => {
  queryPremits().then(({ status, data }) => {
    if (status === 'ok' && callback) {
      callback(data);
    }
  });
};
const RolePremit: React.FC<{}> = () => {
  const [premits, setPremits] = useState([]);
  useEffect(() => {
    fetchPremits(setPremits);
  }, []);
  const onCheck = (form: any, checkedKeys: any) => {
    form.setFieldsValue({ premits: checkedKeys });
  };

  const columns: ProColumns<RoleItem>[] = [
    {
      title: 'ID',
      dataIndex: 'role_id',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '角色名',
      dataIndex: 'role_name',
      rules: [
        {
          required: true,
          message: '角色名不能为空',
        },
      ],
    },
    {
      title: '权限',
      dataIndex: 'premits',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (item, config, form) => {
        const role_id = form.getFieldValue('role_id');
        if (role_id === '1') {
          return <span>全部</span>;
        }
        const checkedKeys = form.getFieldValue('premits');
        return (
          <Tree
            checkable
            defaultExpandAll={checkedKeys === undefined}
            treeData={premits}
            defaultCheckedKeys={checkedKeys}
            defaultExpandedKeys={checkedKeys}
            onCheck={keys => onCheck(form, keys)}
          />
        );
      },
    },
  ];

  const handleUpdateFun = (id: any, data: {}) => {
    if (id) {
      return updateRole({ role_id: id, ...data });
    } else {
      return addRole(data);
    }
  };
  return (
    <TableListAndModal<RoleItem>
      rowKey="role_id"
      handleUpdateFun={handleUpdateFun}
      handleRemoveFun={removeRole}
      getData={queryRole}
      columns={columns}
    />
  );
};

export default RolePremit;
