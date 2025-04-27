import React, { useState, useRef, useEffect } from "react";
import CoverImage1 from "../../assets/CoverImage1.png";
import CoverImage2 from "../../assets/CoverImage2.png";
import CoverImage3 from "../../assets/CoverImage3.png";
import chatbg from "../../assets/chatbg.png";
import learnSphere from '../../assets/learnSphere.png'
import { RiCommunityLine } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { VscVerifiedFilled } from "react-icons/vsc";

// Sample messages for each community
const communityMessages = {
  "Web Development": [
    {
      id: 1,
      sender: "Instructor",
      content: "Welcome to the Web Development community! Today we'll discuss React hooks.",
      time: "10:00",
      isYou: false
    },
    {
      id: 2,
      sender: "Student: Alex",
      content: "I'm having trouble with useEffect dependencies. Any tips?",
      time: "10:05",
      isYou: false
    }
  ],
  "UI/UX Design": [
    {
      id: 1,
      sender: "Design Lead",
      content: "Let's review some Figma prototypes for the new app design.",
      time: "14:30",
      isYou: false
    },
    {
      id: 2,
      sender: "Student: Maria",
      content: "I've shared my prototype for feedback on the user flow.",
      time: "14:35",
      isYou: false
    }
  ],
  "Data Science": [
    {
      id: 1,
      sender: "Professor",
      content: "Today we'll analyze the COVID dataset using Pandas.",
      time: "09:00",
      isYou: false
    },
    {
      id: 2,
      sender: "TA: John",
      content: "Remember to preprocess your data before running models.",
      time: "09:10",
      isYou: false
    }
  ]
};

const CommunityChat = () => {
  const [message, setMessage] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("Web Development");
  const [messages, setMessages] = useState(communityMessages["Web Development"]);
  const [communities] = useState([
    { id: 1, name: "Web Development", members: 245, image: CoverImage1 },
    { id: 2, name: "UI/UX Design", members: 189, image: CoverImage2 },
    { id: 3, name: "Data Science", members: 312, image: CoverImage3 },
    { id: 4, name: "Digital Marketing", members: 156, image: CoverImage1 },
    { id: 5, name: "Music Theory", members: 98, image: CoverImage2 },
    { id: 6, name: "Photography", members: 203, image: CoverImage3 }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load messages for the selected community
    setMessages(communityMessages[selectedCommunity] || []);
  }, [selectedCommunity]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isYou: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCommunitySelect = (communityName) => {
    setSelectedCommunity(communityName);
  };

  return (
    <div className="max-h-screen min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
        <button className="text-green-500 text-xl hover:bg-gray-700 p-2 rounded-lg transition">
            <RiCommunityLine/>    
        </button>
        <button className="text-white text-xl hover:bg-gray-700 p-2 rounded-lg transition">
        <a href="/"> <FaHome/> </a>    
        </button>
        <button className="text-white text-xl hover:bg-gray-700 p-2 rounded-lg transition">
        <a href="/CretorSignup">  <IoSettingsOutline /> </a>   
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 px-6 py-4 flex justify-center items-center space-x-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <img src={learnSphere} alt="Learn Sphere" className="w-40" />
          </div>
          <div>
            <div className="flex justify-start items-center gap-1">
              <h2 className="text-sm">Community</h2>
              <VscVerifiedFilled className="text-sky-700"/>
            </div>
            <h2 className="text-sm text-gray-400">{selectedCommunity}</h2>
          </div>
        </header>

        {/* Chat Section */}
        <div className="flex flex-grow overflow-hidden">
          {/* Chat Messages */}
          <div 
            className="flex-grow bg-[#20262a] bg-cover bg-center p-6 overflow-y-auto"
            style={{ 
              backgroundImage: `url(${chatbg})`, 
              backgroundBlendMode: 'overlay',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="space-y-4 [&::-webkit-scrollbar]:hidden">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.isYou ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`rounded-lg p-4 max-w-xs md:max-w-md lg:max-w-lg ${
                      msg.isYou 
                        ? 'bg-[#111B21] text-gray-200' 
                        : msg.sender === 'Instructor' || msg.sender === 'Professor' || msg.sender === 'Design Lead'
                          ? 'bg-[#111B21] border-l-4 border-green-500 text-gray-200' 
                          : 'bg-[#111B21] text-gray-200'
                    }`}
                  >
                    <span className="font-semibold text-violet-500">{msg.sender}</span>
                    <p className="mt-1 text-sm">{msg.content}</p>
                  </div>
                  <span className="text-sm text-gray-400 mt-1">{msg.time}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-gray-800 p-4 flex items-center border-t border-gray-700">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${selectedCommunity} community...`}
            className="flex-grow bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg ml-4 transition"
          >
            Send
          </button>
        </div>
      </div>
      
      {/* Communities Sidebar */}
      <aside 
        className="w-96 bg-gray-800 p-6 overflow-y-auto border-l border-gray-700 flex-col items-center"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <h3 className="text-green-400 text-lg font-semibold mb-4">
          Communities
        </h3>
        <ul className="space-y-3 [&::-webkit-scrollbar]:hidden">
          {communities.map((community) => (
            <li
              key={community.id}
              onClick={() => handleCommunitySelect(community.name)}
              className={`flex items-center space-x-3 p-2 rounded-lg hover:ring-2 hover:ring-green-500 transition cursor-pointer ${
                selectedCommunity === community.name ? 'bg-gray-600' : 'bg-gray-700'
              }`}
            >
              <img
                src={community.image}
                alt={community.name}
                className="w-auto h-10 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-sm font-medium line-clamp-1">{community.name}</h4>
                <p className="text-xs text-gray-400">{community.members} members</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default CommunityChat;