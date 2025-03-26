"use client";
import { useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import { 
  Box, Typography, Paper, Grid, List, ListItem, 
  ListItemText, TextField, Button, CircularProgress, 
  Badge, Avatar, Container, AppBar, Toolbar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, 
  InputAdornment, Card, CardMedia, CardContent, CardActions,
  Rating
} from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StarIcon from '@mui/icons-material/Star';
import request from "@/utils/axios";
import Image from "next/image";
import { formatPrice } from "@/utils/priceFormatter";

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
  
  // Product selector states
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Check if code is running in browser
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Set up SignalR connection
  useEffect(() => {
    if (!isBrowser) return;
    
    console.log("Attempting to connect to SignalR hub");
    
    // Load all existing chat sessions from localStorage first
    loadExistingChats();
    
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/chathub`, {
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
        // Get existing chats we already loaded from localStorage
        const existingChatIds = activeChats.map(chat => chat.userId);
        
        // Process new chats from server
        const formattedChats = chats.map(userId => {
          // Check if we already processed this chat
          const existingChat = activeChats.find(chat => chat.userId === userId);
          if (existingChat) {
            return existingChat;
          }
          
          // Get last message from localStorage for each chat
          const storageKey = `chat_${userId}`;
          const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const lastMsg = storedMessages.length > 0 
            ? storedMessages[storedMessages.length - 1] 
            : null;
          
          return {
            userId,
            username: `Customer ${userId.substring(0, 6)}`,
            unreadCount: 0,
            lastMessage: lastMsg 
              ? lastMsg.content.substring(0, 30) + (lastMsg.content.length > 30 ? '...' : '') 
              : "Started a conversation",
            timestamp: lastMsg ? new Date(lastMsg.timestamp) : new Date(),
            avatarColor: getRandomColor()
          };
        });
        
        // Merge existing chats with new chats
        const mergedChats = [...activeChats];
        formattedChats.forEach(chat => {
          if (!existingChatIds.includes(chat.userId)) {
            mergedChats.push(chat);
          }
        });
        
        // Sort by most recent
        mergedChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setActiveChats(mergedChats);
        
        // Auto-select first chat if none is selected
        if (mergedChats.length > 0 && !selectedChat) {
          setSelectedChat(mergedChats[0]);
          loadChatHistory(mergedChats[0].userId);
        }
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
  }, [selectedChat, isLoading, messages.length]);
  
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
    
    // Update chat in the list to show the latest message
    if (storedMessages.length > 0) {
      const lastMsg = storedMessages[storedMessages.length - 1];
      
      setActiveChats(prev => 
        prev.map(chat => 
          chat.userId === userId ? {
            ...chat,
            lastMessage: lastMsg.content.substring(0, 30) + (lastMsg.content.length > 30 ? '...' : ''),
            timestamp: new Date(lastMsg.timestamp || new Date())
          } : chat
        )
      );
    }
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
      
      // Kiểm tra xem tin nhắn tương tự đã tồn tại chưa để tránh duplicate
      const isDuplicate = existingMessages.some(msg => 
        msg.content === message && 
        new Date(msg.timestamp).getTime() > new Date().getTime() - 5000 // Trong vòng 5 giây
      );
      
      if (!isDuplicate) {
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
      } else {
        console.log("Duplicate message detected, ignoring...");
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
    
    // Tạo message object mới
    const newMessageObj = {
      content: messageText,
      type: MESSAGE_TYPES.STAFF,
      timestamp: new Date().toISOString()
    };
    
    existingMessages.push(newMessageObj);
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Cập nhật UI với tin nhắn mới ngay lập tức
    setMessages(prev => [
      ...prev,
      {
        content: messageText,
        sender: MESSAGE_TYPES.STAFF,
        timestamp: new Date()
      }
    ]);
    
    // Cập nhật active chats để hiển thị tin nhắn mới nhất
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
    
    // Send to server
    console.log("Sending message to server:", messageText);
    connection.invoke("SendSupportMessage", selectedChat.userId, messageText)
      .catch(err => {
        console.error("Error sending message: ", err);
      });
  };

  // Load all existing chats from localStorage
  const loadExistingChats = () => {
    if (!isBrowser) return;
    
    // Look for chat keys in localStorage (format: chat_userId)
    const chatKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('chat_')) {
        const userId = key.replace('chat_', '');
        chatKeys.push(userId);
      }
    }
    
    console.log("Found existing chat keys:", chatKeys);
    
    if (chatKeys.length > 0) {
      const existingChats = chatKeys.map(userId => {
        const storageKey = `chat_${userId}`;
        const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const lastMsg = storedMessages.length > 0 
          ? storedMessages[storedMessages.length - 1] 
          : null;
        
        return {
          userId,
          username: `Customer ${userId.substring(0, 6)}`,
          unreadCount: 0,
          lastMessage: lastMsg 
            ? lastMsg.content.substring(0, 30) + (lastMsg.content.length > 30 ? '...' : '') 
            : "Started a conversation",
          timestamp: lastMsg ? new Date(lastMsg.timestamp) : new Date(),
          avatarColor: getRandomColor()
        };
      });
      
      // Sort by timestamp (newest first)
      existingChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setActiveChats(existingChats);
      
      // Auto-select first chat
      if (existingChats.length > 0) {
        setSelectedChat(existingChats[0]);
        loadChatHistory(existingChats[0].userId);
      }
    }
  };

  // Fetch products for product selector
  const fetchProducts = async (searchQuery = '') => {
    if (!isBrowser) return;
    
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      params.append('pageNumber', '1');
      params.append('pageSize', '20');
      
      if (searchQuery) {
        params.append('searchTerm', searchQuery);
      }
      
      const { data } = await request.get(`/products?${params.toString()}`);
      setProducts(data.data?.items || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };
  
  // Handle product search
  const handleProductSearch = (e) => {
    const value = e.target.value;
    setProductSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchProducts(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Handle product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };
  
  // Open product selector dialog
  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
    fetchProducts();
  };
  
  // Close product selector dialog
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setProductSearch('');
    setSelectedProduct(null);
  };
  
  // Send product as a message
  const handleSendProduct = () => {
    if (!selectedProduct || !selectedChat || !isConnected) return;
    
    // Format product data as a rich message
    const productMessage = JSON.stringify({
      type: 'product',
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.salePrice || selectedProduct.price,
      image: selectedProduct.thumbnail,
      url: `/product-detail/${selectedProduct.id}`,
      rating: selectedProduct.rating || 4.5,
      soldCount: selectedProduct.soldCount || 0
    });
    
    // Save to localStorage
    const storageKey = `chat_${selectedChat.userId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Kiểm tra xem sản phẩm này đã được gửi gần đây chưa
    const isDuplicate = existingMessages.some(msg => {
      try {
        // Nếu là tin nhắn sản phẩm, kiểm tra productId
        const content = JSON.parse(msg.content);
        return content.type === 'product' && 
               content.productId === selectedProduct.id &&
               new Date(msg.timestamp).getTime() > new Date().getTime() - 10000; // Trong vòng 10 giây
      } catch (e) {
        return false;
      }
    });
    
    if (isDuplicate) {
      console.log("Duplicate product message detected, ignoring...");
      // Thông báo hoặc chỉ đóng dialog
      handleCloseProductDialog();
      return;
    }
    
    existingMessages.push({
      content: productMessage,
      type: MESSAGE_TYPES.STAFF,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Add to messages state
    setMessages(prev => [
      ...prev,
      {
        content: productMessage,
        sender: MESSAGE_TYPES.STAFF,
        timestamp: new Date()
      }
    ]);
    
    // Send to server
    connection.invoke("SendSupportMessage", selectedChat.userId, productMessage)
      .catch(err => {
        console.error("Error sending product message: ", err);
      });
    
    // Close dialog
    handleCloseProductDialog();
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
              Phiên chat
            </Typography>
            
            <Box sx={{ mt: 1.5, position: 'relative' }}>
              <TextField
                placeholder="Search..."
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
          </Box>
          
          <List sx={{ overflow: 'auto', height: 'calc(100% - 136px)', px: 0 }}>
            {sortedChats.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      No conversations
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Waiting for customers...
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
                    Online
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
                    No messages yet
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Start a conversation
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
                    
                    {/* Kiểm tra và xử lý message content */}
                    {(() => {
                      try {
                        // Nếu là JSON, thì parse và kiểm tra
                        const parsedContent = JSON.parse(msg.content);
                        if (parsedContent.type === 'product') {
                          // Nếu là sản phẩm, hiển thị card sản phẩm
                          return (
                            <Box 
                              sx={{
                                maxWidth: '300px',
                                mb: 1,
                                marginLeft: msg.sender === MESSAGE_TYPES.USER ? 0 : 'auto', 
                                marginRight: msg.sender === MESSAGE_TYPES.STAFF ? 0 : 'auto',
                              }}
                            >
                              <a 
                                href={parsedContent.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', display: 'block' }}
                              >
                                <Card sx={{ 
                                  width: '100%',
                                  border: '1px solid',
                                  borderColor: mainColor.primary + '40',
                                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                                  backgroundColor: 'white',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  transition: 'transform 0.2s, box-shadow 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderColor: mainColor.primary
                                  }
                                }}>
                                  <Box sx={{ display: 'flex', p: 1 }}>
                                    <Box sx={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                      <CardMedia
                                        component="img"
                                        image={parsedContent.image || '/images/placeholder.jpg'}
                                        alt={parsedContent.name}
                                        sx={{ 
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover', 
                                          borderRadius: '6px'
                                        }}
                                      />
                                    </Box>
                                    <Box sx={{ ml: 1.5, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 500, 
                                          mb: 0.5,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          color: 'rgba(0,0,0,0.87)',
                                          fontSize: '0.875rem',
                                          lineHeight: 1.2
                                        }}
                                      >
                                        {parsedContent.name}
                                      </Typography>
                                      
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            fontWeight: 600, 
                                            color: 'text.secondary',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center'
                                          }}
                                        >
                                          {parsedContent.rating || '4.5'}/5
                                          <Rating
                                            value={parsedContent.rating || 4.5}
                                            precision={0.5}
                                            readOnly
                                            size="small"
                                            sx={{ ml: 0.5, fontSize: '0.75rem' }}
                                          />
                                        </Typography>
                                        <Box 
                                          component="span" 
                                          sx={{ 
                                            mx: 0.5, 
                                            fontSize: '0.75rem', 
                                            color: 'text.disabled' 
                                          }}
                                        >
                                          |
                                        </Box>
                                        <Typography 
                                          variant="caption" 
                                          sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                                        >
                                          Đã bán: {parsedContent.soldCount || 0}
                                        </Typography>
                                      </Box>
                                      
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: 600, 
                                          color: mainColor.primary,
                                          fontSize: '0.875rem'
                                        }}
                                      >
                                        {formatPrice(parsedContent.price, '₫')}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </a>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  opacity: 0.7, 
                                  mt: 0.5, 
                                  display: 'block', 
                                  textAlign: msg.sender === MESSAGE_TYPES.STAFF ? 'right' : 'left',
                                  fontSize: '0.7rem',
                                  px: 0.5,
                                  color: 'text.secondary'
                                }}
                              >
                                {formatTime(msg.timestamp)}
                              </Typography>
                            </Box>
                          );
                        } else {
                          // Nếu là JSON nhưng không phải product, hiển thị như text thường
                          return (
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
                          );
                        }
                      } catch (e) {
                        // Nếu không phải JSON, hiển thị text thường
                        return (
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
                        );
                      }
                    })()}
                    
                    {msg.sender === MESSAGE_TYPES.STAFF && (
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          ml: 1,
                          bgcolor: mainColor.primary,
                          alignSelf: 'flex-end',
                          mb: 0.5
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                  </Box>
                ))
              )}
            </Box>
            
            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
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
                  <Box sx={{ display: 'flex', gap: 1, height: '100%' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ height: '100%', minWidth: '50px', borderRadius: '12px' }}
                      onClick={handleOpenProductDialog}
                      disabled={!isConnected}
                    >
                      <ShoppingBagIcon />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ height: '100%', minWidth: '50px', borderRadius: '12px' }}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
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
              Select a conversation to start
            </Typography>
          </Box>
        )}
      </Box>

      {/* Product selector dialog */}
      <Dialog 
        open={openProductDialog} 
        onClose={handleCloseProductDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select a Product</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={productSearch}
            onChange={handleProductSearch}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          {loadingProducts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ mt: 2 }}>
              {products.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>
                  No products found
                </Typography>
              ) : (
                products.map((product) => (
                  <Paper
                    key={product.id}
                    elevation={0}
                    onClick={() => handleSelectProduct(product)}
                    sx={{
                      mb: 2,
                      border: '1px solid',
                      borderColor: selectedProduct?.id === product.id 
                        ? mainColor.primary 
                        : 'divider',
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: selectedProduct?.id === product.id 
                          ? mainColor.primary 
                          : mainColor.primary + '80',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', p: 1 }}>
                      <Box sx={{ width: 80, height: 80, position: 'relative', flexShrink: 0 }}>
                        <img
                          src={product.thumbnail || '/images/placeholder.jpg'}
                          alt={product.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                      </Box>
                      <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {product.categoryName || 'Skincare'}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: mainColor.primary, fontWeight: 600 }}>
                          {formatPrice(product.salePrice || product.price, '₫')}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog}>Cancel</Button>
          <Button 
            onClick={handleSendProduct} 
            variant="contained" 
            disabled={!selectedProduct}
            color="primary"
          >
            Send Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 