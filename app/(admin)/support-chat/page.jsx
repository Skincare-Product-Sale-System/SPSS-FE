"use client";
import { useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import { 
  Box, Typography, Paper, Grid, List, ListItem, 
  ListItemText, TextField, Button, Divider, 
  CircularProgress, Badge, Avatar 
} from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import SendIcon from '@mui/icons-material/Send';

export default function SupportChat() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messageEndRef = useRef(null);
  const mainColor = useThemeColors();
  
  // Set up SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`)
      .withAutomaticReconnect()
      .build();
    
    newConnection.start()
      .then(() => {
        console.log("SignalR Connected");
        setIsConnected(true);
        setIsLoading(false);
        
        // Register as support staff
        newConnection.invoke("RegisterAsSupport");
      })
      .catch(err => {
        console.error("SignalR Connection Error: ", err);
        setIsLoading(false);
      });
    
    // Listen for new chat sessions
    newConnection.on("NewChatSession", (userId, username) => {
      setActiveChats(prev => {
        // Check if user already exists
        if (prev.some(chat => chat.userId === userId)) {
          return prev;
        }
        
        // Add new user
        return [...prev, {
          userId,
          username: username || `User ${userId.substring(0, 8)}`,
          unreadCount: 1,
          lastMessage: "Started a new conversation",
          timestamp: new Date()
        }];
      });
    });
    
    // Listen for messages
    newConnection.on("ReceiveSupportMessage", (userId, message, userType) => {
      // Update messages if this chat is selected
      if (selectedChat && selectedChat.userId === userId) {
        setMessages(prev => [...prev, {
          content: message,
          sender: userType === 'user' ? 'user' : 'support'
        }]);
      }
      
      // Update active chats
      setActiveChats(prev => 
        prev.map(chat => 
          chat.userId === userId 
            ? {
                ...chat,
                lastMessage: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
                timestamp: new Date(),
                unreadCount: selectedChat && selectedChat.userId === userId ? 0 : chat.unreadCount + 1
              }
            : chat
        )
      );
    });
    
    setConnection(newConnection);
    
    // Clean up on unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [selectedChat]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
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
    
    // Load message history (assuming you have a way to load them)
    // For now we'll just show a welcome message
    setMessages([
      {
        content: `Bắt đầu cuộc trò chuyện với ${chat.username}`,
        sender: 'system'
      }
    ]);
  };
  
  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !isConnected) return;
    
    // Add message to local state
    setMessages(prev => [...prev, {
      content: newMessage,
      sender: 'support'
    }]);
    
    // Send to server
    connection.invoke("SendSupportMessage", selectedChat.userId, newMessage)
      .catch(err => {
        console.error("Error sending message: ", err);
      });
    
    // Clear input
    setNewMessage('');
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Hỗ trợ khách hàng
      </Typography>
      
      <Paper sx={{ display: 'flex', height: 'calc(100vh - 150px)' }}>
        {/* Sidebar with active chats */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            Cuộc trò chuyện
          </Typography>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : activeChats.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              <Typography>Chưa có cuộc trò chuyện nào</Typography>
            </Box>
          ) : (
            <List>
              {activeChats.map(chat => (
                <ListItem 
                  key={chat.userId}
                  button 
                  selected={selectedChat && selectedChat.userId === chat.userId}
                  onClick={() => handleSelectChat(chat)}
                  sx={{ 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Avatar sx={{ mr: 2, bgcolor: mainColor.primary }}>
                      {chat.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" noWrap>
                          {chat.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {chat.lastMessage}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {chat.unreadCount > 0 && (
                    <Badge 
                      badgeContent={chat.unreadCount} 
                      color="error"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        
        {/* Chat area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              {/* Chat header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: 1, 
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Avatar sx={{ mr: 1, bgcolor: mainColor.primary }}>
                  {selectedChat.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6">
                  {selectedChat.username}
                </Typography>
              </Box>
              
              {/* Messages */}
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                {messages.map((message, index) => {
                  const isSystem = message.sender === 'system';
                  const isUser = message.sender === 'user';
                  
                  return (
                    <Box 
                      key={index}
                      sx={{
                        alignSelf: isSystem 
                          ? 'center' 
                          : isUser ? 'flex-start' : 'flex-end',
                        maxWidth: isSystem ? '100%' : '70%'
                      }}
                    >
                      <Paper 
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: isSystem 
                            ? 'grey.100' 
                            : isUser 
                              ? `${mainColor.primary}20` 
                              : `${mainColor.secondary || '#85715e'}20`,
                          borderRadius: isSystem 
                            ? '16px'
                            : isUser 
                              ? '4px 16px 16px 16px' 
                              : '16px 4px 16px 16px'
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })}
                <div ref={messageEndRef} />
              </Box>
              
              {/* Input area */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Nhập tin nhắn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleSendMessage}
                      sx={{ 
                        height: '56px',
                        bgcolor: mainColor.secondary || '#85715e'
                      }}
                    >
                      Gửi
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <Box 
              sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'text.secondary',
                p: 3
              }}
            >
              <Typography variant="h6" gutterBottom>
                Chọn một cuộc trò chuyện để bắt đầu
              </Typography>
              <Typography variant="body2" align="center">
                Khi khách hàng bắt đầu cuộc trò chuyện mới, họ sẽ xuất hiện trong danh sách bên trái.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
} 