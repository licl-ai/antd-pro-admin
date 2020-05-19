import React from 'react';
import { Link } from 'umi';
import { Divider, message } from 'antd';
import TableList from '@/components/TableList';
import { DragAdjustPriceItem } from './data.d';
import { queryData, removeData } from './service';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: DragAdjustPriceItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeData({
      key: selectedRows.map(row => row.dp_id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const DragAdjustPrice: React.FC<{}> = () => {
  const columns = [
    {
      title: '批次',
      dataIndex: 'dp_no',
      sorter: true,
    },
    {
      title: '调价人',
      dataIndex: 'dp_confirm_name',
    },
    {
      title: '调价日期',
      dataIndex: 'dp_confirm_date',
      sorter: true,
      valueType: 'date',
    },
    {
      title: '状态',
      dataIndex: 'dp_status',
      hideInForm: true,
      valueEnum: {
        '1.未确认': { text: '1.未确认' },
        '2.已确认': { text: '2.已确认' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record, index, action) => (
        <>
          <Link to={`/dragAdjustPrice/edit?id=${record.dp_id}`}>编辑</Link>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              await handleRemove([record]);
              action.reload();
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  return (
    <TableList<DragAdjustPriceItem>
      columns={columns}
      rowKey="dp_id"
      addNewLink="/dragAdjustPrice/edit"
      getData={queryData}
    />
  );
};

export default DragAdjustPrice;
