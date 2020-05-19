export interface DragAdjustPriceItem {
  dp_id: number;
  dp_no: string;
  dp_confirm_name: string;
  dp_confirm_date: string;
  dp_status: string;
}

export interface DragAdjustPriceParams {
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
  dp_no?: string;
  dp_confirm_name?: string;
  dp_confirm_date?: string;
  dp_status?: string;
}
