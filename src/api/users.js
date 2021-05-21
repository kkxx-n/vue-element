import axios from 'axios'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export function getUsersList (data) {
  const url = 'http://timemeetyou.com:8889/api/private/v1/users'

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function changeUserState (data) {
  const url = `http://timemeetyou.com:8889/api/private/v1/users/${data.id}/state/${data.mg_state}`

  return axios.put(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function addUser (data) {
  const url = 'http://timemeetyou.com:8889/api/private/v1/users'

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function queryUser (id) {
  const url = `http://timemeetyou.com:8889/api/private/v1/users/${id}`

  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

export function editUser (data) {
  const url = `http://timemeetyou.com:8889/api/private/v1/users/${data.id}`

  return axios.put(url, {
    params: {
      email: data.email,
      mobile: data.mobile
    }
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function removeUser (id) {
  const url = `http://timemeetyou.com:8889/api/private/v1/users/${id}`

  return axios.delete(url).then(res => {
    return Promise.resolve(res.data)
  })
}
