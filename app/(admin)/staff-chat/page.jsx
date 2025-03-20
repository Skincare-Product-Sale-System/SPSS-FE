"use client";
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as signalR from "@microsoft/signalr";
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
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import useAuthStore from "@/context/authStore";
import DeleteIcon from '@mui/icons-material/Delete';

// Import các component sử dụng localStorage với dynamic
const ChatContent = dynamic(() => import('@/components/chat/ChatContent'), { 
  ssr: false, // Không render trên server
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
});

const MESSAGE_TYPES = {
  USER: 'user',      // Tin nhắn từ khách hàng
  STAFF: 'staff',    // Tin nhắn từ nhân viên
  SYSTEM: 'system'   // Tin nhắn hệ thống
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
  const { Id, Role } = useAuthStore();
  const [isBrowser, setIsBrowser] = useState(false);
  
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
        
        // Đăng ký tài khoản nhân viên
        return newConnection.invoke("RegisterAsSupport");
      })
      .then(() => {
        console.log("Registered as support staff");
        
        // Lấy danh sách các cuộc trò chuyện hiện tại từ server
        return newConnection.invoke("GetActiveChats");
      })
      .catch(err => {
        console.error("SignalR Connection Error: ", err);
        setIsLoading(false);
      });
    
    // Xử lý khi nhận được danh sách chat
    newConnection.on("ActiveChats", (chats) => {
      console.log("Received active chats:", chats);
      
      if (Array.isArray(chats) && chats.length > 0) {
        const formattedChats = chats.map(userId => ({
          userId,
          username: `Khách hàng ${userId.substring(0, 6)}`,
          unreadCount: 0,
          lastMessage: "Bắt đầu cuộc trò chuyện",
          timestamp: new Date(),
          avatarColor: getRandomColor()
        }));
        
        setActiveChats(formattedChats);
      } else {
        // Không có chat nào, có thể hiển thị tin nhắn thông báo
        console.log("No active chats found");
      }
    });
    
    // Xử lý khi có session chat mới
    newConnection.on("NewChatSession", (userId, username) => {
      console.log("New chat session detected:", userId, username);
      
      // Thêm vào danh sách chat nếu chưa có
      setActiveChats(prev => {
        // Kiểm tra người dùng đã tồn tại
        if (prev.some(chat => chat.userId === userId)) {
          return prev;
        }
        
        // Thêm người dùng mới
        const newChat = {
          userId,
          username: username || `Khách hàng ${userId.substring(0, 6)}`,
          unreadCount: 1,
          lastMessage: "Đã bắt đầu cuộc trò chuyện mới",
          timestamp: new Date(),
          avatarColor: getRandomColor()
        };
        
        return [newChat, ...prev];
      });
    });
    
    setConnection(newConnection);
    
    // Cleanup khi unmount
    return () => {
      if (newConnection) {
        console.log("Stopping connection");
        newConnection.stop();
      }
    };
  }, [isBrowser]);
  
  // Load lại danh sách tin nhắn khi chọn chat mới
  useEffect(() => {
    if (!isBrowser || !selectedChat) return;
    
      // Reset unread count
      setActiveChats(prev =>
        prev.map(c =>
          c.userId === selectedChat.userId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
      
      // Lấy lịch sử chat thật thay vì dữ liệu mẫu
      loadChatHistory(selectedChat.userId);
  }, [selectedChat, isBrowser]);
  
  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Hàm tạo màu ngẫu nhiên cho avatar
  const getRandomColor = () => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Sửa lại hàm loadChatHistory để lấy lịch sử chat từ localStorage
  const loadChatHistory = (userId) => {
    if (!isBrowser) return;
    
    setIsLoading(true);
    
    // Lấy trực tiếp từ localStorage thay vì gọi server
    const storageKey = `chat_${userId}`;
    const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    console.log("Loaded messages from localStorage:", storedMessages);
    
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
    
    console.log("Formatted messages for display:", formattedMessages);
    
    setMessages(formattedMessages);
    setIsLoading(false);
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

  useEffect(() => {
    if (connection && isConnected) {
      // Đảm bảo đăng ký là nhân viên support
      connection.invoke("RegisterAsSupport")
        .then(() => {
          console.log("Successfully registered as support staff");
          // Debug trạng thái kết nối
          return connection.invoke("GetConnectionStats");
        })
        .catch(err => {
          console.error("Error registering as support:", err);
        });
    }
  }, [connection, isConnected]);

  // Thêm sự kiện lắng nghe ConnectionStats
  useEffect(() => {
    if (connection) {
      connection.on("ConnectionStats", (userCount, supportCount) => {
        console.log(`Connection stats - Users: ${userCount}, Support: ${supportCount}`);
      });
      
      return () => {
        connection.off("ConnectionStats");
      };
    }
  }, [connection]);

  // Thêm xử lý sự kiện ChatHistory
  useEffect(() => {
    if (!connection) return;
    
    connection.on("ChatHistory", (userId, historyMessages) => {
      console.log("Received chat history:", userId, historyMessages);
      
      if (selectedChat && selectedChat.userId === userId) {
        // Chuyển đổi định dạng tin nhắn từ server
        const formattedMessages = historyMessages.map(msg => ({
          content: msg.content,
          sender: msg.userType === 'user' ? 'user' : 'staff', // Chuyển đổi 'support' thành 'staff'
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(formattedMessages);
        setIsLoading(false);
      }
    });
    
    return () => {
      connection.off("ChatHistory");
    };
  }, [connection, selectedChat]);

  // Thêm listener cho sự kiện LoadFromLocalStorage
  useEffect(() => {
    if (!connection) return;
    
    connection.on("LoadFromLocalStorage", (userId) => {
      console.log("Server requested to load from localStorage for user:", userId);
      
      if (selectedChat && selectedChat.userId === userId) {
        // Lấy tin nhắn từ localStorage
        const storageKey = `chat_${userId}`;
        const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        console.log("Loaded messages from localStorage:", storedMessages);
        
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
        
        console.log("Formatted messages for display:", formattedMessages);
        
        setMessages(formattedMessages);
        setIsLoading(false);
      }
    });
    
    return () => {
      connection.off("LoadFromLocalStorage");
    };
  }, [connection, selectedChat]);

  // Xử lý sự kiện ReceiveSupportMessage - chỉ giữ lại ở một chỗ duy nhất
  useEffect(() => {
    if (!connection) return;
    
    console.log("Setting up ReceiveSupportMessage listener with selectedChat:", selectedChat?.userId);
    
    // Hủy event cũ nếu có
    connection.off("ReceiveSupportMessage");
    
    // Đăng ký event mới
    connection.on("ReceiveSupportMessage", (userId, message, userType) => {
      console.log("Support message received:", userId, message, userType);
      
      // Chuẩn hóa userType
      const normalizedUserType = userType === 'user' ? MESSAGE_TYPES.USER : MESSAGE_TYPES.STAFF;
      
      // Lưu tin nhắn vào localStorage với định dạng thống nhất
      const storageKey = `chat_${userId}`;
      const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const newMessageObj = {
        content: message,
        type: normalizedUserType,
        timestamp: new Date().toISOString()
      };
      existingMessages.push(newMessageObj);
      
      localStorage.setItem(storageKey, JSON.stringify(existingMessages));
      
      // Cập nhật danh sách chat với tin nhắn mới nhất
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
            username: `Khách hàng ${userId.substring(0, 6)}`,
            unreadCount: 1,
            lastMessage: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
            timestamp: new Date(),
            avatarColor: getRandomColor()
          });
        }
        
        return updatedChats;
      });
      
      // Cập nhật messages nếu đang xem chat này
      if (selectedChat && selectedChat.userId === userId) {
        console.log("Updating messages for active chat:", userId);
        setMessages(prev => [
          ...prev,
          {
            content: message,
            sender: normalizedUserType,
            timestamp: new Date()
          }
        ]);
      } else {
        console.log("Message received for inactive chat:", userId);
      }
    });
    
    return () => {
      // Hủy event listener khi component unmount hoặc dependency thay đổi
      connection.off("ReceiveSupportMessage");
    };
  }, [connection, selectedChat]);

  // Sửa hàm handleSelectChat để sử dụng cùng định dạng
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
    const storageKey = `chat_${chat.userId}`;
    const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    console.log("Loaded messages from localStorage:", storedMessages);
    
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
    
    console.log("Formatted messages for display:", formattedMessages);
    
    setMessages(formattedMessages);
    setIsLoading(false);
  };
  
  // Sửa hàm gửi tin nhắn để sử dụng định dạng thống nhất
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !isConnected) return;
    
    const messageText = newMessage.trim();
    setNewMessage('');
    
    // LƯU Ý: KHÔNG cập nhật state messages ở đây
    // vì tin nhắn sẽ được cập nhật qua event ReceiveSupportMessage
    
    // Lưu vào localStorage với định dạng thống nhất
    // Điều này tạm thời để bảo đảm tin nhắn được lưu ngay cả khi server chậm
    const storageKey = `chat_${selectedChat.userId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    existingMessages.push({
      content: messageText,
      type: MESSAGE_TYPES.STAFF,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Gửi đến server - tin nhắn sẽ được xử lý từ event ReceiveSupportMessage
    console.log("Sending message to server:", messageText);
    connection.invoke("SendSupportMessage", selectedChat.userId, messageText)
      .catch(err => {
        console.error("Error sending message: ", err);
      });
  };
  
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
    
    alert('Đã xóa tất cả dữ liệu chat. Vui lòng làm mới trang để áp dụng thay đổi.');
  };

  // Thêm hàm xử lý tin nhắn mới
  const handleNewMessage = (userId, message, userType) => {
    // Chuẩn hóa userType
    const normalizedUserType = userType === 'user' ? MESSAGE_TYPES.USER : MESSAGE_TYPES.STAFF;
    
    // Lưu tin nhắn vào localStorage với định dạng thống nhất
    const storageKey = `chat_${userId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newMessageObj = {
      content: message,
      type: normalizedUserType,
      timestamp: new Date().toISOString()
    };
    existingMessages.push(newMessageObj);
    
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Cập nhật UI messages nếu đang xem chat này
    if (selectedChat && selectedChat.userId === userId) {
      console.log("Updating UI for active chat:", userId);
      setMessages(prev => [
        ...prev,
        {
          content: message,
          sender: normalizedUserType,
          timestamp: new Date()
        }
      ]);
    }
    
    // Cập nhật danh sách chat
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
          username: `Khách hàng ${userId.substring(0, 6)}`,
          unreadCount: 1,
          lastMessage: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
          timestamp: new Date(),
          avatarColor: getRandomColor()
        });
      }
      
      return updatedChats;
    });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 100px)' }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 3 }}>
        Hệ thống chat hỗ trợ Skincede
      </Typography>
      
      {/* Client-side rendering cho phần sử dụng localStorage */}
      <ChatContent />
    </Container>
  );
} 