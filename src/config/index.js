// 環境配置封裝
const env = import.meta.env.MODE || "prod";
const NginxUrl='http://localhost:8100/';
const EnvConfig = {
  dev: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  test: {
    baseApi: "/",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
  production: {
    baseApi: "/api",
    mockApi:
      "https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api",
  },
};

export default {
  NginxUrl,
  env,
  mock: false,
  namespace: "manager",
  ...EnvConfig[env]
};
