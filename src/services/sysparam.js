import { request, config } from 'utils'

const { api } = config
const { sysparam } = api

export async function query (params) {
  return request({
    url: sysparam,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: sysparam.replace('/:csmc', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: sysparam,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: sysparam,
    method: 'patch',
    data: params,
  })
}
