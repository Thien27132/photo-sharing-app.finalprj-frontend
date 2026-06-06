import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper, Divider, Box } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserDetail({ setContext }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Reset user về null để hiện loading khi đổi ID người dùng
    setUser(null); 

    fetchModel(`/user/${userId}`)
      .then((response) => {
        setUser(response.data);
        // Cập nhật tên lên Header thông qua setContext
        if (setContext) {
          setContext(`Chi tiết của ${response.data.first_name} ${response.data.last_name}`);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết người dùng:", err);
      });
  }, [userId, setContext]);

  if (!user) {
    return (
      <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
        Đang tải thông tin người dùng...
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1"><strong> Vị trí:</strong> {user.location}</Typography>
        <Typography variant="subtitle1"><strong> Nghề nghiệp:</strong> {user.occupation}</Typography>
      </Box>

      <Typography variant="body1" sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
        <strong>Mô tả:</strong> {user.description}
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/photos/${user._id}`}
        >
          Xem bộ sưu tập ảnh
        </Button>
      </Box>
    </Paper>
  );
}

export default UserDetail;
