const premitConfig = [
  {
    module_name: '/platform',
    module_desc: '平台管理',
    module_type: 'menu',
    actions: {
      '/premit': '权限管理',
      '/role': '角色管理',
      '/admin': '成员管理',
    },
  },
  {
    module_name: '/dragAdjustPrice',
    module_desc: '药库系统',
    module_type: 'menu',
    actions: {
      '/list': '药品调价',
      '/edit': '药品调价编辑',
    },
  },
  {
    module_name: 'upload',
    module_desc: '上传图片',
    module_type: 'module',
    actions: {
      uploadImg: '富文本编辑器添加图片',
      uploadImage: '上传图片',
    },
  },
  {
    module_name: 'premit',
    module_desc: '权限管理',
    module_type: 'module',
    actions: {
      index: '列表',
      generate: '生成平台默认权限',
    },
  },
  {
    module_name: 'role',
    module_desc: '角色管理',
    module_type: 'module',
    actions: {
      add: '添加',
      update: '修改',
      index: '列表',
    },
  },
  {
    module_name: 'admin',
    module_desc: '用户管理',
    module_type: 'module',
    actions: {
      add: '添加',
      update: '修改',
      delete: '删除',
      listDetail: '添加/修改视图',
      view: '查看',
      index: '列表',
    },
  },
];

export default premitConfig;
