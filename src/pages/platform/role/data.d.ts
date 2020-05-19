export interface RoleItem {
  role_id: string;
  role_name: string;
  premits: any[];
}

export interface RoleParams {
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
  role_id?: string;
  role_name?: string;
  premits?: any[];
}
