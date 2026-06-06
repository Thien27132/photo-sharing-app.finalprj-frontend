import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import { Grid } from '@mui/material';
import TopBar from './components/TopBar';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';
import fetchModel from './lib/fetchModelData';

const App = () => {
  const [topBarContext, setTopBarContext] = useState("Vui lòng chọn một người dùng");
  const navigate = useNavigate();

  // State quản lý trạng thái đăng nhập
  const [currentUser, setCurrentUser] = useState(null);

  // Khi khởi tạo, kiểm tra localStorage xem đã đăng nhập chưa
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Callback khi đăng nhập thành công
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Chuyển sang trang User Details của user vừa đăng nhập
    navigate(`/users/${user._id}`);
  };

  // Callback khi đăng xuất — gọi API backend để xóa session
  const handleLogout = async () => {
    try {
      await fetchModel('/admin/logout', 'POST');
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setTopBarContext("Vui lòng chọn một người dùng");
  };

  // Nếu chưa đăng nhập -> Hiển thị trang LoginRegister
  if (!currentUser) {
    return (
      <div>
        <div className="app-container">
          <TopBar context="Please Login" />
          <div className="cs142-main-topbar-buffer" />
          <LoginRegister onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập -> Hiển thị ứng dụng chính
  return (
    <div>
      <div className="app-container">
        <TopBar 
          context={topBarContext} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <div className="cs142-main-topbar-buffer" />
        
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <UserList />
          </Grid>
          <Grid item sm={9}>
            <Routes>
              <Route path="/users/:userId" element={<UserDetail setContext={setTopBarContext} />} />
              <Route path="/photos/:userId" element={<UserPhotos setContext={setTopBarContext} />} />
              <Route path="/users" element={<div className="typography">Welcome! Click on a user.</div>} />
              <Route path="/" element={<div className="typography">Welcome! Click on a user.</div>} />
            </Routes>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default App;