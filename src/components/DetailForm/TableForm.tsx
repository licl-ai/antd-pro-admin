import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Divider, Input, InputNumber, Popconfirm, Table } from 'antd';
import React, { FC, useState } from 'react';
import AutoListView, { AutoListViewProps, AutoListViewOption } from '@/components/AutoListView';
import { strPadLeft } from '@/utils/utils';

import styles from './style.less';

interface EditableCellProps {
  title: React.ReactNode;
  editing: boolean;
  children: React.ReactNode;
  dataIndex: string;
  inputType: string;
  record: TableFormDataType;
  searchProps: AutoListViewProps;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editing,
  children,
  dataIndex,
  inputType,
  searchProps,
  record,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case 'number':
      inputNode = <InputNumber placeholder={`${title}`} />;
      break;
    case 'search':
      inputNode = <AutoListView {...searchProps} />;
      break;
    default:
      inputNode = <Input placeholder={`${title}`} />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请填写${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export interface TableFormDataType {
  isNew?: boolean;
  rowAdd?: boolean;
  rowEdited?: boolean;
  [propname: string]: any;
}

export type TableFormInputTypes = 'search' | 'number' | 'text' | undefined;

export interface TableFormColumns {
  title: string;
  dataIndex: string;
  width?: number | string;
  editable?: boolean;
  inputType?: TableFormInputTypes;
  searchProps?: AutoListViewProps;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  rules?: any[];
}
export interface TableFormProps {
  columns: TableFormColumns[];
  value?: TableFormDataType[];
  onChange?: (value: TableFormDataType[]) => void;
  handleDelRow?: (value: TableFormDataType) => void;
  handleSaveRow?: (value: TableFormDataType) => void;
  initSeq?: number;
  relations?: {
    [key: string]: RelationColumn[];
  };
  rowKey: string;
  afterSave?: (target: TableFormDataType) => void;
  seqLength?: number;
  newRecord: {
    [propName: string]: any;
  };
}

interface RelationColumn {
  name: string;
  column: string;
}

const TableForm: FC<TableFormProps> = ({
  columns,
  rowKey,
  value,
  onChange,
  handleDelRow,
  handleSaveRow,
  initSeq = 1,
  seqLength = 3,
  relations,
  afterSave,
  newRecord,
}) => {
  const [form] = Form.useForm();
  const [clickedCancel, setClickedCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seqNum, setSeqNum] = useState(initSeq);
  const [cacheOriginData, setCacheOriginData] = useState({});
  const [data, setData] = useState(value);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: TableFormDataType) => record[rowKey] === editingKey;

  const getRowByKey = (key: string, newData?: TableFormDataType[]) =>
    (newData || data)?.filter(item => item[rowKey] === key)[0];

  const newMember = () => {
    const newData = data?.map(item => ({ ...item })) || [];
    // eslint-disable-next-line no-unused-expressions
    const seq = strPadLeft(seqNum, seqLength);
    const newRecordData = { ...newRecord, isNew: true, rowAdd: true };
    newRecordData[rowKey] = seq;
    newData?.push(newRecordData);
    setSeqNum(seqNum + 1);
    setData(newData);
    form.setFieldsValue({ ...newRecordData });
    setEditingKey(seq);
  };

  const remove = (key: string) => {
    const target = getRowByKey(key, [...(data as TableFormDataType[])]);
    const newData = data?.filter(item => item[rowKey] !== key) as TableFormDataType[];
    console.log('newData', newData, 'key', key);
    setData(newData);
    setEditingKey('');
    if (handleDelRow && !target.rowAdd) {
      handleDelRow(target);
    }
    if (onChange) {
      onChange(newData);
    }
  };

  const handleSelectSearchChange = (option: AutoListViewOption, fieldName: string, key: string) => {
    const newData = [...(data as TableFormDataType[])];
    const target = getRowByKey(key, newData);
    const { value, optiondata } = option;
    if (target) {
      target[fieldName] = value;
      if (optiondata && target[fieldName] && relations) {
        relations[fieldName].map((col: RelationColumn) => {
          target[col.name] = optiondata[col.column];
        });
      }
      setData(newData);
    }
  };

  const saveRow = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.persist();
    setTimeout(async () => {
      if (clickedCancel) {
        setClickedCancel(false);
        return;
      }
      try {
        const formData = await form.validateFields();
        const newData = [...(data as TableFormDataType[])];
        const target = getRowByKey(key, newData);
        if (target) {
          for (let key in formData) {
            target[key] = formData[key];
          }
          if (afterSave) {
            afterSave(target);
          }
          setData(newData);
          setEditingKey('');
          target.rowEdited = true;
          delete target.isNew;
        }
        if (onChange) {
          onChange(data as TableFormDataType[]);
        }
        if (handleSaveRow) {
          handleSaveRow(target);
        }
      } catch (errInfo) {
        console.log('验证失败:', errInfo);
      }
    }, 500);
  };

  const edit = (e: React.MouseEvent | React.KeyboardEvent, record: TableFormDataType) => {
    e.preventDefault();
    form.setFieldsValue({ ...record });
    setEditingKey(record[rowKey]);
    cacheOriginData[record[rowKey]] = { ...record };
    setCacheOriginData(cacheOriginData);
  };

  const cancel = (e: React.MouseEvent, key: string) => {
    setEditingKey('');
    setClickedCancel(true);
    e.preventDefault();
    const newData = [...(data as TableFormDataType[])];
    // 编辑前的原始数据
    let cacheData = [];
    cacheData = newData.map(item => {
      if (item[rowKey] === key) {
        if (cacheOriginData[key]) {
          const originItem = {
            ...item,
            ...cacheOriginData[key],
            editable: false,
          };
          delete cacheOriginData[key];
          setCacheOriginData(cacheOriginData);
          return originItem;
        }
      }
      return item;
    });
    setData(cacheData);
    setClickedCancel(false);
  };

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const mergedColumns = columns.map(col => {
    const { inputType, searchProps, ...rest } = col;

    if (!col.editable) {
      return {
        ...rest,
        key: col.dataIndex,
      };
    }
    return {
      ...rest,
      key: col.dataIndex,
      onCell: (record: TableFormDataType) => ({
        record,
        inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        searchProps: {
          ...searchProps,
          onChange: (value: string | undefined, option: AutoListViewOption) =>
            handleSelectSearchChange(option, col.dataIndex, record[rowKey]),
        },
        editing: isEditing(record),
      }),
    };
  });

  const tableColumns = [
    ...mergedColumns,
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text: string, record: TableFormDataType) => {
        if (loading) {
          return null;
        }
        const editable = isEditing(record);
        if (editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => saveRow(e, record[rowKey])}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record[rowKey])}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => saveRow(e, record[rowKey])}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => cancel(e, record[rowKey])}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a disabled={editingKey !== ''} onClick={e => edit(e, record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              disabled={editingKey !== ''}
              title="是否要删除此行？"
              onConfirm={() => remove(record[rowKey])}
            >
              <a disabled={editingKey !== ''}>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  return (
    <Form form={form} component={false}>
      <Table<TableFormDataType>
        components={components}
        loading={loading}
        columns={tableColumns}
        dataSource={data}
        rowKey={rowKey}
        pagination={false}
        rowClassName={record => (record.editable ? styles.editable : '')}
      />
      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="dashed"
        onClick={newMember}
        disabled={editingKey !== ''}
      >
        <PlusOutlined />
        新增
      </Button>
    </Form>
  );
};

export default TableForm;
