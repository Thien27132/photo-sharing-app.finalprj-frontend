import React, { useState, useEffect } from 'react';
import {
  Typography, Card, CardHeader, CardMedia, CardContent,
  Divider, List, ListItem, ListItemText, Box,
  TextField, Button, CircularProgress, Alert
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserPhotos({ setContext }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  // State quản lý ô nhập comment cho từng ảnh (key = photo._id)
  const [commentTexts, setCommentTexts] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentError, setCommentError] = useState({});

  useEffect(() => {
    fetchModel(`/photosOfUser/${userId}`)
      .then((response) => {
        setPhotos(response.data);
        // Cập nhật ngữ cảnh cho Header
        if (setContext && response.data.length > 0) {
          setContext(`Ảnh của người dùng ID: ${userId}`);
        }
      })
      .catch((err) => console.error("Lỗi lấy ảnh:", err));
  }, [userId, setContext]);

  // Xử lý thay đổi nội dung comment
  const handleCommentChange = (photoId, value) => {
    setCommentTexts((prev) => ({ ...prev, [photoId]: value }));
    // Xóa lỗi khi user bắt đầu gõ
    if (commentError[photoId]) {
      setCommentError((prev) => ({ ...prev, [photoId]: '' }));
    }
  };

  // Xử lý gửi comment
  const handleCommentSubmit = async (photoId) => {
    const text = (commentTexts[photoId] || '').trim();

    // Validate phía client
    if (!text) {
      setCommentError((prev) => ({
        ...prev,
        [photoId]: 'Nội dung bình luận không được để trống',
      }));
      return;
    }

    // Bật loading
    setCommentLoading((prev) => ({ ...prev, [photoId]: true }));
    setCommentError((prev) => ({ ...prev, [photoId]: '' }));

    try {
      // Gọi API thêm comment — POST /commentsOfPhoto/:photo_id
      const response = await fetchModel(`/commentsOfPhoto/${photoId}`, 'POST', {
        comment: text,
      });

      // Cập nhật UI ngay lập tức — append comment mới vào state hiện tại
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [...(photo.comments || []), response.data],
            };
          }
          return photo;
        })
      );

      // Xóa ô nhập
      setCommentTexts((prev) => ({ ...prev, [photoId]: '' }));
    } catch (err) {
      setCommentError((prev) => ({
        ...prev,
        [photoId]: err.message || 'Lỗi khi gửi bình luận',
      }));
    } finally {
      setCommentLoading((prev) => ({ ...prev, [photoId]: false }));
    }
  };

  // Xử lý nhấn Enter để gửi
  const handleKeyPress = (e, photoId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(photoId);
    }
  };

  if (photos.length === 0) {
    return <Typography sx={{ p: 2 }}>Người dùng này chưa có ảnh nào hoặc đang tải...</Typography>;
  }

  return (
    <Box>
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 4, maxWidth: '100%' }}>
          <CardHeader title={`Đăng lúc: ${new Date(photo.date_time).toLocaleString()}`} />
          
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`} // Đường dẫn tới thư mục ảnh của Backend
            alt="User post"
            sx={{ objectFit: 'contain', maxHeight: 500, bgcolor: '#000' }}
          />

          <CardContent>
            <Typography variant="h6">Bình luận</Typography>
            <Divider />
            <List>
              {photo.comments ? photo.comments.map((comment) => (
                <ListItem key={comment._id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Link to={`/users/${comment.user._id}`} style={{ fontWeight: 'bold', textDecoration: 'none', color: '#1976d2' }}>
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary" sx={{ display: 'block', my: 0.5 }}>
                          {comment.comment}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.date_time).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              )) : <Typography variant="body2">Chưa có bình luận nào.</Typography>}
            </List>

            {/* ===== FORM THÊM BÌNH LUẬN ===== */}
            <Divider sx={{ my: 2 }} />

            {commentError[photo._id] && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {commentError[photo._id]}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Viết bình luận..."
                value={commentTexts[photo._id] || ''}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, photo._id)}
                disabled={commentLoading[photo._id]}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommentSubmit(photo._id)}
                disabled={commentLoading[photo._id] || !(commentTexts[photo._id] || '').trim()}
                sx={{ minWidth: 'auto', px: 2, height: 40 }}
              >
                {commentLoading[photo._id] ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Gửi"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;