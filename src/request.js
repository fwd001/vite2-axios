import axios from 'axios'
import CacheItem from './cacheItem'


// 缓存的请求列表
/**
 * {
 *  url: '',
 *  params: {},
 *  expireDate: 0, - 过期时间
 *  response: {}, 响应结果
 *  weights: 0, 权重
 *  cancel: ()=> {} // 取消方法
 * }
 */
let reqList = []

// 缓存时长
const timeInterval = 5000

/**
 * 查看请求缓存
 * @param {array} reqList - 请求缓存列表
 * @param {string} config - 当前请求参数实例
 */
const getRequestCache = function (reqList, config) {
  const ci = CacheItem.getCache(reqList, config) // 获取缓存实例
  console.log(reqList);
  console.log(ci);
  if (ci) { // 有缓存数据
    const cur = new Date().getTime();
    if (cur < ci.expireDate) { // 判断缓存是否过期:没有过期
      ci.setWeights()
      return Promise.resolve(ci.response)
    } else {
      if(ci.expireDate === 0) ci.c() //如果在请求中 取消上一次请求
      // 删除数组中的缓存
      const index = CacheItem.getIndex(reqList, config) 
      reqList.splice(index, 1)
    }
  }
  // console.log(reqList);
  CacheItem.push(reqList, new CacheItem(config))
}

/**
 * 设置缓存数据
 * @param {array} reqList 全部请求列表
 * @param {string} response 相应实例
 */
const setRequestData = function (reqList, response) {
  const index = CacheItem.getIndex(reqList, response.config)
  const ci = reqList[index]
  // console.log('ci',ci);
  ci.setExpireDate(timeInterval) // 设置过期时间
  ci.setResponse(response.data)// 设置缓存数据
}

// 设置取消函数
const setCancel = (reqList, config, c) => {
  const ci = CacheItem.getCache(reqList, config) // 获取缓存实例
  ci.setCancel(c)
}

// 服务端地址
const request = axios.create({
  baseURL: '', // url = base url + request url
  withCredentials: true, // 跨域时是否带上cookie
  timeout: 20000, // 请求超时时间配置(ms)
  headers: {
    'Content-Type': 'application/json;charset=UTF-8' // json数据格式传输
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log('config:::', config);

    /**
     * 为每一次请求生成一个cancleToken
     */
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    // 设置请求的取消方法
    setCancel(reqList, config, source.cancel)

    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 服务端响应成功时，搞些事情
    if (res.code !== 200) { // 请求报错
      const msg = res.msg || '系统错误'
      throw res
    } else { // 请求成功
      setRequestData(reqList, response)
      return res
    }
  },
  error => Promise.reject(error)
)

// 缓存请求方法
const cacheRequest = (params) => {
  const _noCache = params._noCache
  if (!_noCache) {
    const response = getRequestCache(reqList, params)
    if (response) return response // 有缓存返回缓存
  }
  delete params._noCache
  return request(params)
}

export default cacheRequest

// 不想使用缓存，在参数里传 _noCache: true 即可
