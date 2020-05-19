import { Request, Response } from 'express';
import { parse } from 'url';
import { DragAdjustPriceParams } from '@/pages/dragAdjustPrice/list/data.d';
let yps = [
  {
    st_drag_no: '10000001',
    st_drag_name: '甘草',
    st_spec: '1kg',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '1',
    st_retail_price: '2',
    st_factory_name: '药厂1',
    st_factory_no: '001',
    st_stoc_num: '2145.00',
    st_prod_no: '1',
    st_prod_date: '',
    st_indate: '20201230',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '001',
    st_issuing_unit: '克',
    st_pinyin: 'GC',
  },
  {
    st_drag_no: '10000002',
    st_drag_name: '炉甘石',
    st_spec: '粉',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '2',
    st_retail_price: '3',
    st_factory_name: '药厂2',
    st_factory_no: '002',
    st_stoc_num: '1000.00',
    st_prod_no: '20170712',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '001',
    st_issuing_unit: '克',
    st_pinyin: 'LGS',
  },
  {
    st_drag_no: '10000003',
    st_drag_name: '醋鳖甲',
    st_spec: '统',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '4',
    st_retail_price: '5',
    st_factory_name: '药厂3',
    st_factory_no: '003',
    st_stoc_num: '2140.00',
    st_prod_no: 'b709041-01',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '001',
    st_issuing_unit: '克',
    st_pinyin: 'CBJ',
  },
  {
    st_drag_no: '10000004',
    st_drag_name: '路路通',
    st_spec: '统',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '5',
    st_retail_price: '7',
    st_factory_name: '药厂4',
    st_factory_no: '004',
    st_stoc_num: '3230.00',
    st_prod_no: 'D9050201',
    st_prod_date: '',
    st_indate: '20501231',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '006',
    st_issuing_unit: 'g',
    st_pinyin: 'LLT',
  },
  {
    st_drag_no: '10000005',
    st_drag_name: '艾叶',
    st_spec: '统',
    st_bzdw: 'kg',
    st_bzsl: '1000',
    st_trade_price: '10',
    st_retail_price: '15',
    st_factory_name: '药厂5',
    st_factory_no: '005',
    st_stoc_num: '3490.00',
    st_prod_no: '1',
    st_prod_date: '',
    st_indate: '20201230',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '001',
    st_issuing_unit: 'g',
    st_pinyin: 'AY',
  },
  {
    st_drag_no: '10000006',
    st_drag_name: '水牛角',
    st_spec: '统丝',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '101',
    st_retail_price: '115',
    st_factory_name: '药厂6',
    st_factory_no: '006',
    st_stoc_num: '391.00',
    st_prod_no: '20170712',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '006',
    st_issuing_unit: '克',
    st_pinyin: 'SNJ',
  },
  {
    st_drag_no: '10000007',
    st_drag_name: '千年健',
    st_spec: '统片',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '110',
    st_retail_price: '115',
    st_factory_name: '药厂1',
    st_factory_no: '001',
    st_stoc_num: '830.00',
    st_prod_no: '20170712',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '009',
    st_issuing_unit: '克',
    st_pinyin: 'QNJ',
  },
  {
    st_drag_no: '10000008',
    st_drag_name: '莲子（白）',
    st_spec: '统片',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '20',
    st_retail_price: '25',
    st_factory_name: '药厂2',
    st_factory_no: '002',
    st_stoc_num: '920.00',
    st_prod_no: '20170712',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '012',
    st_issuing_unit: '克',
    st_pinyin: 'LZB',
  },
  {
    st_drag_no: '10000009',
    st_drag_name: '西洋参',
    st_spec: '统片',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '30',
    st_retail_price: '35',
    st_factory_name: '药厂4',
    st_factory_no: '004',
    st_stoc_num: '880.00',
    st_prod_no: '1',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '001',
    st_issuing_unit: '克',
    st_pinyin: 'XYS',
  },
  {
    st_drag_no: '10000010',
    st_drag_name: '重楼 蚤休',
    st_spec: '统片',
    st_bzdw: '千克',
    st_bzsl: '1000',
    st_trade_price: '1110',
    st_retail_price: '1115',
    st_factory_name: '药厂1',
    st_factory_no: '0001',
    st_stoc_num: '1520.00',
    st_prod_no: 'a171101',
    st_prod_date: '',
    st_indate: '20500505',
    st_stoc: 'KF',
    st_no: 'KF202000001',
    st_sequ: '001',
    st_issuing_unit: '克',
    st_pinyin: 'ZLZX',
  },
];
function getYps(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as { term: string };

  const term = params.term.toUpperCase();

  let data = yps;

  if (term) {
    data = data.filter(item => {
      return (
        item.st_drag_no.includes(term) ||
        item.st_drag_name.includes(term) ||
        item.st_pinyin.includes(term)
      );
    });
  }
  return res.json(data);
}
let list = [
  {
    dp_id: '1',
    dp_no: 'AKF2020000001',
    dp_record_uid: '1',
    dp_record_name: '小琳',
    dp_confirm_uid: '2',
    dp_confirm_name: '小明',
    dp_confirm_date: '2020-02-07',
    dp_status: '1.未确认',
    dp_date: '',
    dp_mark: '',
    dp_stoc: 'A',
    dp_stoc_name: '药房1',
  },
];

function getList(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as DragAdjustPriceParams;

  let dataSource = list;

  if (params.sorter) {
    const s = params.sorter.split('.');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.dp_no) {
    dataSource = dataSource.filter(data => data.dp_no.includes(params.dp_no || ''));
  }

  if (params.dp_confirm_name) {
    dataSource = dataSource.filter(data =>
      data.dp_confirm_name.includes(params.dp_confirm_name || ''),
    );
  }

  if (params.dp_confirm_date) {
    dataSource = dataSource.filter(data =>
      data.dp_confirm_date.includes(params.dp_confirm_date || ''),
    );
  }

  if (params.dp_status) {
    dataSource = dataSource.filter(data => data.dp_status.includes(params.dp_status || ''));
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

export default {
  'GET /api/dragAdjustPrice': getList,
  'POST /api/dragAdjustPrice': {
    status: 'ok',
  },
  'GET /api/dragAdjustPrice/:id': {
    dp_id: '1',
    dp_no: 'AKF2020000001',
    dp_record_uid: '1',
    dp_record_name: '小琳',
    dp_confirm_uid: '2',
    dp_confirm_name: '小明',
    dp_confirm_date: '2020-02-07',
    dp_status: '1.未确认',
    dp_date: '',
    dp_mark: '',
    dp_stoc: 'KF',
    dp_stoc_name: '药房1',
    details: [
      {
        dpd_purch_cost: '',
        dpd_id: '1',
        dpd_issuing_unit: '克',
        dpd_spec: '1kg',
        dpd_seq: '001',
        dpd_st_no: 'KF202000001',
        dpd_st_seq: '001',
        dpd_no: '',
        dpd_trade_price: '1',
        dpd_prod_no: '1',
        dpd_prod_date: '',
        dpd_stoc_num: '2145.00',
        dpd_stoc: 'KF',
        dpd_retail_price: '2',
        dpd_flag_name: '调赢',
        dpd_flag: 'TI+',
        dpd_factory_no: '001',
        dpd_factory_name: '药厂1',
        dpd_new_retail_price: 3,
        dpd_new_trade_price: 2,
        dpd_drag_name: '甘草',
        dpd_drag_no: '10000001',
        dpd_indate: '20201230',
      },
    ],
    success: true,
  },
  'GET /api/yps': getYps,
};
