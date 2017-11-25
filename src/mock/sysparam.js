const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let sysparamsListData = Mock.mock({
  'data|80-100': [
    {
      csmc: '@csmc',
      csz: '@csz',
      csms: '@csms',
    },
  ],
})


let database = sysparamsListData.data

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {

  [`GET ${apiPrefix}/sysparams`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/sysparams`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },


  [`POST ${apiPrefix}/sysparam`] (req, res) {
    const newData = req.body
    newData.csmc = Mock.mock('@csmc')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/sysparam/:csmc`] (req, res) {
    const { csmc } = req.params
    const data = queryArray(database, csmc, 'csmc')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/sysparam/:csmc`] (req, res) {
    const { csmc } = req.params
    const data = queryArray(database, csmc, 'csmc')
    if (data) {
      database = database.filter(item => item.csmc !== csmc)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/sysparam/:csmc`] (req, res) {
    const { csmc } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
      if (item.csmc === csmc) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
}
