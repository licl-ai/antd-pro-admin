export interface PremitItem {
  premit_id: string;
  premit_module: string;
  premit_module_desc: string;
  premit_action: string;
  premit_action_desc: string;
  premit_type: string;
}

export interface PremitParams {
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
  premit_id?: string;
  premit_module?: string;
  premit_module_desc?: string;
  premit_action?: string;
  premit_action_desc?: string;
}
