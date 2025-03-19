"use client";
import React, { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return isOpen ? (
    <div className="fixed bottom-20 right-5 w-[500px] bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-bold">Trợ lý ảo Skincede</span>
        <button onClick={() => setIsOpen(false)} className="text-red-500">
          ✖
        </button>
      </div>
      <div className="small-scrollbar grow h-96 overflow-y-scroll rounded-xl mt-4 py-1 relative">
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
      <textarea
        className="h-16 py-2 px-2 mt-3 border rounded-lg text-black"
        placeholder="Enter your message..."
        onKeyDown={async (e) => {
          if (e.key === "Enter" && e.shiftKey) {
            return;
          }
          if (e.key === "Enter") {
            try {
              const messageContent = e.target.value;
              if (messageContent.trim() === "") return;
              e.preventDefault();
              e.target.value = "";

              setMessages((prev) => [
                ...prev,
                {
                  content: messageContent,
                  sender: "me",
                },
              ]);
              setIsLoading(true);

              const answer = await getAnswer([
                ...messages,
                {
                  content: messageContent,
                  sender: "me",
                },
              ]);
              setMessages((prev) => [
                ...prev,
                {
                  content: answer,
                  sender: "model",
                },
              ]);
              setIsLoading(false);
            } catch (error) {
              console.log(error);
            }
          }
        }}
      />
    </div>
  ) : (
    <button
      className="fixed bottom-5 right-5 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
      onClick={() => setIsOpen(true)}
    >
      💬
    </button>
  );
}

const MessageItem = ({ data }) => {
  //   const parsedContent = marked(data.content);
  return (
    <div
      className={`flex gap-2 ${
        data.sender === "me" ? "justify-end" : "message-p "
      }`}
    >
      {/* <div dangerouslySetInnerHTML={{ __html: parsedContent }}></div> */}
      <p
        className={`min-w-14 m-1 py-2 px-3 text-[16px] rounded-2xl text-start ${
          data.sender === "me"
            ? "justify-end bg-blue-600 dark:bg-blue-600 text-white"
            : "justify-start bg-zinc-300"
        }`}
        style={{
          wordWrap: "break-word",
          maxWidth: "80%",
        }}
        // dangerouslySetInnerHTML={{ __html: parsedContent }}
      >
        {data.content}
      </p>
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
