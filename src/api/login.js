import axios from 'axios'

export function getLoginStatus (data) {
  const url = 'http://timemeetyou.com:8889/api/private/v1/login'

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}
