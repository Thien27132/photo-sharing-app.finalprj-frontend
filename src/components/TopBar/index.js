import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const topbarStyles = `
/* Inlined TopBar styles */
.cs142-topbar-appBar, .topbar-appBar { height: 60px; display: flex; justify-content: center; }
`;

const TopBar = ({ context, currentUser, onLogout }) => {
  // Upload feature removed — TopBar now only shows greeting and logout.

  return (
    <>
      <style>{topbarStyles}</style>
      <AppBar className="cs142-topbar-appBar" position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" color="inherit">
            Phi Thiện Anh
          </Typography>
          
          <Typography variant="h5" color="inherit">
            {context}
          </Typography>

          {/* Hiển thị các nút khi đã đăng nhập */}
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Typography variant="body1" color="inherit" sx={{ fontWeight: 500 }}>
                Hi {currentUser.first_name || currentUser.login_name}
              </Typography>

              {/* Nút Đăng xuất */}
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={onLogout}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Đăng xuất
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {/* Upload UI removed */}
    </>
  );
};

export default TopBar;