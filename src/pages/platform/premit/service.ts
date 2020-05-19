import request from '@/utils/request';
import { PremitParams } from './data.d';

export async function queryPremit(params?: PremitParams) {
  return request('/api/premit', {
    params,
  });
}

export async function generatePremit() {
  return request('/api/premit/generate');
}
export async function removePremit(ids: any[]) {
  return request('/api/premit', {
    method: 'POST',
    data: {
      premit_id: ids,
      method: 'delete',
    },
  });
}

export async function updatePremit(id: any, params: PremitParams) {
  return request('/api/premit', {
    method: 'POST',
    data: {
      premit_id: id,
      ...params,
      method: 'update',
    },
  });
}
