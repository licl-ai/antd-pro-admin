import request from '@/utils/request';

export async function getUserPerm(): Promise<any> {
  return request('/api/route');
}
