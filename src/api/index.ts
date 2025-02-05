import axios from "axios";
import { message } from 'antd';


console.log(process.env.EXPO_PUBLIC_API_URL);


// 创建 axios 实例
const http = axios.create({
  baseURL: 'http://localhost:3000/api', // 使用 Expo 的环境变量
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,  // 允许携带 cookies
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    message.error('请求发送失败');
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    console.log('响应拦截器收到的数据:', response.data);
    
    return response.data;
  },
  (error) => {
    console.error('响应拦截器捕获的错误:', error);
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data?.message || "请求失败";

      switch (status) {
        case 400:
          message.error(`请求错误：${errorMessage}`);
          break;
        case 401:
          message.error('登录已过期，请重新登录');
          // window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          if (data?.code === 2) {
            message.error(data.message);
          } else {
            message.error('请求资源未找到');
          }
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        default:
          message.error(`请求失败，状态码：${status}`);
          break;
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }
    console.log(error);

    return Promise.resolve(error.response?.data);
  }
);

export default http;
