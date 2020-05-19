// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { RoleItem, RoleParams } from './data.d';

let i = 3;
let role: RoleItem[] = [
  {
    role_id: '2',
    role_name: '药库管理员',
    premits: ['4', '5'],
  },
  {
    role_id: '1',
    role_name: '超级管理员',
    premits: [],
  },
];

function getRoleList(req: Request, res: Response) {
  let list = [];
  if (role.length) {
    for (let v of role) {
      list.push({ role_id: v['role_id'], role_name: v['role_name'] });
    }
  }
  res.json(list);
}

function getRole(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as RoleParams;

  let dataSource = role;

  if (params.sorter) {
    const s = params.sorter.split('.');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.role_name) {
    dataSource = dataSource.filter(menuData => menuData.role_name.includes(params.role_name || ''));
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

function postRole(req: Request, res: Response, u: string, b: Request) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, role_id, role_name, premits } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      role = role.filter(item => role_id.indexOf(item.role_id) === -1);
      break;
    case 'post':
      role.unshift({
        role_id: `${i}`,
        role_name,
        premits,
      });
      i++;
      break;
    case 'update':
      role = role.map(item => {
        if (item.role_id === role_id) {
          return { ...item, role_name, premits };
        }
        return item;
      });
      break;
    default:
      break;
  }

  return res.json({ status: 'ok' });
}

export default {
  'GET /api/role': getRole,
  'POST /api/role': postRole,
  'GET /api/role/list': getRoleList,
};
