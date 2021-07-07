import Axios from 'axios'

export const api = Axios.create({
  baseURL: 'http://localhost:3000',
})

api.defaults.headers.Accept = 'application/json'

api.defaults.headers['Content-Type'] = 'application/json'

api.interceptors.request.use(async (config) => {
  return config
})
