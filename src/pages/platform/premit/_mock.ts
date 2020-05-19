import { Request, Response } from 'express';
import { parse } from 'url';
import sysPremits from './sysPremits';
import { PremitItem, PremitParams } from './data.d';

var premits: PremitItem[] = [];
var i = 1;
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

function generatePremit(req: Request, res: Response) {
  for (let { module_name, module_desc, module_type, actions } of sysPremits) {
    for (let act in actions) {
      let index = -1;
      for (let [key, premit] of premits.entries()) {
        if (premit.premit_action === act) {
          index = key;
          break;
        }
      }
      let item = {
        premit_id: '',
        premit_module: module_name,
        premit_module_desc: module_desc,
        premit_action: act,
        premit_action_desc: actions[act] as string,
        premit_type: module_type,
      };
      if (index !== -1) {
        item.premit_id = premits[index].premit_id;
        premits.splice(index, 1, item);
      } else {
        item.premit_id = `${i}`;
        premits.push(item);
        i++;
      }
    }
  }
  res.json({ status: 'ok' });
}

function getPremit(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as PremitParams;

  let dataSource = premits;

  if (params.sorter) {
    const s = params.sorter.split('.');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.premit_id) {
    dataSource = dataSource.filter(data => data.premit_id.includes(params.premit_id || ''));
  }

  if (params.premit_module) {
    dataSource = dataSource.filter(data => data.premit_module.includes(params.premit_module || ''));
  }
  if (params.premit_module_desc) {
    dataSource = dataSource.filter(data =>
      data.premit_module_desc.includes(params.premit_module_desc || ''),
    );
  }
  if (params.premit_action) {
    dataSource = dataSource.filter(data => data.premit_action.includes(params.premit_action || ''));
  }
  if (params.premit_action_desc) {
    dataSource = dataSource.filter(data =>
      data.premit_action_desc.includes(params.premit_action_desc || ''),
    );
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    data: dataSource,
    total: dataSource.length,
    status: 'ok',
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };

  return res.json(result);
}

function postPremit(req: Request, res: Response, u: string, b: Request) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const {
    method,
    premit_id,
    premit_action,
    premit_module,
    premit_action_desc,
    premit_module_desc,
  } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      premits = premits.filter(item => premit_id.indexOf(item.premit_id) === -1);
      break;
    case 'update':
      // return res.json({
      //   status: 'error',
      //   message: [{ name: 'premit_module', errors: ['aaa', 'ddd'] }],
      // });
      premits = premits.map(item => {
        if (item.premit_id === premit_id) {
          return { ...item, premit_module, premit_module_desc, premit_action, premit_action_desc };
        }
        return item;
      });
      break;
    default:
      break;
  }

  return res.json({ status: 'ok' });
}

function getMenu(req: Request, res: Response) {
  //生成菜单
  let options = {};
  for (let {
    premit_id,
    premit_type,
    premit_module,
    premit_module_desc,
    premit_action_desc,
  } of premits) {
    if (!options[premit_type]) {
      options[premit_type] = {};
    }
    if (!options[premit_type][premit_module]) {
      options[premit_type][premit_module] = {
        key: premit_module,
        title: premit_module_desc,
        checkable: false,
        children: [],
      };
    }
    options[premit_type][premit_module]['children'].push({
      key: premit_id,
      title: premit_action_desc,
    });
  }
  let menuData = [];

  for (let opt in options) {
    let title = opt;
    switch (opt) {
      case 'menu':
        title = '菜单';
        break;
      case 'module':
        title = '功能模块';
        break;
    }
    let option_children = [];
    for (let opt_c in options[opt]) {
      option_children.push(options[opt][opt_c]);
    }
    menuData.push({
      title: title,
      key: opt,
      checkable: false,
      children: option_children,
    });
  }
  return res.json({ status: 'ok', data: menuData });
}

export default {
  'GET /api/premit/generate': generatePremit,
  'GET /api/premit': getPremit,
  'POST /api/premit': postPremit,
  'GET /api/premit/menu': getMenu,
};
