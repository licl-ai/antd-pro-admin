import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import CreateForm from './CreateForm';

export interface ResponseData {
  status: 'ok' | 'error';
  message?: any[] | string;
  data?: any;
}

export interface ChildrenProp {
  addFlag: boolean;
  onCancel: () => void;
  createModalVisible: boolean;
  onSubmit: Function;
}
interface TableListAndModalProp<T> {
  columns: ProColumns<T>[];
  rowKey: string;
  addBtn?: boolean;
  operBtns?: boolean;
  updateBtn?: boolean;
  delBtn?: boolean;
  getData: (params: any) => Promise<RequestData<T>>;
  handleUpdateFun?: (id: any, data: {}) => Promise<ResponseData>;
  handleRemoveFun?: (data: any[]) => Promise<ResponseData>;
  handleFormData?: () => Promise<any>;
  genExtraBtns?: (action: { current: any }) => React.ReactNode[];
  children?: (params: ChildrenProp) => React.ReactNode;
  form?: FormInstance | undefined;
}

const handleUpdate = async (
  handleUpdateFun: Function | undefined,
  from: React.MutableRefObject<FormInstance | undefined>,
  id: any,
  fields: {},
  addFlag: boolean,
) => {
  if (handleUpdateFun === undefined) {
    return false;
  }
  const type = addFlag ? '添加' : '修改';
  const hide = message.loading(`正在${type}`);
  try {
    const { status, message: errors } = await handleUpdateFun(id, { ...fields });
    hide();
    if (status !== 'ok') {
      if (from.current && typeof errors === 'object' && errors.length) {
        from.current.setFields(errors);
      }
      return false;
    }
    message.success(`${type}成功`);
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.error(`${type}失败请重试！`);
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (
  handleRemoveFun: Function | undefined,
  rowKey: string,
  selectedRows: any[],
) => {
  if (handleRemoveFun === undefined) {
    return false;
  }
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const { success } = await handleRemoveFun(selectedRows.map(row => row[rowKey]));
    hide();
    if (success !== 'ok') {
      return false;
    }
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableListAndModal = <T extends {}>(props: TableListAndModalProp<T>) => {
  const {
    columns,
    rowKey,
    addBtn = true,
    operBtns = true,
    updateBtn = true,
    delBtn = true,
    getData,
    handleUpdateFun,
    handleRemoveFun,
    genExtraBtns,
    children,
    form,
  } = props;
  const formRef = useRef<FormInstance>();
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [addFlag, setAddFlag] = useState<boolean>(true);
  const [rowData, setRowData] = useState<object>({});
  useEffect(() => {
    if (form) {
      formRef.current = {
        ...form,
      };
    }
  }, []);
  var mergerColumns = columns;

  if (operBtns) {
    mergerColumns = [
      ...columns,
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record, index, action) => (
          <>
            {updateBtn && (
              <a
                onClick={() => {
                  setAddFlag(false);
                  if (formRef.current) {
                    formRef.current.setFieldsValue({
                      ...record,
                    });
                  }
                  setRowData({ ...record });
                  handleModalVisible(true);
                }}
              >
                修改
              </a>
            )}
            {updateBtn && delBtn && <Divider type="vertical" />}
            {delBtn && (
              <a
                onClick={async () => {
                  await handleRemove(handleRemoveFun, rowKey, [record]);
                  action.reload();
                }}
              >
                删除
              </a>
            )}
          </>
        ),
      },
    ];
  }
  var btns: React.ReactNode[] = [];
  if (typeof genExtraBtns === 'function') {
    btns = genExtraBtns(actionRef);
  }

  const renderChildrenNode = () => {
    if (!addBtn && (!operBtns || !updateBtn)) {
      return null;
    }
    if (children) {
      return children({
        addFlag,
        createModalVisible,
        onCancel: () => {
          handleModalVisible(false);
          setRowData({});
        },
        onSubmit: async (value: any) => {
          const id = rowData[rowKey] || undefined;
          const success = await handleUpdate(handleUpdateFun, formRef, id, value, addFlag);

          if (success) {
            handleModalVisible(false);
            setRowData({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        },
      });
    }
    return (
      <CreateForm
        title={addFlag ? '新建' : '修改'}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<T, T>
          onSubmit={async value => {
            const id = rowData[rowKey] || undefined;
            const success = await handleUpdate(handleUpdateFun, formRef, id, value, addFlag);

            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          formRef={formRef}
          // search={{ optionRender: false }}
          form={{ initialValues: rowData }}
          rowKey={rowKey}
          type="form"
          columns={columns}
          rowSelection={false}
        />
      </CreateForm>
    );
  };

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
        toolBarRender={(action, { selectedRows }) => [
          addBtn ? (
            <Button
              type="primary"
              onClick={() => {
                setAddFlag(true);
                if (formRef.current) {
                  formRef.current.resetFields();
                }
                setRowData({});
                handleModalVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>
          ) : null,
          ...btns,
        ]}
        tableAlertRender={false}
        request={params => getData(params)}
        columns={mergerColumns}
        rowSelection={false}
      />
      {renderChildrenNode()}
    </PageHeaderWrapper>
  );
};

export default TableListAndModal;
