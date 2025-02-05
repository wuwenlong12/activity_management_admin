import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/MainLayout';
import Login from './pages/Login';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/userSlice';
import { auth } from './api/auth';
import { RootState } from './store';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return !isAuthenticated ? element : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await auth();
        console.log(response);
        
        if (response.data && response.code === 0) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/*" element={<PrivateRoute element={<Layout />} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 