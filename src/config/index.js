// 環境配置封裝
const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  dev: {
    baseApi: "/",
    mockApi: "https://www.fastmock.site/mock/1318bffaa7dbd1b8a1c2d226d17b6edf/api",
  },
  test: {
    baseApi: "/",
    mockApi: "https://www.fastmock.site/mock/1318bffaa7dbd1b8a1c2d226d17b6edf/api",
  },
  prod: {
    baseApi: "/",
    mockApi: "https://www.fastmock.site/mock/1318bffaa7dbd1b8a1c2d226d17b6edf/api",
  },
};

export default {
  env,
  mock: true,
  ...EnvConfig[env],
};
