// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { AdminItem, AdminParams } from './data.d';

let i = 3;
let admins: AdminItem[] = [
  {
    uid: '2',
    username: 'user',
    realname: 'user',
    role_id: '2',
    role_name: '药库管理员',
    password: '',
    repassword: '',
    status: '1',
  },
  {
    uid: '1',
    username: 'admin',
    realname: 'admin',
    role_id: '1',
    role_name: '超级管理员',
    password: '',
    repassword: '',
    status: '1',
  },
];

function getAdmin(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as AdminParams;

  let dataSource = admins;

  if (params.sorter) {
    const s = params.sorter.split('.');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.uid) {
    dataSource = dataSource.filter(data => data.uid.includes(params.uid || ''));
  }

  if (params.realname) {
    dataSource = dataSource.filter(data => data.realname.includes(params.realname || ''));
  }

  if (params.username) {
    dataSource = dataSource.filter(data => data.username.includes(params.username || ''));
  }

  if (params.role_name) {
    dataSource = dataSource.filter(data => data.role_name.includes(params.role_name || ''));
  }

  if (params.status) {
    dataSource = dataSource.filter(data => data.status.includes(params.status || ''));
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

function postAdmin(req: Request, res: Response, u: string, b: Request) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, uid, realname, username, role_id, role_name, status } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      admins = admins.filter(item => uid.indexOf(item.uid) === -1);
      break;
    case 'post':
      admins.unshift({
        uid: `${i}`,
        realname,
        username,
        password: '',
        repassword: '',
        role_id,
        role_name,
        status,
      });
      i++;
      break;
    case 'update':
      admins = admins.map(item => {
        if (item.uid === uid) {
          return {
            ...item,
            username,
            realname,
            uid,
            password: '',
            repassword: '',
            role_id,
            role_name,
            status,
          };
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
  'GET /api/admin': getAdmin,
  'POST /api/admin': postAdmin,
};
