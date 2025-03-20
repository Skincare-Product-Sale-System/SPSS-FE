"use client";
import React, { useEffect, useRef, useState } from "react";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "model",
      content: "Xin chào, tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const [inputMessage, setInputMessage] = useState("");
  const notificationSoundRef = useRef(null);
  const popupSoundRef = useRef(null);

  // Refs cho âm thanh
  useEffect(() => {
    // Thêm log để xác nhận đường dẫn
    console.log("Đường dẫn file notification:", '/sound/message-notification.mp3');
    console.log("Đường dẫn file popup:", '/sound/message-popup.mp3');
    
    // Tạo audio elements với đường dẫn tuyệt đối
    notificationSoundRef.current = new Audio(`${window.location.origin}/sound/message-notification.mp3`);
    popupSoundRef.current = new Audio(`${window.location.origin}/sound/message-popup.mp3`);
    
    // Preload audio
    if (notificationSoundRef.current) {
      notificationSoundRef.current.load();
    }
    if (popupSoundRef.current) {
      popupSoundRef.current.load();
    }
    
    // Thêm event listener để kiểm tra lỗi
    if (notificationSoundRef.current) {
      notificationSoundRef.current.addEventListener('error', (e) => {
        console.error("Lỗi khi tải file notification:", e);
      });
    }
    
    if (popupSoundRef.current) {
      popupSoundRef.current.addEventListener('error', (e) => {
        console.error("Lỗi khi tải file popup:", e);
      });
    }
    
    // Điều chỉnh âm lượng
    if (notificationSoundRef.current) notificationSoundRef.current.volume = 0.5;
    if (popupSoundRef.current) popupSoundRef.current.volume = 0.3;
    
    // Cleanup
    return () => {
      // Loại bỏ event listeners
      if (notificationSoundRef.current) {
        notificationSoundRef.current.removeEventListener('error', () => {});
        notificationSoundRef.current.pause();
        notificationSoundRef.current = null;
      }
      if (popupSoundRef.current) {
        popupSoundRef.current.removeEventListener('error', () => {});
        popupSoundRef.current.pause();
        popupSoundRef.current = null;
      }
    };
  }, []);

  // Scroll xuống khi có tin nhắn mới
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // Phát âm thanh khi có tin nhắn mới (trừ tin nhắn đầu tiên)
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      
      // Nếu là tin nhắn từ model và chat đang mở, phát âm thanh popup
      if (lastMessage.sender === "model" && isOpen) {
        if (popupSoundRef.current) {
          popupSoundRef.current.currentTime = 0;
          popupSoundRef.current.play().catch(err => console.log("Không thể phát âm thanh:", err));
        }
      } 
      // Nếu tin nhắn từ model và chat đang đóng, phát âm thanh thông báo
      else if (lastMessage.sender === "model" && !isOpen) {
        if (notificationSoundRef.current) {
          notificationSoundRef.current.currentTime = 0;
          notificationSoundRef.current.play().catch(err => console.log("Không thể phát âm thanh:", err));
        }
      }
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;
    
    const messageContent = inputMessage;
    setInputMessage("");

    // Thêm tin nhắn của người dùng
    setMessages((prev) => [
      ...prev,
      {
        content: messageContent,
        sender: "me",
      },
    ]);
    
    // Phát âm thanh tin nhắn popup khi người dùng gửi
    if (popupSoundRef.current) {
      popupSoundRef.current.currentTime = 0;
      popupSoundRef.current.play().catch(err => console.log("Không thể phát âm thanh:", err));
    }
    
    setIsLoading(true);

    try {
      const answer = await getAnswer([
        ...messages,
        {
          content: messageContent,
          sender: "me",
        },
      ]);
      
      // Thêm tin nhắn từ model (âm thanh sẽ được xử lý trong useEffect)
      setMessages((prev) => [
        ...prev,
        {
          content: answer,
          sender: "model",
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    // Tạo beep sound thay vì dùng file
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800; // Hz
      gainNode.gain.value = 0.1; // volume
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200); // ms
    };
    
    // Trong hàm handleSend hoặc khi nhận tin nhắn mới
    createBeepSound();
  };

  // Thay vì gọi play trực tiếp, cần xử lý qua tương tác người dùng
  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      
      // Thêm một Promise để xử lý lỗi một cách tốt hơn
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Phát thành công
            console.log("Âm thanh đang phát");
          })
          .catch(err => {
            // Xử lý lỗi
            console.error("Không thể phát âm thanh:", err);
            
            // Có thể là do chính sách autoplay, thử lại với muted
            if (err.name === "NotAllowedError") {
              audioRef.current.muted = true;
              audioRef.current.play().then(() => {
                // Sau khi đã có tương tác, bỏ muted
                audioRef.current.muted = false;
              });
            }
          });
      }
    }
  };

  return isOpen ? (
    <div className="bg-white border p-4 rounded-lg shadow-lg w-[500px] bottom-20 fixed right-5 z-50">
      <div className="flex border-b justify-between items-center pb-2">
        <div className="flex gap-2 items-center">
          <SmartToyIcon sx={{ color: '#3b82f6' }} />
          <span className="font-bold">Trợ lý ảo Skincede</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-red-500">
          <CloseIcon fontSize="small" />
        </button>
      </div>
      <div className="h-96 rounded-xl grow mt-4 overflow-y-scroll py-1 relative small-scrollbar">
        {messages.map((message, index) => (
          <MessageItem key={index} data={message} />
        ))}
        {isLoading && (
          <div className="flex flex-col justify-center items-center mt-4">
            <span className="text-zinc-500 pb-8">Trợ lý đang suy nghĩ ...</span>
          </div>
        )}
        <div className="" ref={messageEndRef}></div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <textarea
          className="flex-grow border h-16 rounded-lg text-black px-2 py-2"
          placeholder="Nhập tin nhắn của bạn..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button 
          onClick={handleSend}
          className="flex bg-blue-600 h-16 justify-center rounded-lg text-white items-center px-3"
        >
          <SendIcon />
        </button>
      </div>
      <button 
        onClick={() => {
          if (popupSoundRef.current) {
            popupSoundRef.current.currentTime = 0;
            popupSoundRef.current.play().catch(err => console.error("Lỗi khi phát:", err));
          }
        }}
        className="text-gray-500 text-xs mt-1"
      >
        Test Sound
      </button>
    </div>
  ) : (
    <button
      className="flex bg-blue-600 h-14 justify-center rounded-full shadow-lg text-white w-14 bottom-5 fixed hover:bg-blue-700 items-center right-5 transition-colors z-50"
      onClick={() => setIsOpen(true)}
    >
      <SmartToyIcon sx={{ fontSize: 28 }} />
    </button>
  );
}

