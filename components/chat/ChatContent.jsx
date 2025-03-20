"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Paper, Grid, List, ListItem, 
  ListItemText, TextField, Button, Divider, 
  CircularProgress, Badge, Avatar, Container,
  AppBar, Toolbar, IconButton, Card, CardContent
} from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const MESSAGE_TYPES = {
  USER: 'user',
  STAFF: 'staff',
  SYSTEM: 'system'
};

export default function ChatContent() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messageEndRef = useRef(null);
  const mainColor = useThemeColors();

  // Khởi tạo dữ liệu từ localStorage khi component mount
  useEffect(() => {
    loadChatsFromLocalStorage();
  }, []);

  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format thời gian
  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const messageDate = new Date(date);
    
    // Nếu cùng ngày, hiển thị giờ:phút
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // Nếu khác ngày, hiển thị ngày/tháng
    return messageDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Hàm tạo màu ngẫu nhiên cho avatar
  const getRandomColor = () => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Lấy danh sách chat từ localStorage
  const loadChatsFromLocalStorage = () => {
    // Lấy tất cả các keys trong localStorage
    const chatKeys = [];
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        chatKeys.push(key);
      }
    }
    
    // Tạo danh sách chat từ các keys
    const chats = chatKeys.map(key => {
      const userId = key.replace('chat_', '');
      const messages = JSON.parse(localStorage.getItem(key) || '[]');
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      
      return {
        userId,
        username: `Khách hàng ${userId.substring(0, 6)}`,
        unreadCount: 0,
        lastMessage: lastMessage ? lastMessage.content.substring(0, 30) + (lastMessage.content.length > 30 ? '...' : '') : "Bắt đầu cuộc trò chuyện",
        timestamp: lastMessage ? new Date(lastMessage.timestamp) : new Date(),
        avatarColor: getRandomColor()
      };
    });
    
    setActiveChats(chats);
  };

  // Lấy tin nhắn của một chat
  const loadChatHistory = (userId) => {
    setIsLoading(true);
    
    // Lấy trực tiếp từ localStorage
    const storageKey = `chat_${userId}`;
    const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (storedMessages.length === 0) {
      setMessages([]);
      setIsLoading(false);
      return;
    }
    
    // Chuyển đổi định dạng nếu cần thiết
    const formattedMessages = storedMessages.map(msg => {
      // Kiểm tra định dạng cũ với userType
      if (msg.userType !== undefined) {
        return {
          content: msg.content,
          sender: msg.userType === 'user' ? MESSAGE_TYPES.USER : MESSAGE_TYPES.STAFF,
          timestamp: new Date(msg.timestamp || new Date())
        };
      }
      
      // Kiểm tra định dạng mới với type
      if (msg.type !== undefined) {
        return {
          content: msg.content,
          sender: msg.type,
          timestamp: new Date(msg.timestamp || new Date())
        };
      }
      
      // Nếu không có cả userType và type, giả định dựa trên sender
      return {
        content: msg.content,
        sender: msg.sender || MESSAGE_TYPES.USER,
        timestamp: new Date(msg.timestamp || new Date())
      };
    });
    
    setMessages(formattedMessages);
    setIsLoading(false);
  };

  // Xử lý khi chọn một chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    
    // Reset unread count
    setActiveChats(prev =>
      prev.map(c =>
        c.userId === chat.userId
          ? { ...c, unreadCount: 0 }
          : c
      )
    );
    
    // Lấy tin nhắn từ localStorage
    loadChatHistory(chat.userId);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const messageText = newMessage.trim();
    setNewMessage('');
    
    // Lưu vào localStorage với định dạng thống nhất
    const storageKey = `chat_${selectedChat.userId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newMessageObj = {
      content: messageText,
      type: MESSAGE_TYPES.STAFF,
      timestamp: new Date().toISOString()
    };
    existingMessages.push(newMessageObj);
    
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Cập nhật UI
    setMessages(prev => [
      ...prev,
      {
        content: messageText,
        sender: MESSAGE_TYPES.STAFF,
        timestamp: new Date()
      }
    ]);
    
    // Cập nhật danh sách chat
    setActiveChats(prev => {
      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex(chat => chat.userId === selectedChat.userId);
      
      if (chatIndex !== -1) {
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: messageText.substring(0, 30) + (messageText.length > 30 ? '...' : ''),
          timestamp: new Date()
        };
      }
      
      return updatedChats;
    });
  };

  // Xóa dữ liệu chat
  const clearChatData = () => {
    // Xóa tất cả dữ liệu chat trong localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('chat_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reset state
    setActiveChats([]);
    setSelectedChat(null);
    setMessages([]);
    
    alert('Đã xóa tất cả dữ liệu chat.');
  };

  // Lọc danh sách chat theo từ khóa tìm kiếm
  const filteredChats = searchTerm.trim() === ''
    ? activeChats
    : activeChats.filter(chat => 
        chat.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Sắp xếp chat theo thời gian, mới nhất lên đầu
  const sortedChats = [...filteredChats].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Paper sx={{ 
      overflow: 'hidden', 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      height: 'calc(100vh - 180px)',
      minHeight: '600px'
    }}>
      {/* Sidebar danh sách chat */}
      <Box sx={{ 
        width: 320, 
        borderRight: '1px solid',
        borderColor: 'divider',
        display: { xs: selectedChat ? 'none' : 'block', md: 'block' },
        flexDirection: 'column'
      }}>
        {/* Header sidebar */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="medium">
            Danh sách cuộc trò chuyện
          </Typography>
          
          {/* Ô tìm kiếm */}
          <Box sx={{ mt: 2, position: 'relative' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
            />
          </Box>
        </Box>
        
        {/* Danh sách chat */}
        <Box sx={{ overflowY: 'auto', height: 'calc(100% - 110px)' }}>
          {isLoading && !activeChats.length ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={40} sx={{ color: mainColor.primary }} />
            </Box>
          ) : !sortedChats.length ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <MessageIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
              <Typography>Chưa có cuộc trò chuyện nào</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {sortedChats.map((chat) => (
                <ListItem
                  key={chat.userId}
                  button
                  divider
                  selected={selectedChat && selectedChat.userId === chat.userId}
                  onClick={() => handleSelectChat(chat)}
                  sx={{
                    position: 'relative',
                    py: 1.5,
                    px: 2,
                    backgroundColor: selectedChat && selectedChat.userId === chat.userId
                      ? `${mainColor.primary}10`
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: `${mainColor.primary}05`,
                    }
                  }}
                >
                  <Avatar
                    sx={{ 
                      mr: 2, 
                      bgcolor: chat.avatarColor || mainColor.primary
                    }}
                  >
                    {chat.username.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Box sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap fontWeight="medium">
                        {chat.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(chat.timestamp)}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        maxWidth: '170px',
                        fontWeight: chat.unreadCount > 0 ? 'medium' : 'normal'
                      }}
                    >
                      {chat.lastMessage}
                    </Typography>
                  </Box>
                  
                  {chat.unreadCount > 0 && (
                    <Badge
                      badgeContent={chat.unreadCount}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12
                      }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
      
      {/* Khung chat chính */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        display: { xs: !selectedChat ? 'none' : 'flex', md: 'flex' } 
      }}>
        {selectedChat ? (
          <>
            {/* Header khung chat */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center'
            }}>
              <IconButton 
                sx={{ mr: 1, display: { xs: 'inline-flex', md: 'none' } }}
                onClick={() => setSelectedChat(null)}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <Avatar
                sx={{ 
                  mr: 2, 
                  bgcolor: selectedChat.avatarColor || mainColor.primary
                }}
              >
                {selectedChat.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {selectedChat.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Online
                </Typography>
              </Box>
              
              {/* Thêm nút Debug & Clear */}
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="primary"
                  onClick={() => {
                    // Tải lại tin nhắn
                    loadChatHistory(selectedChat.userId);
                  }}
                >
                  Refresh Chat
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="error"
                  onClick={() => {
                    // Xóa tin nhắn trong localStorage của chat này
                    const storageKey = `chat_${selectedChat.userId}`;
                    localStorage.removeItem(storageKey);
                    setMessages([]);
                    loadChatsFromLocalStorage();
                  }}
                >
                  Clear Chat
                </Button>
              </Box>
            </Box>
            
            {/* Khu vực tin nhắn */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2,
              backgroundColor: '#f5f8fa'
            }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress size={40} sx={{ color: mainColor.primary }} />
                </Box>
              ) : !messages.length ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  flexDirection: 'column',
                  color: 'text.secondary'
                }}>
                  <MessageIcon sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6">Chưa có tin nhắn</Typography>
                  <Typography variant="body2">
                    Bắt đầu cuộc trò chuyện với {selectedChat.username}
                  </Typography>
                </Box>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'staff' ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      {message.sender !== 'staff' && (
                        <Avatar
                          sx={{ 
                            mr: 1, 
                            width: 36, 
                            height: 36,
                            mt: 0.5,
                            bgcolor: selectedChat.avatarColor || mainColor.primary
                          }}
                        >
                          {selectedChat.username.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                      
                      <Box
                        sx={{
                          maxWidth: '70%',
                          position: 'relative'
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: message.sender === 'staff' 
                              ? '20px 4px 20px 20px' 
                              : '4px 20px 20px 20px',
                            backgroundColor: message.sender === 'staff' 
                              ? mainColor.primary 
                              : 'white',
                            color: message.sender === 'staff' ? 'white' : 'text.primary',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            position: 'relative'
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
                          >
                            {message.content}
                          </Typography>
                        </Paper>
                        
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            textAlign: message.sender === 'staff' ? 'right' : 'left',
                            color: 'text.secondary',
                            ml: message.sender === 'staff' ? 0 : 5
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </Typography>
                      </Box>
                      
                      {message.sender === 'staff' && (
                        <Avatar
                          sx={{ 
                            ml: 1, 
                            width: 36, 
                            height: 36,
                            mt: 0.5,
                            bgcolor: mainColor.secondary || '#85715e'
                          }}
                        >
                          S
                        </Avatar>
                      )}
                    </Box>
                  ))}
                </>
              )}
              <div ref={messageEndRef} />
            </Box>
            
            {/* Khung nhập tin nhắn */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <TextField
                    fullWidth
                    placeholder="Nhập tin nhắn..."
                    multiline
                    maxRows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    endIcon={<SendIcon />}
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Gửi
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          // Hiển thị khi chưa chọn chat nào (chỉ hiển thị trên màn hình lớn)
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#f5f8fa',
            flexDirection: 'column',
            p: 4
          }}>
            <Card 
              elevation={0}
              sx={{ 
                py: 6,
                px: 4,
                textAlign: 'center',
                maxWidth: 400,
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 4
              }}
            >
              <CardContent>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: mainColor.primary
                  }}
                >
                  <MessageIcon sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h5" gutterBottom fontWeight="medium" color={mainColor.primary}>
                  Chào mừng đến với hệ thống chat
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  Hãy chọn một cuộc trò chuyện từ danh sách để bắt đầu tư vấn cho khách hàng.
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Mọi thắc mắc về hệ thống, vui lòng liên hệ với quản trị viên.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Paper>
  );
} 