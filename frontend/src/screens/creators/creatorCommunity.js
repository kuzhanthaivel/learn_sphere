import React, { useState, useRef, useEffect } from "react";
import chatbg from "../../assets/chatbg.png";
import learnSphere from '../../assets/learnSphere.png'
import { RiCommunityLine } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useParams, useNavigate } from 'react-router-dom';

const CommunityChat = () => {
  const [message, setMessage] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const navigate = useNavigate();
  const creatorToken = localStorage.getItem('creatorToken');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/user/communities', {
          headers: {
            'Authorization': `Bearer ${creatorToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch communities');
        }
        
        const data = await response.json();
        
        if (data.success && data.communities.length > 0) {
          setCommunities(data.communities);
          if (data.communities.length > 0) {
            handleCommunitySelect(data.communities[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (creatorToken) {
      fetchCommunities();
    } else {
      setError('No authentication token found');
      setLoading(false);
      navigate('/CreatorSignin');
    }
  }, [creatorToken, navigate]);

  const fetchCommunityMessages = async (communityId) => {
    if (!communityId) return;
    
    setFetchingMessages(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/communities/fetchMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${creatorToken}`
        },
        body: JSON.stringify({ communityId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(formatMessages(data.messages));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setFetchingMessages(false);
    }
  };

  const formatMessages = (apiMessages) => {
    if (!apiMessages) return [];
    
    return apiMessages.map(msg => ({
      id: msg._id,
      sender: msg.isYou ? "You" : msg.userName,
      content: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isYou: msg.isYou,
      userType: msg.userType
    }));
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" || !selectedCommunity) return;
    if (message.length > 500) {
      setError('Message too long (max 500 characters)');
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: "You",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isYou: true,
      userType: "Student" 
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setMessage("");
    
    try {
      const response = await fetch(`http://localhost:5001/api/communities/addMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${creatorToken}`
        },
        body: JSON.stringify({ 
          communityId: selectedCommunity._id, 
          content: message 
        })
      });
      
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to send message');
      }
      
      const data = await response.json();
      
      if (data.newMessage) {
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempMessage.id),
          {
            id: data.newMessage._id || tempMessage.id,
            sender: "You",
            content: data.newMessage.content,
            time: new Date(data.newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isYou: true,
            userType: data.newMessage.userType
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setError(err.message === 'Unauthorized' ? 'Please login again' : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSending) {
      handleSendMessage();
    }
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
    fetchCommunityMessages(community._id);
    setError(null);
  };

  if (loading) {
    return (
      <div className="max-h-screen min-h-screen flex bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading communities...</p>
        </div>
      </div>
    );
  }

  if (error && !communities.length) {
    return (
      <div className="max-h-screen min-h-screen flex bg-gray-900 text-white items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="max-h-screen min-h-screen flex bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <p>You haven't joined any communities yet.</p>
          <button 
            onClick={() => navigate('/CreaorDashboard')}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Explore Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen min-h-screen flex bg-gray-900 text-white">

      <aside className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
        <button className="text-green-500 text-xl hover:bg-gray-700 p-2 rounded-lg transition">
            <RiCommunityLine/>    
        </button>
        <button className="text-white text-xl hover:bg-gray-700 p-2 rounded-lg transition">
        <a href="/"> <FaHome/> </a>    
        </button>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-gray-800 px-6 py-4 flex justify-center items-center space-x-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <img src={learnSphere} alt="Learn Sphere" className="w-40" />
          </div>
          {selectedCommunity && (
            <div>
              <div className="flex justify-start items-center gap-1">
                <h2 className="text-sm">Community</h2>
                <VscVerifiedFilled className="text-sky-700"/>
              </div>
              <h2 className="text-sm text-gray-400">{selectedCommunity.name}</h2>
            </div>
          )}
        </header>

        {error && (
          <div className="bg-red-900 text-white p-2 text-center text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-grow overflow-hidden">
          <div 
            className="flex-grow bg-[#20262a] bg-cover bg-center p-6 overflow-y-auto"
            style={{ 
              backgroundImage: `url(${chatbg})`, 
              backgroundBlendMode: 'overlay',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {fetchingMessages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
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
                          : msg.userType === 'Creator' 
                            ? 'bg-[#111B21] border-l-4 border-green-500 text-gray-200' 
                            : 'bg-[#111B21] text-gray-200'
                      }`}
                    >
                      <span className={`font-semibold ${
                        msg.userType === 'Creator' ? 'text-green-500' : 'text-violet-500'
                      }`}>
                        {msg.sender}
                        {msg.userType === 'Creator' && <VscVerifiedFilled className="inline ml-1 text-green-500" />}
                      </span>
                      <p className="mt-1 text-sm">{msg.content}</p>
                    </div>
                    <span className="text-sm text-gray-400 mt-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 flex items-center border-t border-gray-700">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder={selectedCommunity ? `Message ${selectedCommunity.name} community...` : "Select a community..."}
            className="flex-grow bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            disabled={!selectedCommunity || isSending || fetchingMessages}
            maxLength={500}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!selectedCommunity || isSending || message.trim() === "" || fetchingMessages}
            className={`bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg ml-4 transition ${
              (!selectedCommunity || isSending || message.trim() === "" || fetchingMessages) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

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
              key={community._id}
              onClick={() => handleCommunitySelect(community)}
              className={`flex items-center space-x-3 p-2 rounded-lg hover:ring-2 hover:ring-green-500 transition cursor-pointer ${
                selectedCommunity && selectedCommunity._id === community._id ? 'bg-gray-600' : 'bg-gray-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                <span className="text-lg">{community.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium line-clamp-1">{community.name}</h4>
                <p className="text-xs text-gray-400">{community.memberCount} members</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default CommunityChat;