import React from 'react';
import { Button, message } from 'antd';
import TableListAndModal from '@/components/TableListAndModal';
import { ProColumns } from '@ant-design/pro-table';
import { queryPremit, generatePremit, updatePremit, removePremit } from './service';
import { PremitItem } from './data.d';

const handleGenerate = async () => {
  const hide = message.loading('正在生成平台权限');
  try {
    const { status } = await generatePremit();
    hide();
    if (status !== 'ok') {
      return false;
    }
    message.success('生成成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('生成失败，请重试');
    return false;
  }
};

const Premit: React.FC<{}> = () => {
  const columns: ProColumns<PremitItem>[] = [
    {
      title: 'ID',
      dataIndex: 'premit_id',
      hideInForm: true,
      sorter: true,
    },
    {
      title: '模块',
      dataIndex: 'premit_module',
      rules: [
        {
          required: true,
          message: '模块不能为空',
        },
        {
          max: 20,
          message: '模块最多20个字符',
        },
      ],
    },
    {
      title: '模块描述',
      dataIndex: 'premit_module_desc',
      rules: [
        {
          required: true,
          message: '模块描述不能为空',
        },
        {
          max: 50,
          message: '模块描述最多50个字符',
        },
      ],
    },
    {
      title: '方法',
      dataIndex: 'premit_action',
      rules: [
        {
          required: true,
          message: '方法不能为空',
        },
        {
          max: 50,
          message: '方法最多50个字符',
        },
      ],
    },
    {
      title: '方法描述',
      dataIndex: 'premit_action_desc',
      rules: [
        {
          required: true,
          message: '方法描述不能为空',
        },
        {
          max: 20,
          message: '方法描述最多20个字符',
        },
      ],
    },
  ];

  const generateBtns = (actionRef: { current: any }) => {
    return [
      <Button
        type="primary"
        onClick={async () => {
          const success = await handleGenerate();
          if (success && actionRef.current) {
            actionRef.current.reload();
          }
        }}
      >
        生成平台权限
      </Button>,
    ];
  };

  return (
    <TableListAndModal<PremitItem>
      rowKey="premit_id"
      getData={queryPremit}
      columns={columns}
      addBtn={false}
      handleUpdateFun={updatePremit}
      handleRemoveFun={removePremit}
      genExtraBtns={generateBtns}
    />
  );
};

export default Premit;
