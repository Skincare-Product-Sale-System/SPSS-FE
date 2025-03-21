"use client";
import { useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import { 
  Box, Typography, Paper, Grid, List, ListItem, 
  ListItemText, TextField, Button, CircularProgress, 
  Badge, Avatar, Container, AppBar, Toolbar, IconButton
} from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const MESSAGE_TYPES = {
  USER: 'user',
  STAFF: 'staff',
  SYSTEM: 'system'
};

export default function StaffChat() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messageEndRef = useRef(null);
  const mainColor = useThemeColors();
  const [isBrowser, setIsBrowser] = useState(false);
  const messagesContainerRef = useRef(null);
  
  // Check if code is running in browser
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Set up SignalR connection
  useEffect(() => {
    if (!isBrowser) return;
    
    console.log("Attempting to connect to SignalR hub");
    
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44358/chathub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    
    newConnection.start()
      .then(() => {
        console.log("SignalR Connected");
        setIsConnected(true);
        setIsLoading(false);
        
        // Register as support staff
        return newConnection.invoke("RegisterAsSupport");
      })
      .then(() => {
        console.log("Registered as support staff");
        
        // Get current active chats
        return newConnection.invoke("GetActiveChats");
      })
      .catch(err => {
        console.error("SignalR Connection Error: ", err);
        setIsLoading(false);
      });
    
    // Handle active chats list
    newConnection.on("ActiveChats", (chats) => {
      console.log("Received active chats:", chats);
      
      if (Array.isArray(chats) && chats.length > 0) {
        const formattedChats = chats.map(userId => ({
          userId,
          username: `Customer ${userId.substring(0, 6)}`,
          unreadCount: 0,
          lastMessage: "Started a conversation",
          timestamp: new Date(),
          avatarColor: getRandomColor()
        }));
        
        setActiveChats(formattedChats);
      }
    });
    
    // Handle new chat session
    newConnection.on("NewChatSession", (userId, username) => {
      console.log("New chat session detected:", userId, username);
      
      setActiveChats(prev => {
        if (prev.some(chat => chat.userId === userId)) {
          return prev;
        }
        
        const newChat = {
          userId,
          username: username || `Customer ${userId.substring(0, 6)}`,
          unreadCount: 1,
          lastMessage: "Started a new conversation",
          timestamp: new Date(),
          avatarColor: getRandomColor()
        };
        
        return [newChat, ...prev];
      });
    });
    
    setConnection(newConnection);
    
    // Cleanup on unmount
    return () => {
      if (newConnection) {
        console.log("Stopping connection");
        newConnection.stop();
      }
    };
  }, [isBrowser]);
  
  // Reset unread count when selecting chat
  useEffect(() => {
    if (!isBrowser || !selectedChat) return;
    
    setActiveChats(prev =>
      prev.map(c =>
        c.userId === selectedChat.userId
          ? { ...c, unreadCount: 0 }
          : c
      )
    );
    
    loadChatHistory(selectedChat.userId);
  }, [selectedChat, isBrowser]);
  
  // Thêm useEffect mới để tránh cuộn toàn bộ trang
  useEffect(() => {
    // Chỉ cuộn trong container tin nhắn thay vì toàn bộ trang
    if (messagesContainerRef.current && messages.length > 0) {
      // Kéo container tin nhắn xuống cuối cùng
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Thêm useEffect mới để cuộn container tin nhắn khi chọn chat mới
  useEffect(() => {
    if (messagesContainerRef.current && !isLoading && selectedChat) {
      // Delay một chút để đảm bảo DOM đã cập nhật
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [selectedChat, isLoading]);
  
  // Generate random avatar color
  const getRandomColor = () => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Load chat history from localStorage
  const loadChatHistory = (userId) => {
    if (!isBrowser) return;
    
    setIsLoading(true);
    
    const storageKey = `chat_${userId}`;
    const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    console.log("Loaded messages from localStorage:", storedMessages);
    
    if (storedMessages.length === 0) {
      setMessages([]);
      setIsLoading(false);
      return;
    }
    
    // Convert message format if needed
    const formattedMessages = storedMessages.map(msg => {
      // Check for old format with userType
      if (msg.userType !== undefined) {
        return {
          content: msg.content,
          sender: msg.userType === 'user' ? MESSAGE_TYPES.USER : MESSAGE_TYPES.STAFF,
          timestamp: new Date(msg.timestamp || new Date())
        };
      }
      
      // Check for new format with type
      if (msg.type !== undefined) {
        return {
          content: msg.content,
          sender: msg.type,
          timestamp: new Date(msg.timestamp || new Date())
        };
      }
      
      // If neither format is present, assume based on sender
      return {
        content: msg.content,
        sender: msg.sender || MESSAGE_TYPES.USER,
        timestamp: new Date(msg.timestamp || new Date())
      };
    });
    
    setMessages(formattedMessages);
    setIsLoading(false);
  };
  
  // Filter chats by search term
  const filteredChats = searchTerm.trim() === ''
    ? activeChats
    : activeChats.filter(chat => 
        chat.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Sort chats by timestamp
  const sortedChats = [...filteredChats].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  // Format time
  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return messageDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit'
    });
  };
  
  // Handle ReceiveSupportMessage event
  useEffect(() => {
    if (!connection) return;
    
    connection.on("ReceiveSupportMessage", (userId, message, userType) => {
      console.log("Support message received:", userId, message, userType);
      
      const normalizedUserType = userType === 'user' ? MESSAGE_TYPES.USER : MESSAGE_TYPES.STAFF;
      
      // Save to localStorage
      const storageKey = `chat_${userId}`;
      const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const newMessageObj = {
        content: message,
        type: normalizedUserType,
        timestamp: new Date().toISOString()
      };
      existingMessages.push(newMessageObj);
      
      localStorage.setItem(storageKey, JSON.stringify(existingMessages));
      
      // Update chat list
      setActiveChats(prev => {
        const updatedChats = [...prev];
        const chatIndex = updatedChats.findIndex(chat => chat.userId === userId);
        
        if (chatIndex !== -1) {
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            lastMessage: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
            timestamp: new Date(),
            unreadCount: selectedChat && selectedChat.userId === userId ? 0 : updatedChats[chatIndex].unreadCount + 1
          };
        } else {
          updatedChats.unshift({
            userId,
            username: `Customer ${userId.substring(0, 6)}`,
            unreadCount: 1,
            lastMessage: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
            timestamp: new Date(),
            avatarColor: getRandomColor()
          });
        }
        
        return updatedChats;
      });
      
      // Update messages if viewing this chat
      if (selectedChat && selectedChat.userId === userId) {
        setMessages(prev => [
          ...prev,
          {
            content: message,
            sender: normalizedUserType,
            timestamp: new Date()
          }
        ]);
      }
    });
    
    return () => {
      connection.off("ReceiveSupportMessage");
    };
  }, [connection, selectedChat]);
  
  // Handle chat selection
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
    
    // Load messages from localStorage
    loadChatHistory(chat.userId);
  };
  
  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !isConnected) return;
    
    const messageText = newMessage.trim();
    setNewMessage('');
    
    // Save to localStorage
    const storageKey = `chat_${selectedChat.userId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    existingMessages.push({
      content: messageText,
      type: MESSAGE_TYPES.STAFF,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Send to server
    console.log("Sending message to server:", messageText);
    connection.invoke("SendSupportMessage", selectedChat.userId, messageText)
      .catch(err => {
        console.error("Error sending message: ", err);
      });
  };
  
  // Clear all chat data
  const clearChatData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('chat_')) {
        localStorage.removeItem(key);
      }
    });
    
    setActiveChats([]);
    setSelectedChat(null);
    setMessages([]);
    
    alert('All chat data has been cleared. Please refresh the page to apply changes.');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 1, mb: 4, minHeight: 'calc(100vh - 200px)' }}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)', bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* Chat list */}
        <Paper sx={{ 
          width: 320, 
          borderRadius: 0, 
          display: { xs: selectedChat ? 'none' : 'block', md: 'block' },
          borderRight: '1px solid #e0e0e0'
        }}>
          <Box sx={{ p: 2, bgcolor: mainColor.primary, color: 'white' }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Phiên Chat
            </Typography>
            
            <Box sx={{ mt: 1.5, position: 'relative' }}>
              <TextField
                placeholder="Tìm kiếm..."
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                      borderWidth: 1,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: <SearchIcon sx={{ color: 'grey.500' }} />
                }}
              />
            </Box>
            
            <Button 
              variant="contained" 
              color="error" 
              size="small" 
              startIcon={<DeleteIcon />} 
              onClick={clearChatData}
              sx={{ mt: 2, borderRadius: '8px', textTransform: 'none', fontWeight: 500 }}
            >
              Xóa Tất Cả Dữ Liệu
            </Button>
          </Box>
          
          <List sx={{ overflow: 'auto', height: 'calc(100% - 136px)', px: 0 }}>
            {sortedChats.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      Không có cuộc hội thoại
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Đang chờ khách hàng...
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              sortedChats.map(chat => (
                <ListItem
                  key={chat.userId}
                  button
                  onClick={() => handleSelectChat(chat)}
                  selected={selectedChat?.userId === chat.userId}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    bgcolor: selectedChat?.userId === chat.userId ? `${mainColor.primary}10` : 'transparent',
                    '&:hover': {
                      bgcolor: `${mainColor.primary}20`,
                    },
                    py: 1.5
                  }}
                >
                  <Badge
                    badgeContent={chat.unreadCount}
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    <Avatar sx={{ bgcolor: chat.avatarColor, width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                  </Badge>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle1" 
                        noWrap 
                        sx={{ 
                          fontWeight: chat.unreadCount > 0 ? 700 : 500,
                          fontSize: '0.95rem',
                          mb: 0.5
                        }}
                      >
                        {chat.username}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        noWrap 
                        sx={{ 
                          color: chat.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                          fontSize: '0.82rem'
                        }}
                      >
                        {chat.lastMessage}
                      </Typography>
                    }
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      ml: 1
                    }}
                  >
                    {formatTime(chat.timestamp)}
                  </Typography>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
        
        {/* Chat area */}
        {selectedChat ? (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#f9f9f9',
            position: 'relative'
          }}>
            <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
              <Toolbar variant="dense" sx={{ minHeight: '64px' }}>
                <IconButton 
                  edge="start" 
                  sx={{ mr: 1, display: { xs: 'inline-flex', md: 'none' } }}
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ mr: 2, bgcolor: selectedChat.avatarColor, width: 40, height: 40 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="500">
                    {selectedChat.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Trực tuyến
                  </Typography>
                </Box>
              </Toolbar>
            </AppBar>
            
            <Box 
              ref={messagesContainerRef}
              sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: '#f5f5f5'
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  opacity: 0.7
                }}>
                  <MessageIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3 }} />
                  <Typography variant="body1" color="text.secondary" mt={2}>
                    Chưa có tin nhắn
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Bắt đầu cuộc trò chuyện
                  </Typography>
                </Box>
              ) : (
                messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === MESSAGE_TYPES.STAFF ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    {msg.sender === MESSAGE_TYPES.USER && (
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1,
                          bgcolor: selectedChat.avatarColor,
                          alignSelf: 'flex-end',
                          mb: 0.5
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                    
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        maxWidth: '75%',
                        borderRadius: msg.sender === MESSAGE_TYPES.STAFF 
                          ? '16px 4px 16px 16px' 
                          : '4px 16px 16px 16px',
                        bgcolor: msg.sender === MESSAGE_TYPES.STAFF 
                          ? mainColor.primary 
                          : 'white',
                        color: msg.sender === MESSAGE_TYPES.STAFF 
                          ? 'white' 
                          : 'text.primary',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-word',
                          lineHeight: 1.5
                        }}
                      >
                        {msg.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: msg.sender === MESSAGE_TYPES.STAFF ? 0.8 : 0.6, 
                          mt: 0.5, 
                          display: 'block', 
                          textAlign: 'right',
                          fontSize: '0.7rem'
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                ))
              )}
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <TextField
                    fullWidth
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    multiline
                    maxRows={4}
                    disabled={!isConnected}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ 
                      height: '100%', 
                      minWidth: '50px',
                      borderRadius: '12px'
                    }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !isConnected}
                  >
                    <SendIcon />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center', 
            alignItems: 'center',
            flexDirection: 'column',
            p: 4,
            bgcolor: '#f9f9f9'
          }}>
            <MessageIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" textAlign="center">
              Chọn một cuộc trò chuyện để bắt đầu
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
} 