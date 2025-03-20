"use client";
import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useThemeColors } from "@/context/ThemeContext";
import { CircularProgress, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import useAuthStore from "@/context/authStore";
import ForumIcon from '@mui/icons-material/Forum';
import * as LocalStorage from '@/utils/localStorage'; // Import utility

const MESSAGE_TYPES = {
  USER: 'user',      // Tin nhắn từ khách hàng
  STAFF: 'staff',    // Tin nhắn từ nhân viên
  SYSTEM: 'system'   // Tin nhắn hệ thống
};

export default function RealTimeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "system",
      content: "Kết nối với nhân viên hỗ trợ của Skincede...",
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState(null);
  const messageEndRef = useRef(null);
  const mainColor = useThemeColors();
  const { Id } = useAuthStore();
  const [userId, setUserId] = useState(null);

  // Khởi tạo userId sử dụng utility
  useEffect(() => {
    if (Id) {
      setUserId(Id);
      return;
    }
    
    // Lấy từ localStorage nếu có
    let savedId = LocalStorage.getItem('chatUserId');
    if (savedId) {
      setUserId(savedId);
      return;
    }
    
    // Tạo mới nếu không có
    const newId = `user-${Math.random().toString(36).substring(2, 9)}`;
    LocalStorage.setItem('chatUserId', newId);
    setUserId(newId);
  }, [Id]);

  // Set up SignalR connection
  useEffect(() => {
    if (!isOpen) return;
    
    // Chỉ tạo kết nối mới nếu chưa có hoặc kết nối đã đóng
    if (!connection) {
      console.log("Creating new connection");
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:44358/chathub`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Debug)
        .build();
        
        // Start the connection
        newConnection.start()
          .then(() => {
            console.log("SignalR Connected");
            setIsConnected(true);
            setMessages(prev => [
              ...prev,
              {
                sender: "system",
                content: "Đã kết nối với hỗ trợ viên. Bạn có thể bắt đầu nhắn tin.",
              }
            ]);
            
            // Lưu kết nối mới
            setConnection(newConnection);
          })
          .catch(err => {
            console.error("SignalR Connection Error: ", err);
            setMessages(prev => [
              ...prev,
              {
                sender: "system",
                content: "Không thể kết nối với hỗ trợ viên. Vui lòng thử lại sau.",
              }
            ]);
          });
    }
    
    // Cleanup khi component unmount
    return () => {
      if (connection) {
        console.log("Stopping connection");
        connection.stop();
      }
    };
  }, [isOpen]);  // Remove connection from dependencies

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Đảm bảo đăng ký userId khi kết nối thành công
  useEffect(() => {
    if (connection && isConnected) {
      // Đảm bảo userId không rỗng trước khi đăng ký
      if (userId) {
        console.log("Registering user with ID:", userId);
        connection.invoke("RegisterUser", userId)
          .then(() => {
            console.log("User registered successfully");
          })
          .catch(err => {
            console.error("Error registering user:", err);
          });
      } else {
        console.error("Cannot register user - userId is empty");
      }
    }
  }, [connection, isConnected, userId]);

  // Lưu tin nhắn vào localStorage
  useEffect(() => {
    if (!connection) return;
    
    connection.on("ReceiveMessage", (message, userType) => {
      console.log("Message received:", message, userType);
      
      // Chuẩn hóa userType - đảm bảo nhất quán
      const normalizedUserType = userType === 'support' ? MESSAGE_TYPES.STAFF : MESSAGE_TYPES.USER;
      const uiSender = normalizedUserType === MESSAGE_TYPES.STAFF ? "support" : "me";
      
      // Lưu vào localStorage với định dạng thống nhất
      const storageKey = `chat_${userId}`;
      let existingMessages = [];
      
      try {
        existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      } catch (err) {
        console.error("Error parsing messages from localStorage:", err);
      }
      
      existingMessages.push({
        content: message,
        type: normalizedUserType,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(storageKey, JSON.stringify(existingMessages));
      
      // Cập nhật UI với định dạng nhất quán
      setMessages(prev => [
        ...prev,
        {
          sender: uiSender,
          content: message,
          timestamp: new Date()
        }
      ]);
    });
    
    return () => {
      connection.off("ReceiveMessage");
    };
  }, [connection, userId]);

  // Sửa hàm sendMessage
  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected || !connection) return;
    
    const messageText = newMessage.trim();
    setNewMessage("");
    
    // Cập nhật UI ngay lập tức (vẫn sử dụng 'me' cho UI)
    setMessages(prev => [
      ...prev,
      {
        sender: "me",
        content: messageText,
        timestamp: new Date()
      }
    ]);
    
    // Lưu vào localStorage với định dạng thống nhất
    const storageKey = `chat_${userId}`;
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    existingMessages.push({
      content: messageText,
      type: MESSAGE_TYPES.USER,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(storageKey, JSON.stringify(existingMessages));
    
    // Gửi đến server
    connection.invoke("SendMessage", userId, messageText, "user")
      .catch(err => {
        console.error("Error sending message:", err);
      });
  };

  // Khi mở chat, load tin nhắn từ localStorage
  useEffect(() => {
    if (isOpen) {
      // Load tin nhắn từ localStorage
      const storageKey = `chat_${userId}`;
      const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (storedMessages.length > 0) {
        // Chuyển đổi sang định dạng messages UI
        const formattedMessages = storedMessages.map(msg => {
          // Kiểm tra định dạng cũ với userType
          if (msg.userType !== undefined) {
            return {
              content: msg.content,
              sender: msg.userType === 'user' ? "me" : "support",
              timestamp: new Date(msg.timestamp || new Date())
            };
          }
          
          // Kiểm tra định dạng mới với type
          if (msg.type !== undefined) {
            return {
              content: msg.content,
              sender: msg.type === MESSAGE_TYPES.USER ? "me" : "support",
              timestamp: new Date(msg.timestamp || new Date())
            };
          }
          
          // Nếu không xác định được, dựa vào sender
          return {
            content: msg.content,
            sender: msg.sender || "me",
            timestamp: new Date(msg.timestamp || new Date())
          };
        });
        
        setMessages(formattedMessages);
      }
    }
  }, [isOpen, userId]);

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex bg-white justify-center p-3 rounded-full shadow-lg bottom-5 fixed hover:opacity-90 items-center left-5 transition-opacity z-40"
        style={{ 
          backgroundColor: mainColor.secondary || '#85715e',
          width: '56px',
          height: '56px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ForumIcon 
          sx={{ 
            color: 'white', 
            fontSize: 24,
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
          }} 
        />
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="flex flex-col bg-white border rounded-lg shadow-lg w-[400px] bottom-20 fixed left-5 z-50"
             style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {/* Header */}
          <div className="flex border-b justify-between p-3 items-center" 
               style={{ 
                 backgroundColor: mainColor.secondary || '#85715e', 
                 color: 'white', 
                 borderRadius: '8px 8px 0 0' 
               }}
          >
            <div className="flex gap-2 items-center">
              <ForumIcon sx={{ 
                fontSize: 22,
                filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))'
              }} />
              <span className="font-medium">Chat với nhân viên Skincede</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gray-200 transition-colors"
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✖
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto" style={{ minHeight: '300px', maxHeight: 'calc(100vh - 280px)' }}>
            {messages.map((message, index) => (
              <MessageItem key={index} data={message} mainColor={mainColor} />
            ))}
            
            {isLoading && (
              <div className="flex items-start mt-4">
                <div className="flex bg-gray-100 rounded-lg items-center max-w-[80%] px-4 py-2">
                  <div className="flex animate-pulse space-x-2">
                    <div className="bg-gray-400 h-2 rounded-full w-2"></div>
                    <div className="bg-gray-400 h-2 rounded-full w-2"></div>
                    <div className="bg-gray-400 h-2 rounded-full w-2"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messageEndRef}></div>
          </div>
          
          {/* Input area */}
          <div className="border-t p-3">
            <div className="flex">
              <textarea
                className="flex-1 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 px-3 py-2 resize-none"
                style={{ 
                  height: '56px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  focusRing: mainColor.secondary || '#85715e' 
                }}
                placeholder="Nhập tin nhắn của bạn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                className="rounded-r-lg text-white px-4"
                style={{ backgroundColor: mainColor.secondary || '#85715e' }}
                disabled={isLoading || !newMessage.trim() || !isConnected}
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {isConnected 
                ? "Bạn đang kết nối với nhân viên Skincede" 
                : "Đang kết nối..."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Message component
function MessageItem({ data, mainColor }) {
  const getMessageStyle = () => {
    switch(data.sender) {
      case 'me':
        return {
          justify: 'justify-end',
          bg: `${mainColor.secondary || '#85715e'}20`,
          textColor: 'text-black',
          borderRadius: '16px 4px 16px 16px'
        };
      case 'support':
      case 'staff': // Thêm trường hợp 'staff' để hỗ trợ định dạng mới
        return {
          justify: 'justify-start',
          bg: `${mainColor.primary}20`,
          textColor: 'text-black',
          borderRadius: '4px 16px 16px 16px'
        };
      case 'system':
        return {
          justify: 'justify-center',
          bg: 'bg-gray-100',
          textColor: 'text-gray-500',
          borderRadius: '16px'
        };
      default:
        return {
          justify: 'justify-start',
          bg: 'bg-gray-100',
          textColor: 'text-black',
          borderRadius: '4px 16px 16px 16px'
        };
    }
  };
  
  const style = getMessageStyle();
  
  return (
    <div className={`flex mb-4 ${style.justify}`}>
      <div 
        className={`rounded-lg py-2 px-4 max-w-[80%] ${style.textColor}`}
        style={{
          backgroundColor: style.bg,
          borderRadius: style.borderRadius,
        }}
      >
        {/* Format message preserving line breaks */}
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {data.content}
        </div>
      </div>
    </div>
  );
} 