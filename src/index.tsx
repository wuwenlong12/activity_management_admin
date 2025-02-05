import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App'; // 确保 App.tsx 存在
import { store } from './store/index'; // 导入 Redux store
import 'antd/dist/reset.css'; // 添加 antd 的样式

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* 使用 Provider 包裹 App */}
      <App />
    </Provider>
  </React.StrictMode>
);

// ... 