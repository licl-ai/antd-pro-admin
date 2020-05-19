import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Button, Card, Form, Popover } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableForm, { TableFormProps, TableFormDataType } from './TableForm';
import FooterToolbar from './FooterToolbar';
import styles from './style.less';

type InternalNamePath = (string | number)[];
interface Detail {
  [propname: string]: any;
}
interface DetailFormProps {
  data: Detail;
  handleFinish: (
    param: { [key: string]: any },
    data: { master: { [key: string]: any }; details: any[]; delItems: string[] },
  ) => void;
  detailFormProps: TableFormProps;
  submitting?: boolean;
  fieldLabels: object;
  keyName: string;
}

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const DetailForm: React.FC<DetailFormProps> = props => {
  const {
    data = { details: [] },
    handleFinish,
    detailFormProps,
    submitting,
    fieldLabels,
    children,
    keyName,
  } = props;
  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const [detailDelItems, setDetailDelItems] = useState<string[]>([]);
  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = (values: { [key: string]: any }) => {
    setError([]);
    if (handleFinish) {
      const { details, ...master } = values;
      const editedDetails = details?.filter((row: TableFormDataType) => row.rowEdited);
      //master: 主表数据，detailDelItems: 副表删除数据，details: 副表添加/修改的数据
      const data = { master, delItems: detailDelItems, details: editedDetails };
      console.log('values', values, 'changes', data);
      handleFinish(values, data);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  const handleDelRow = (row: TableFormDataType): void => {
    const value: string = row[keyName];
    if (!value) {
      return;
    }
    if (detailDelItems.includes(value)) {
      return;
    }
    setDetailDelItems([...detailDelItems, value]);
  };

  const { details } = data;
  const { rowKey } = detailFormProps;
  return (
    <Form
      form={form}
      layout="vertical"
      hideRequiredMark
      initialValues={data}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageHeaderWrapper>
        {children}
        <Card title="明细" bordered={false}>
          <Form.Item name="details">
            <TableForm
              initSeq={
                details && details.length ? Number(details[details.length - 1][rowKey]) + 1 : 1
              }
              handleDelRow={handleDelRow}
              {...detailFormProps}
            />
          </Form.Item>
        </Card>
      </PageHeaderWrapper>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default DetailForm;
