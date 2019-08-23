/**
 * Created by guangqiang on 2017/10/1.
 */

const host = {
  dev: {
    API_URL: 'https://meituan.cangdu.org',
    XIAMI_URL: 'https://api-m.mtime.cn',
    MSITE_URL: 'https://api.douban.com',
    VENILOG_URL: 'https://api.douban.com',
    appId: 'wx3d5c531f5e123456',
    envVersion: 'develop'
  },
  test: {
    API_URL: 'https://meituan.cangdu.org',
    XIAMI_URL: 'http://10.10.21.108:9990',
    MSITE_URL: 'https://api.douban.com',
    VENILOG_URL: 'https://api.douban.com',
    appId: 'wx3d5c531f5e123456',
    envVersion: 'develop'
  },
  qa: {
    API_URL: 'https://meituan.cangdu.org',
    XIAMI_URL: 'http://xiamirun.avosapps.com',
    MSITE_URL: 'https://api.douban.com',
    VENILOG_URL: 'https://api.douban.com'
  },
  pre: {
    API_URL: 'https://meituan.cangdu.org',
    XIAMI_URL: 'https://api-m.mtime.cn',
    MSITE_URL: 'https://api.douban.com',
    VENILOG_URL: 'https://api.douban.com',
    appId: 'wx3d5c531f5e123456',
    envVersion: 'develop'
  },
  prd: {
      API_URL: 'https://digcampus.natapp4.cc/', 
      API_URL: 'http://localhost:7100/',  
  //  API_URL: 'https://goomi.higgses.com:7110/',  
    XIAMI_URL: 'https://api-m.mtime.cn',
    GOODS_URL_PREFIX: 'https://mall-social.oss-cn-beijing.aliyuncs.com/',
    // GOODS_URL_PREFIX: 'http://39.106.34.223:7200/',
    MSITE_URL: 'https://api.douban.com',
    VENILOG_URL: 'https://api.douban.com',
    APP_ID: 'wxcb1df190a9dfc676',
    envVersion: 'trial'
  }
}

let ENV = 'prd'
let currentHost = host[ENV]

const SET_HOST = (env = 'dev') => {
  ENV = env
  currentHost = host[ENV]
}

const API_URL = currentHost.API_URL
const GOODS_URL_PREFIX = currentHost.GOODS_URL_PREFIX
const XIAMI_URL = currentHost.XIAMI_URL
const MSITE_URL = currentHost.MSITE_URL
const APP_ID = currentHost.APP_ID
const VENILOG_URL = currentHost.VENILOG_URL
export { ENV, APP_ID, API_URL, GOODS_URL_PREFIX, MSITE_URL, VENILOG_URL, XIAMI_URL, SET_HOST, currentHost }