"use client";
import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useThemeColors } from "@/context/ThemeContext";
import {
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Rating,
  Modal,
  Backdrop,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InfoIcon from "@mui/icons-material/Info";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import StarIcon from "@mui/icons-material/Star";
import ImageIcon from "@mui/icons-material/Image";
import useAuthStore from "@/context/authStore";
import * as LocalStorage from "@/utils/localStorage";
import { formatPrice } from "@/utils/priceFormatter";
import toast from "react-hot-toast";

const MESSAGE_TYPES = {
  USER: "user", // Tin nhắn từ khách hàng
  STAFF: "staff", // Tin nhắn từ nhân viên
  SYSTEM: "system", // Tin nhắn hệ thống
};

export default function RealTimeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "system",
      content: "Kết nối với nhân viên hỗ trợ của Skincede...",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState(null);
  const messageEndRef = useRef(null);
  const mainColor = useThemeColors();
  const { Id } = useAuthStore();
  const [userId, setUserId] = useState(null);

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  // Image preview states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Khởi tạo userId sử dụng utility
  useEffect(() => {
    if (Id) {
      setUserId(Id);
      return;
    }

    // Lấy từ localStorage nếu có
    let savedId = LocalStorage.getItem("chatUserId");
    if (savedId) {
      setUserId(savedId);
      return;
    }

    // Tạo mới nếu không có
    const newId = `user-${Math.random().toString(36).substring(2, 9)}`;
    LocalStorage.setItem("chatUserId", newId);
    setUserId(newId);
  }, [Id]);

  // Add a function similar to loadChatHistory in StaffChat
  const loadChatHistoryFromStorage = (userId) => {
    if (!userId) return;

    setIsLoading(true);

    // Keep system messages
    const systemMessages = messages.filter((msg) => msg.sender === "system");

    // Load messages from localStorage
    const storageKey = `chat_${userId}`;
    const storedMessages = JSON.parse(localStorage.getItem(storageKey) || "[]");
    console.log("Loading stored messages:", storedMessages.length);

    if (storedMessages.length === 0) {
      setIsLoading(false);
      return;
    }

    // Format messages for UI exactly like in StaffChat
    const formattedMessages = storedMessages.map((msg) => {
      let senderType;

      if (msg.userType !== undefined) {
        senderType = msg.userType === "user" ? "me" : "support";
      } else if (msg.type !== undefined) {
        senderType = msg.type === MESSAGE_TYPES.USER ? "me" : "support";
      } else {
        senderType = msg.sender || "me";
      }

      return {
        content: msg.content,
        sender: senderType,
        timestamp: new Date(msg.timestamp || new Date()),
      };
    });

    // Set all messages at once with proper formatting
    setMessages([...systemMessages, ...formattedMessages]);
    setIsLoading(false);
  };

  // Then in your useEffect
  useEffect(() => {
    if (isOpen && userId) {
      // Load chat history using the same method as StaffChat
      loadChatHistoryFromStorage(userId);
    }
  }, [isOpen, userId]);

  // Then keep the connection setup in a separate useEffect, but don't load messages there
  useEffect(() => {
    if (!isOpen) return;

    // Create SignalR connection only if needed
    if (!connection) {
      console.log("Creating new connection");

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          `http://localhost:5041/chathub`,
          {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            withCredentials: true
          }
        )
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Debug)
        .build();

      // Start the connection
      newConnection
        .start()
        .then(() => {
          console.log("SignalR Connected");
          setIsConnected(true);
          setMessages((prev) => [
            ...prev,
            {
              sender: "system",
              content:
                "Đã kết nối với hỗ trợ viên. Bạn có thể bắt đầu nhắn tin.",
              timestamp: new Date(),
            },
          ]);

          // Lưu kết nối mới
          setConnection(newConnection);
        })
        .catch((err) => {
          console.error("SignalR Connection Error: ", err);
          setMessages((prev) => [
            ...prev,
            {
              sender: "system",
              content:
                "Không thể kết nối với hỗ trợ viên. Vui lòng thử lại sau.",
              timestamp: new Date(),
            },
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
  }, [isOpen]);

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
        connection
          .invoke("RegisterUser", userId)
          .then(() => {
            console.log("User registered successfully");
          })
          .catch((err) => {
            console.error("Error registering user:", err);
          });
      } else {
        console.error("Cannot register user - userId is empty");
      }
    }
  }, [connection, isConnected, userId]);

  // Helper function to format message display text
  const formatMessageDisplay = (messageContent) => {
    try {
      const parsedContent = JSON.parse(messageContent);
      if (parsedContent.type === "product") {
        return "[Sản phẩm]";
      } else if (parsedContent.type === "image") {
        return "[Hình ảnh]";
      }
      return messageContent;
    } catch (e) {
      // Not a JSON message, return as is
      return messageContent;
    }
  };

  // Helper function to format message content for display
  const formatMessageForList = (messageContent) => {
    try {
      const parsedContent = JSON.parse(messageContent);
      if (parsedContent.type === "product") {
        return "[Sản phẩm]";
      } else if (parsedContent.type === "image") {
        return "[Hình ảnh]";
      }
      return messageContent;
    } catch (e) {
      // Not a JSON message, return as is
      return messageContent;
    }
  };

  // Lưu tin nhắn vào localStorage
  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", (message, userType) => {
      console.log("Message received:", message, userType);

      // Chuẩn hóa userType
      const normalizedUserType =
        userType === "support" ? MESSAGE_TYPES.STAFF : MESSAGE_TYPES.USER;
      const uiSender =
        normalizedUserType === MESSAGE_TYPES.STAFF ? "support" : "me";

      // Kiểm tra xem tin nhắn có phải là JSON không trước khi lưu
      let messageContent = message;
      try {
        // Nếu là JSON (ví dụ: sản phẩm), vẫn giữ nguyên định dạng
        JSON.parse(message);
        // Không cần làm gì với messageContent - giữ nguyên string JSON
      } catch (e) {
        // Không phải JSON, là tin nhắn thông thường
      }

      // Lưu vào localStorage với định dạng thống nhất
      const storageKey = `chat_${userId}`;
      let existingMessages = [];

      try {
        existingMessages = JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch (err) {
        console.error("Error parsing messages from localStorage:", err);
      }

      existingMessages.push({
        content: messageContent,
        type: normalizedUserType,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem(storageKey, JSON.stringify(existingMessages));

      // Cập nhật UI
      setMessages((prev) => [
        ...prev,
        {
          sender: uiSender,
          content: messageContent,
          timestamp: new Date(),
        },
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
    setMessages((prev) => [
      ...prev,
      {
        sender: "me",
        content: messageText,
        timestamp: new Date(),
      },
    ]);

    // Lưu vào localStorage với định dạng thống nhất
    const storageKey = `chat_${userId}`;
    const existingMessages = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    existingMessages.push({
      content: messageText,
      type: MESSAGE_TYPES.USER,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(storageKey, JSON.stringify(existingMessages));

    // Gửi đến server
    connection
      .invoke("SendMessage", userId, messageText, "user")
      .catch((err) => {
        console.error("Error sending message:", err);
      });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("files", files[0]);

      // Fetch API để tải lên hình ảnh
      const response = await fetch(
        "http://localhost:5041/api/images",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success && data.data) {
        // Tạo message object mới cho image
        const imageUrl = data.data[0];
        const imageMessage = JSON.stringify({
          type: "image",
          url: imageUrl,
        });

        // Save to localStorage
        const storageKey = `chat_${userId}`;
        const existingMessages = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );

        existingMessages.push({
          content: imageMessage,
          type: MESSAGE_TYPES.USER,
          timestamp: new Date().toISOString(),
        });

        localStorage.setItem(storageKey, JSON.stringify(existingMessages));

        // Cập nhật UI với hình ảnh mới ngay lập tức
        setMessages((prev) => [
          ...prev,
          {
            content: imageMessage,
            sender: "me",
            timestamp: new Date(),
          },
        ]);

        // Gửi đến server
        connection
          .invoke("SendMessage", userId, imageMessage, "user")
          .catch((err) => {
            console.error("Error sending image message:", err);
          });

        toast.success("Đã gửi hình ảnh");
      } else {
        toast.error("Không thể tải lên hình ảnh");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Lỗi khi tải lên hình ảnh");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // Thay thế bằng hàm format thời gian đơn giản
  const formatMessageTime = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  // Open image preview
  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  // Close image preview
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex justify-center p-3 rounded-full shadow-lg fixed hover:opacity-90 items-center left-5 transition-opacity z-[1001] bottom-4"
        style={{
          backgroundColor: mainColor.secondary || "#85715e",
          width: "56px",
          height: "56px",
          border: "none",
          cursor: "pointer",
        }}
      >
        <ChatBubbleIcon sx={{ color: "white", fontSize: 24 }} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="flex flex-col bg-white border rounded-lg shadow-lg w-[600px] fixed left-5 z-[1001] bottom-4"
          style={{
            maxHeight: "calc(100vh - 160px - 4rem)", // Trừ thêm chiều cao của nav mobile
          }}
        >
          {/* Header */}
          <div
            className="flex border-b justify-between p-3 items-center"
            style={{
              backgroundColor: mainColor.secondary || "#85715e",
              color: "white",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <div className="flex gap-2 items-center">
              <ChatIcon
                sx={{
                  fontSize: 22,
                  filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.1))",
                }}
              />
              <span className="font-medium">Chat với nhân viên Skincede</span>
            </div>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{ color: "white" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Messages area */}
          <div
            className="flex-1 p-4 overflow-y-auto"
            style={{ minHeight: "300px", maxHeight: "calc(100vh - 280px)" }}
          >
            {messages.map((message, index) => (
              <MessageItem
                key={index}
                data={message}
                mainColor={mainColor}
                formatTime={formatMessageTime}
                onImageClick={handleImagePreview}
              />
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
            <div className="flex gap-2">
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || !isConnected}
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex justify-center rounded-lg items-center"
                style={{
                  border: `1px solid ${mainColor.secondary || "#85715e"}`,
                  backgroundColor: "white",
                  color: mainColor.secondary || "#85715e",
                  width: "48px",
                  height: "56px",
                }}
                disabled={uploadingImage || !isConnected}
              >
                {uploadingImage ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: mainColor.secondary || "#85715e" }}
                  />
                ) : (
                  <ImageIcon sx={{ color: mainColor.secondary || "#85715e" }} />
                )}
              </button>
              <textarea
                className="flex-1 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 px-3 py-2 resize-none"
                style={{
                  height: "56px",
                  maxHeight: "120px",
                  overflowY: "auto",
                  focusRing: mainColor.secondary || "#85715e",
                }}
                placeholder="Nhập tin nhắn của bạn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                className="flex justify-center rounded-r-lg text-white items-center"
                style={{
                  backgroundColor: mainColor.secondary || "#85715e",
                  width: "56px",
                }}
                disabled={isLoading || !newMessage.trim() || !isConnected}
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <SendIcon />
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

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1500,
        }}
      >
        <div className="relative bg-transparent rounded-lg overflow-hidden max-w-[90vw] max-h-[90vh]">
          <IconButton
            onClick={handleClosePreview}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </Modal>
    </>
  );
}

// Message component
function MessageItem({ data, mainColor, formatTime, onImageClick }) {
  const getMessageStyle = () => {
    switch (data.sender) {
      case "me":
        return {
          justify: "justify-end",
          bg: mainColor.secondary || "#85715e",
          textColor: "white",
          borderRadius: "16px 4px 16px 16px",
        };
      case "support":
      case "staff":
        return {
          justify: "justify-start",
          bg: "white",
          textColor: "black",
          borderRadius: "4px 16px 16px 16px",
        };
      case "system":
        return {
          justify: "justify-center",
          bg: "#f3f4f6",
          textColor: "#6b7280",
          borderRadius: "16px",
        };
      default:
        return {
          justify: "justify-start",
          bg: "white",
          textColor: "black",
          borderRadius: "4px 16px 16px 16px",
        };
    }
  };

  const style = getMessageStyle();

  return (
    <div className={`flex mb-4 items-end ${style.justify}`}>
      {(data.sender === "support" || data.sender === "staff") && (
        <div className="flex bg-blue-100 h-8 justify-center rounded-full w-8 items-center mr-2">
          <SupportAgentIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
        </div>
      )}

      {/* Kiểm tra và xử lý nội dung tin nhắn */}
      {(() => {
        try {
          // Nếu là JSON, thì parse và kiểm tra
          const parsedContent = JSON.parse(data.content);

          if (parsedContent.type === "product") {
            // Nếu là sản phẩm, hiển thị card sản phẩm
            return (
              <div
                className={`${
                  data.sender === "me" ? "ml-auto" : "mr-auto"
                } max-w-[400px] mb-1`}
              >
                <a
                  href={parsedContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      border: "1px solid",
                      borderColor: mainColor.primary + "40",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        borderColor: mainColor.primary,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", p: 1 }}>
                      <Box
                        sx={{ width: "80px", height: "80px", flexShrink: 0 }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            parsedContent.image || "/images/placeholder.jpg"
                          }
                          alt={parsedContent.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          ml: 1.5,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            color: "rgba(0,0,0,0.87)",
                            fontSize: "0.875rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {parsedContent.name}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              fontSize: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {parsedContent.rating || "4.5"}/5
                            <Rating
                              value={parsedContent.rating || 4.5}
                              precision={0.5}
                              readOnly
                              size="small"
                              sx={{ ml: 0.5, fontSize: "0.75rem" }}
                            />
                          </Typography>
                          <Box
                            component="span"
                            sx={{
                              mx: 0.5,
                              fontSize: "0.75rem",
                              color: "text.disabled",
                            }}
                          >
                            |
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.75rem",
                            }}
                          >
                            Đã bán: {parsedContent.soldCount || 0}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: mainColor.primary,
                            fontSize: "0.875rem",
                          }}
                        >
                          {formatPrice(parsedContent.price, "₫")}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </a>
                <div
                  style={{
                    fontSize: "10px",
                    opacity: 0.7,
                    marginTop: "2px",
                    textAlign: data.sender === "me" ? "right" : "left",
                    color: "rgba(0,0,0,0.6)",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  }}
                >
                  {formatTime(data.timestamp)}
                </div>
              </div>
            );
          }
          // Add image message handling
          else if (parsedContent.type === "image") {
            return (
              <div
                className={`${
                  data.sender === "me" ? "ml-auto" : "mr-auto"
                } max-w-[300px] mb-1`}
              >
                <div
                  className="rounded shadow-sm overflow-hidden"
                  style={{
                    padding: "4px",
                    backgroundColor: "white",
                    borderRadius:
                      data.sender === "me"
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                  }}
                >
                  <img
                    src={parsedContent.url}
                    alt="Shared image"
                    className="w-full object-contain rounded max-h-[300px] cursor-pointer"
                    onClick={() => onImageClick(parsedContent.url)}
                  />
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    opacity: 0.7,
                    marginTop: "2px",
                    textAlign: data.sender === "me" ? "right" : "left",
                    color: "rgba(0,0,0,0.6)",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  }}
                >
                  {formatTime(data.timestamp)}
                </div>
              </div>
            );
          } else {
            // Nếu là JSON nhưng không phải product hoặc image
            return (
              <div
                className="shadow-sm px-4 py-2 relative max-w-[75%]"
                style={{
                  backgroundColor: style.bg,
                  borderRadius: style.borderRadius,
                  color: style.textColor,
                  border: style.bg === "white" ? "1px solid #e5e7eb" : "none",
                }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {formatMessageDisplay(data.content)}
                </div>

                {/* Thêm timestamp */}
                {data.timestamp && (
                  <div
                    style={{
                      fontSize: "10px",
                      opacity: 0.7,
                      marginTop: "4px",
                      textAlign: "right",
                      color:
                        style.textColor === "white"
                          ? "rgba(255,255,255,0.8)"
                          : "inherit",
                    }}
                  >
                    {formatTime(data.timestamp)}
                  </div>
                )}
              </div>
            );
          }
        } catch (e) {
          // Nếu không phải JSON, hiển thị text thường
          return (
            <div
              className="shadow-sm px-4 py-2 relative max-w-[75%]"
              style={{
                backgroundColor: style.bg,
                borderRadius: style.borderRadius,
                color: style.textColor,
                border: style.bg === "white" ? "1px solid #e5e7eb" : "none",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap" }}>{data.content}</div>

              {/* Thêm timestamp */}
              {data.timestamp && (
                <div
                  style={{
                    fontSize: "10px",
                    opacity: 0.7,
                    marginTop: "4px",
                    textAlign: "right",
                    color:
                      style.textColor === "white"
                        ? "rgba(255,255,255,0.8)"
                        : "inherit",
                  }}
                >
                  {formatTime(data.timestamp)}
                </div>
              )}
            </div>
          );
        }
      })()}

      {data.sender === "me" && (
        <div className="flex bg-blue-100 h-8 justify-center rounded-full w-8 items-center ml-2">
          <PersonIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
        </div>
      )}

      {data.sender === "system" && style.justify === "justify-center" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "-24px",
          }}
        >
          <InfoIcon fontSize="small" sx={{ color: "#9ca3af", fontSize: 16 }} />
        </div>
      )}
    </div>
  );
}
