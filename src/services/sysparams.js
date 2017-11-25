import { request, config } from 'utils'

const { api } = config
const { sysparams } = api

export async function query (params) {
  return request({
    url: sysparams,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: sysparams,
    method: 'delete',
    data: params,
  })
}