const MessageItem = ({ data }) => {
  return (
    <div
      className={`flex gap-2 items-end mb-3 ${
        data.sender === "me" ? "justify-end" : "justify-start"
      }`}
    >
      {data.sender !== "me" && (
        <div className="flex bg-blue-100 h-8 justify-center rounded-full w-8 items-center">
          <SmartToyIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
        </div>
      )}

      <div
        className={`py-2 px-3 rounded-2xl shadow-sm ${
          data.sender === "me"
            ? "bg-blue-600 text-white"
            : "bg-white border border-gray-200"
        }`}
        style={{
          wordWrap: "break-word",
          maxWidth: "75%",
        }}
      >
        <div className="text-[15px]" style={{ whiteSpace: 'pre-wrap' }}>
          {data.content}
        </div>
      </div>

      {data.sender === "me" && (
        <div className="flex bg-blue-100 h-8 justify-center rounded-full w-8 items-center">
          <PersonIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
        </div>
      )}
    </div>
  );
};

// Modify the getAnswer function to handle stream response
const getAnswer = async (messages) => {
  const body = {
    system_instruction: {
      parts: {
        text: `Bạn là nhân viên hỗ trợ bán hàng cho cửa hàng kinh doanh chuỗi sản phẩm chăm sóc da Skincede`,
      },
    },
    contents: messages.map((item) => ({
      role: item?.sender === "me" ? "user" : "model",
      parts: [
        {
          text: item?.content,
        },
      ],
    })),
  };

  // Make the request to the model API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBDX1bPxSJl5U3riYSjS9JCs1pyfb3B4AE`,
    {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()).candidates[0].content?.parts[0].text;
};
