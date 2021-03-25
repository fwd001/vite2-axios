import request from './request'

// 不想使用缓存，在参数里传 _noCache: true 即可
export function fetchList(query) {
  return request({
    url: '/api/getList',
    method: 'get',
    params: query,
  })
}

export function fetchAdd(data) {
  return request({
    url: '/api/add',
    method: 'post',
    data,
  })
}

