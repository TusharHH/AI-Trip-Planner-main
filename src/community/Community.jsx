import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../service/api';
import { GoogleGenerativeAI } from "@google/generative-ai";

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {
    _id: 'guest',
    givenName: 'Guest',
    profilePicture: '/default-avatar.png'
  };

  // Initialize the Generative AI model
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  // Suggested questions for the chatbot
  const suggestedQuestions = [
    "Best beaches in South India?",
    "What should I pack for a trip to Ladakh?",
    "Suggest a 5-day itinerary for Rajasthan"
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message immediately
    const userMessage = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Start a chat session
      const chat = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: "You are a helpful travel assistant specializing in India. Provide concise, accurate responses to travel questions. Keep responses under 100 words." }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'll provide concise travel advice about India, keeping responses under 100 words." }],
          },
          ...messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }))
        ],
      });

      // Send message and get response
      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { text, type: 'bot' }]);
    } catch (error) {
      console.error('Error with Gemini API:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding. Please try again later.", 
        type: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.community.getPosts();
        setPosts(data);
      } catch (error) {
        toast.error(error.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle post creation
  const handleAddPost = async () => {
    if (!newPost.trim()) {
      toast.warning('Post content cannot be empty');
      return;
    }

    try {
      const postData = {
        content: newPost,
        user: {
          _id: user._id,
          givenName: user.givenName,
          familyName: user.familyName,
          profilePicture: user.profilePicture,
          type: user.type || 'user'
        }
      };

      const post = await api.community.createPost(postData);
      setPosts([post, ...posts]);
      setNewPost('');
      toast.success('Post created successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  // Handle liking a post
  const handleLike = async (postId) => {
    try {
      const updatedPost = await api.community.likePost(postId, { userId: user._id });
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
      toast.success('Post liked');
    } catch (error) {
      toast.error(error.message || 'Failed to like post');
    }
  };

  // Handle adding a comment
  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) {
      toast.warning('Comment cannot be empty');
      return;
    }

    try {
      const commentData = {
        content,
        user: {
          _id: user._id,
          givenName: user.givenName,
          profilePicture: user.profilePicture
        }
      };

      const updatedPost = await api.community.addComment(postId, commentData);
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
      setCommentInputs({ ...commentInputs, [postId]: '' });
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="container max-w-4xl p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Travel Community</h1>

      {/* Travel Assistant Button */}
      <div className="fixed z-10 bottom-6 right-6">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="flex items-center justify-center w-16 h-16 text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700"
        >
          {showChatbot ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed z-10 flex flex-col bg-white border border-gray-200 rounded-lg shadow-xl bottom-24 right-6 w-96" style={{ height: '60vh' }}>
          <div className="flex items-center justify-between p-4 text-white bg-indigo-600 rounded-t-lg">
            <h3 className="font-bold">India Travel Expert</h3>
            <button onClick={() => setShowChatbot(false)} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-white bg-indigo-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-center">Ask me about travel in India!</p>
                <div className="mt-4 space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="w-full p-2 text-sm text-left bg-gray-200 rounded hover:bg-gray-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${msg.type === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 p-4 border-t">
            <input 
              type="text" 
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about travel in India..." 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading}
              className={`px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Post Creation */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <textarea
          className="w-full p-3 mb-3 border rounded-lg"
          placeholder="Share your travel experience..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          rows={3}
        />
        <button
          onClick={handleAddPost}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="p-4 bg-white rounded-lg shadow">
            {/* Post Header */}
            <div className="flex items-center mb-3">
              <img
                src={post.userAvatar || '/default-avatar.png'}
                alt={post.username}
                className="w-10 h-10 mr-3 rounded-full"
              />
              <div>
                <div className="font-semibold">
                  {post.username}
                  {post.userType === 'proUser' && (
                    <span className="px-2 py-1 ml-2 text-xs text-purple-800 bg-purple-100 rounded-full">
                      Pro
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="mb-3">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center pt-3 border-t">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center mr-4 ${post.likes.includes(user._id) ? 'text-red-500' : 'text-gray-500'}`}
              >
                <span className="mr-1">❤️</span>
                {post.likes.length}
              </button>

              <div className="flex flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded-l"
                  value={commentInputs[post._id] || ''}
                  onChange={(e) => setCommentInputs({
                    ...commentInputs,
                    [post._id]: e.target.value
                  })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  className="px-3 text-white bg-blue-500 rounded-r"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {post.comments?.length > 0 && (
              <div className="pt-3 mt-3 border-t">
                {post.comments.map(comment => (
                  <div key={comment._id} className="flex mb-3">
                    <img
                      src={comment.userAvatar || '/default-avatar.png'}
                      alt={comment.username}
                      className="w-8 h-8 mr-2 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <div className="text-sm font-semibold">
                          {comment.username}
                        </div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPage;