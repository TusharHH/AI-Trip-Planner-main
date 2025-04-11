import React, { useState } from 'react';

const chatbotPrompts = [
  { question: "Tell me about Mumbai", answer: "Mumbai is the financial capital of India, known for Bollywood and street food." },
  { question: "Best time to visit Goa?", answer: "The best time to visit Goa is from November to February when the weather is pleasant." },
  { question: "Famous places in Delhi?", answer: "Some famous places in Delhi include the Red Fort, Qutub Minar, and India Gate." },
];

function CommunityPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, user: 'TravelLover42', content: 'Just visited the Taj Mahal - absolutely breathtaking at sunrise!', likes: 15 },
    { id: 2, user: 'AdventureSeeker', content: 'Looking for trekking buddies in Himachal next month. Anyone interested?', likes: 8 },
    { id: 3, user: 'FoodExplorer', content: 'Best street food spots in Jaipur? Going there next week!', likes: 12 }
  ]);
  const [newPost, setNewPost] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const response = chatbotPrompts.find(p => p.question.toLowerCase() === input.toLowerCase());
    setMessages([...messages, { text: input, type: 'user' }, response ? { text: response.answer, type: 'bot' } : { text: "Sorry, I don't have an answer for that.", type: 'bot' }]);
    setInput('');
  };

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: communityPosts.length + 1,
      user: 'CurrentUser',
      content: newPost,
      likes: 0
    };
    setCommunityPosts([post, ...communityPosts]);
    setNewPost('');
  };

  return (
    <div className='p-8 min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Travel Community</h1>
      <p className='mb-6 text-gray-600'>Connect with fellow travelers and share your experiences!</p>

      {/* Community Posts Section */}
      <div className='max-w-3xl mx-auto'>
        {/* Create Post */}
        <div className='mb-6 border rounded-lg p-4 shadow'>
          <textarea 
            className='w-full p-2 border rounded mb-2' 
            placeholder='Share your travel experience or ask a question...'
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
          />
          <button 
            onClick={handleAddPost}
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className='space-y-4'>
          {communityPosts.map(post => (
            <div key={post.id} className='border rounded-lg p-4 shadow'>
              <div className='font-semibold text-blue-600'>{post.user}</div>
              <p className='my-2'>{post.content}</p>
              <div className='flex items-center text-gray-500'>
                <button className='mr-2 hover:text-red-500'>❤️ {post.likes}</button>
                <button className='hover:text-blue-500'>💬 Comment</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setShowChatbot(!showChatbot)}
        className='fixed bottom-6 left-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition'
      >
        {showChatbot ? '✕' : '💬 Travel Help'}
      </button>

      {/* Chatbot Section */}
      {showChatbot && (
        <div className='fixed bottom-20 left-6 w-80 border rounded-lg p-4 shadow-lg bg-white'>
          <h2 className='text-lg font-semibold mb-3'>Travel Assistant</h2>
          <div className='h-48 overflow-y-auto p-2 border rounded mb-3 bg-gray-100'>
            {messages.length === 0 ? (
              <p className='text-gray-500 text-center py-4'>Ask me about travel destinations in India!</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`p-2 my-1 rounded ${msg.type === 'user' ? 'bg-blue-200 text-right' : 'bg-gray-300 text-left'}`}>
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className='flex gap-2'>
            <input 
              type='text' 
              className='border p-2 flex-1 rounded' 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder='Ask about travel...' 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage} 
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;