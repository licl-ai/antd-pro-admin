import request from '@/utils/request';

export async function fetchDetail(id: string) {
  return request(`/api/dragAdjustPrice/${id}`);
}

export async function fakeSubmitForm(params: any) {
  return request('/api/dragAdjustPrice', {
    method: 'POST',
    data: params,
  });
}
