export interface AdminItem {
  uid: string;
  username: string;
  realname: string;
  role_id: string;
  role_name: string;
  status: string;
  password: string;
  repassword: string;
}

export interface AdminParams {
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
  uid?: string;
  username?: string;
  realname?: string;
  role_name?: string;
  status?: string;
  password?: string;
  repassword?: string;
}
