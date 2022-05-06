import axios from "axios"
import { baseURL,requestTimeout,contentType} from '@/config'
import qs from 'qs'
/**
 * @description axios初始化
 */
 const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})



const requestConf=(config) => {
    let token = localStorage.getItem('Authorization');
  // 设置请求头
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    if (token) config.headers['Authorization'] = token;
  if (
    config.data &&
    config.headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8'
  )
  config.data = qs.stringify(config.data)
  return config;
}
instance.interceptors.request.use(requestConf,(error) => {
    console.log(error);
    return Promise.reject();
  }
);
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

export default instance;
