import { router } from 'umi';
import { getUserPerm } from '@/services/menu';
let authRoutes: any[] = [];
let firstRoute: string;

function filterRoute(routes: any[], authRoute: any[]) {
  const arr: any[] = [];
  authRoute.forEach(item => {
    routes.forEach(route => {
      if (route.path === item.path) {
        let obj = {};
        if (route.routes && item.routes) {
          obj = route;
          obj.routes = filterRoute(route.routes, item.routes);
          arr.push(obj);
        } else {
          obj = route;
          arr.push(obj);
        }
      }
    });
  });
  return arr;
}
export function patchRoutes(routes) {
  const resultRoute = filterRoute(routes[1].routes, authRoutes);
  if (firstRoute) {
    resultRoute.splice(0, 0, firstRoute);
  }
  routes[1].routes = resultRoute;
  window.g_routes = routes;
}
export async function render(oldRender) {
  const authRoutesResult = await getUserPerm();
  window.oldRender = () => {
    if (authRoutesResult) {
      const { status, data, path } = authRoutesResult;
      if (status === 'ok') {
        authRoutes = data;
        firstRoute = path;
      } else {
        router.push('/user/login');
      }
    } else {
      oldRender();
    }
    oldRender();
  };
  if (window.oldRender) {
    window.oldRender();
  }
}
