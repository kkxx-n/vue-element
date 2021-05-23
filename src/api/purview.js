import axios from 'axios'

export function getPowerList (type) {
  const url = `http://timemeetyou.com:8889/api/private/v1/rights/${type}`

  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}
