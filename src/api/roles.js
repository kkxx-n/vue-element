import axios from 'axios'

export function getRolesList () {
  const url = 'http://timemeetyou.com:8889/api/private/v1/roles'

  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function deleteRolePurview (data) {
  const url = `http://timemeetyou.com:8889/api/private/v1/roles/${data.roleId}/rights/${data.rightId}`

  return axios.delete(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getAllRightList (type) {
  const url = `http://timemeetyou.com:8889/api/private/v1/rights/${type}`

  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function setAllRightList (roleId, rids) {
  const url = `http://timemeetyou.com:8889/api/private/v1/roles/${roleId}/rights`

  return axios.post(url, { rids }).then(res => {
    return Promise.resolve(res.data)
  })
}
