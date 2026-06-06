import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Typography, 
  Paper, 
  Box, 
  Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData'; // Đảm bảo đường dẫn này đúng với cấu trúc thư mục của bạn

/**
 * Component UserList - Hiển thị danh sách người dùng ở thanh bên (sidebar)
 * Lấy dữ liệu từ API /user/list
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy danh sách người dùng từ Backend
    fetchModel("/user/list")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography sx={{ p: 2 }}>Đang tải danh sách...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
        Danh sách người dùng
      </Typography>
      <Divider />
      
      {/* Sử dụng Paper để tạo hiệu ứng nổi nếu cần */}
      <Paper elevation={0}>
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem 
                button 
                component={Link} 
                to={`/users/${user._id}`}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  }
                }}
              >
                <ListItemText 
                  primary={`${user.first_name} ${user.last_name}`} 
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Button ví dụ nếu bạn muốn dùng thêm tính năng khác */}
      {users.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Không có người dùng nào.
          </Typography>
          <Button variant="outlined" size="small" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default UserList;