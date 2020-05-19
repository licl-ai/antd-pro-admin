import { Card, Col, Form, Input, Row } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import DetailForm from '@/components/DetailForm';
import { TableFormProps } from '@/components/DetailForm/TableForm';
import { ConnectState } from '@/models/connect';
import { fetchDetail } from '@/services/drag';
import styles from './style.less';

const fieldLabels = {
  dp_no: '批次',
  dp_record_uid: '经办人',
  dp_record_name: '经办人名',
  dp_confirm_uid: '确认人',
  dp_confirm_name: '确认人名',
  dp_confirm_date: '调价日期',
  dp_status: '状态',
  dp_date: '经办日期',
  dp_mark: '调价原因',
  dp_stoc: '库别',
  dp_stoc_name: '库别名称',
};

export interface FormData {
  [propName: string]: any;
}

interface FormAdvancedFormProps {
  dispatch: Dispatch<any>;
  submitting?: boolean;
  [propName: string]: any;
}

const Edit: FC<FormAdvancedFormProps> = props => {
  const { submitting, dispatch, location } = props;
  const [data, setData] = useState<FormData>({});
  const id = location.query.id || 0;
  useEffect(() => {
    if (id) {
      fetchDetail(id).then(res => setData(res));
    }
  }, [id]);

  const handleFinish = (values: any, data: any) => {
    dispatch({
      type: 'formAdvancedForm/submitAdvancedForm',
      payload: data,
    });
  };

  const detailFormData: TableFormProps = {
    columns: [
      {
        title: '序号',
        dataIndex: 'dpd_seq',
        width: 60,
      },
      {
        title: '药品编码',
        dataIndex: 'dpd_drag_no',
        width: 120,
        inputType: 'search',
        editable: true,
        searchProps: {
          columns: [
            {
              title: '药品编号',
              dataIndex: 'st_drag_no',
              key: 'st_drag_no',
              width: 110,
            },
            {
              title: '药品名称',
              dataIndex: 'st_drag_name',
              key: 'st_drag_name',
              width: 150,
            },
            {
              title: '规格',
              dataIndex: 'st_spec',
              key: 'st_spec',
              width: 80,
            },
            {
              title: '生产厂家',
              dataIndex: 'st_factory_name',
              key: 'st_factory_name',
              width: 100,
            },
            {
              title: '单位',
              dataIndex: 'st_bzdw',
              key: 'st_bzdw',
              width: 60,
            },
            {
              title: '包装数量',
              dataIndex: 'st_bzsl',
              key: 'st_bzsl',
              width: 80,
            },
          ],
          url: '/api/yps',
          valueColumn: 'st_drag_no',
          style: { width: 120 },
          placeholder: '药品编码',
        },
      },
      {
        title: '药品名称',
        dataIndex: 'dpd_drag_name',
        width: 120,
        ellipsis: true,
      },
      {
        title: '规格',
        dataIndex: 'dpd_spec',
        width: 100,
        ellipsis: true,
      },
      {
        title: '原批发价',
        dataIndex: 'dpd_trade_price',
        width: 100,
      },
      {
        title: '新批发价',
        dataIndex: 'dpd_new_trade_price',
        width: 100,
        editable: true,
        inputType: 'number',
        rules: [
          {
            min: 0,
          },
        ],
      },
      {
        title: '原零售价',
        dataIndex: 'dpd_retail_price',
        width: 100,
      },
      {
        title: '新零售价',
        dataIndex: 'dpd_new_retail_price',
        width: 100,
        editable: true,
        inputType: 'number',
        rules: [
          {
            min: 0,
          },
        ],
      },
      {
        title: '厂家',
        dataIndex: 'dpd_factory_name',
        ellipsis: true,
      },
      {
        title: '库存量',
        dataIndex: 'dpd_stoc_num',
        width: 100,
      },
    ],
    relations: {
      dpd_drag_no: [
        {
          name: 'dpd_drag_name',
          column: 'st_drag_name',
        },
        {
          name: 'dpd_spec',
          column: 'st_spec',
        },
        {
          name: 'dpd_trade_price',
          column: 'st_trade_price',
        },
        {
          name: 'dpd_retail_price',
          column: 'st_retail_price',
        },
        {
          name: 'dpd_factory_name',
          column: 'st_factory_name',
        },
        {
          name: 'dpd_factory_no',
          column: 'st_factory_no',
        },
        {
          name: 'dpd_stoc_num',
          column: 'st_stoc_num',
        },
        {
          name: 'dpd_prod_no',
          column: 'st_prod_no',
        },
        {
          name: 'dpd_prod_date',
          column: 'st_prod_date',
        },
        {
          name: 'dpd_indate',
          column: 'st_indate',
        },
        {
          name: 'dpd_stoc',
          column: 'st_stoc',
        },
        {
          name: 'dpd_st_no',
          column: 'st_no',
        },
        {
          name: 'dpd_st_seq',
          column: 'st_sequ',
        },
        {
          name: 'dpd_issuing_unit',
          column: 'st_issuing_unit',
        },
      ],
    },
    newRecord: {
      dpd_purch_cost: '',
      dpd_id: '',
      dpd_issuing_unit: '',
      dpd_spec: '',
      dpd_seq: id,
      dpd_st_no: '',
      dpd_st_seq: '',
      dpd_no: '',
      dpd_trade_price: '',
      dpd_prod_no: '',
      dpd_prod_date: '',
      dpd_stoc_num: '',
      dpd_stoc: '',
      dpd_retail_price: '',
      dpd_flag_name: '',
      dpd_flag: '',
      dpd_factory_no: '',
      dpd_factory_name: '',
      dpd_new_retail_price: '',
      dpd_new_trade_price: '',
      dpd_drag_name: '',
      dpd_drag_no: undefined,
      dpd_indate: '',
      isNew: true,
    },
    rowKey: 'dpd_seq',
    afterSave: (target: any) => {
      const dp_new_retail_price = !isNaN(parseFloat(target.dp_new_retail_price))
        ? parseFloat(target.dp_new_retail_price)
        : 0;
      const dp_retail_price = !isNaN(parseFloat(target.dp_retail_price))
        ? parseFloat(target.dp_retail_price)
        : 0;
      console.log(dp_new_retail_price, dp_retail_price);
      if (dp_new_retail_price > dp_retail_price) {
        target.dp_flag = 'TI+';
        target.dp_flag_name = '调赢';
      } else {
        target.dp_flag = 'TO+';
        target.dp_flag_name = '调亏';
      }
    },
  };

  if (id && !data.success) {
    return null;
  }

  return (
    <DetailForm
      data={data}
      handleFinish={handleFinish}
      submitting={submitting}
      detailFormProps={detailFormData}
      keyName="dpd_id"
      fieldLabels={fieldLabels}
    >
      <Card title="详情" className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.dp_stoc}>
              <Input.Group compact>
                <Form.Item
                  name="dp_stoc"
                  noStyle
                  rules={[{ required: true, message: '请输入仓库' }]}
                >
                  <Input style={{ width: '40%' }} readOnly placeholder="请输入仓库" />
                </Form.Item>
                <Form.Item name="dp_stoc_name" noStyle>
                  <Input style={{ width: '60%' }} readOnly />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={fieldLabels.dp_record_uid}>
              <Input.Group compact>
                <Form.Item name="dp_record_uid" noStyle>
                  <Input style={{ width: '40%' }} readOnly placeholder="经办人" />
                </Form.Item>
                <Form.Item name="dp_record_name" noStyle>
                  <Input style={{ width: '60%' }} readOnly />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={fieldLabels.dp_no} name="dp_no">
              <Input placeholder="批次" readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.dp_confirm_uid}>
              <Input.Group compact>
                <Form.Item name="dp_confirm_uid" noStyle>
                  <Input style={{ width: '40%' }} readOnly placeholder="确认人" />
                </Form.Item>
                <Form.Item name="dp_confirm_name" noStyle>
                  <Input style={{ width: '60%' }} readOnly />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={fieldLabels.dp_confirm_date} name="dp_confirm_date">
              <Input placeholder="调价日期" readOnly />
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={fieldLabels.dp_mark} name="dp_mark">
              <Input placeholder="调价原因" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.dp_status} name="dp_status">
              <Input placeholder="请输入调价状态" readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </DetailForm>
  );
};

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['dragAdjustPrice/submitFormData'],
}))(Edit);
