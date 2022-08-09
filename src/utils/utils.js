/**
 * 工具函數封裝
 */
export const formateDate = (date, rule) => {
  let fmt = rule || "yyyy-MM-dd hh:mm:ss";
  if (/(y+)/.test(fmt)) {
    const y = /(y+)/.exec(fmt);
    fmt = fmt.replace(y[0], date.getFullYear());
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const y = new RegExp(`(${k})`).exec(fmt);
      const val = o[k] + "";
      fmt = fmt.replace(
        y[0],
        // 處理 2021-2-20 前面補0的狀況 ->2021-02-20
        y[0].length == 1 ? val : ("00" + val).substring(val.length)
      );
    }
  }
  return fmt;
};

export function generateRoute(menuList) {
  let routes = [];
  const deepList = (list) => {
    while (list.length) {
      let item = list.pop();
      if (item.action) {
        routes.push({
          name: item.component,
          path: item.path,
          meta: {
            title: item.menuName,
          },
          component: item.component,
        });
      }
      if (item.children && !item.action) {
        deepList(item.children);
      }
    }
  };
  deepList(menuList);
  return routes;
}
