import request from '@/utils/request';
import { AdminParams } from './data.d';

export async function queryAdmin(params?: AdminParams) {
  return request('/api/admin', {
    params,
  });
}

export async function addAdmin(params: AdminParams) {
  return request('/api/admin', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateAdmin(params: any) {
  return request('/api/admin', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function removeAdmin(params: any) {
  return request('/api/admin', {
    method: 'POST',
    data: {
      admin_uid: params,
      method: 'delete',
    },
  });
}
