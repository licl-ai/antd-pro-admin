import request from '@/utils/request';
import { RoleParams } from './data.d';

export async function queryRole(params?: RoleParams) {
  return request('/api/role', {
    params,
  });
}

export async function queryPremits() {
  return request('/api/premit/menu');
}

export async function addRole(params: RoleParams) {
  return request('/api/role', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRole(params: any) {
  return request('/api/role', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function removeRole(params: any) {
  return request('/api/role', {
    method: 'POST',
    data: {
      role_id: params,
      method: 'delete',
    },
  });
}
