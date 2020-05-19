import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { Link } from 'umi';

export interface TableListProps<T> {
  columns: ProColumns<T>[];
  rowKey: string;
  addNewLink: string;
  getData: (params: any) => Promise<RequestData<T>>;
}

const TableList = <T extends {}>(props: TableListProps<T>) => {
  const { columns, rowKey, addNewLink, getData } = props;
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();

  return (
    <PageHeaderWrapper>
      <ProTable<T>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey={rowKey}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<T>;
          if (sorterResult.field && sorterResult.order) {
            const order = sorterResult.order === 'descend' ? '.desc' : '';
            setSorter(`${sorterResult.field}${order}`);
          } else {
            setSorter('');
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={action => [
          <Link to={addNewLink}>
            <Button type="primary">
              <PlusOutlined /> 新建
            </Button>
          </Link>,
        ]}
        tableAlertRender={false}
        request={params => getData(params)}
        columns={columns}
        rowSelection={false}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
