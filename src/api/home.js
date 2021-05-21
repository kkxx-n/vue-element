import axios from 'axios'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export function getMenuList () {
  const url = 'http://timemeetyou.com:8889/api/private/v1/menus'

  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}
