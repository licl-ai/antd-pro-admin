import request from '@/utils/request';
import { DragAdjustPriceParams } from './data.d';

export async function queryData(params?: DragAdjustPriceParams) {
  return request('/api/dragAdjustPrice', {
    params,
  });
}

export async function removeData(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}
