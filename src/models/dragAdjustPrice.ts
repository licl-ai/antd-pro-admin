import { Effect } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/drag';

export interface dragAdjustPriceModelType {
  namespace: 'dragAdjustPrice';
  state: {};
  effects: {
    submitFormData: Effect;
  };
}
const dragAdjustPriceModel: dragAdjustPriceModelType = {
  namespace: 'dragAdjustPrice',

  state: {},

  effects: {
    *submitFormData({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },
};

export default dragAdjustPriceModel;
