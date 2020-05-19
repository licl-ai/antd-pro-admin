import { Request, Response } from 'express';
import sysPremits from '@/pages/platform/premit/sysPremits';
import { PremitItem } from '@/pages/platform/premit/data.d';

//全部权限
function getPremits() {
  let premits: PremitItem[] = [];
  let i = 1;
  for (let { module_name, module_desc, module_type, actions } of sysPremits) {
    for (let act in actions) {
      premits.push({
        premit_id: `${i}`,
        premit_module: module_name,
        premit_module_desc: module_desc,
        premit_action: act,
        premit_action_desc: actions[act] as string,
        premit_type: module_type,
      });
      i++;
    }
  }
  return premits;
}
//用户数据
function getUser(token: string) {
  let users = {
    admin_token: {
      premits: [],
      isAdmin: true,
    },
    user_token: {
      premits: ['4', '5'],
      isAdmin: false,
    },
  };
  return users[token];
}

interface Route {
  path: string;
  routes: Route[];
  component?: string;
}

interface MenuData {
  path: string;
  routes: Route[];
}

interface Path {
  path: string;
  exact: boolean;
  redirect: string;
}

interface Menu {
  status: 'ok' | 'error';
  path?: Path;
  data: MenuData[];
}

function getRoute(req: Request, res: Response) {
  const token = req.get('token');
  let data: Menu = { status: 'error', data: [] };
  if (!token) {
    return res.json(data);
  }
  let user = getUser(token);
  if (!user) {
    return res.json(data);
  }
  const { premits, isAdmin } = user;
  data.status = 'ok';
  if (!isAdmin && !premits.length) {
    return res.json(data);
  }
  const premitsTotal = getPremits();
  const menuPremits = premitsTotal.filter(item => item.premit_type === 'menu');
  if (!menuPremits.length) {
    return res.json(data);
  }
  let firstPath: any = false;
  let menus = {};
  for (let item of menuPremits) {
    if (isAdmin || premits.includes(item.premit_id)) {
      if (!menus[item['premit_module']]) {
        menus[item['premit_module']] = [];
      }
      let path: string = item['premit_module'] + item['premit_action'];
      menus[item['premit_module']].push({ path });
      if (!firstPath) {
        firstPath = path;
      }
    }
  }
  if (!Object.keys(menus).length) {
    return res.json(data);
  }
  let menuData: any[] = [];
  for (let path in menus) {
    let routes = menus[path];
    routes.push({ component: './404' });
    menuData.push({ path, routes });
  }
  menuData.push({ component: './404' });
  data.data = [{ path: '/', routes: menuData }];
  data.path = { path: '/', exact: true, redirect: firstPath };
  return res.json(data);
}
export default {
  'GET /api/route': getRoute,
};
