import React, { useState, useEffect } from 'react';

function CommunityPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, user: 'TravelLover42', content: 'Just visited the Taj Mahal - absolutely breathtaking at sunrise!', likes: 15 },
    { id: 2, user: 'AdventureSeeker', content: 'Looking for trekking buddies in Himachal next month. Anyone interested?', likes: 8 },
    { id: 3, user: 'FoodExplorer', content: 'Best street food spots in Jaipur? Going there next week!', likes: 12 }
  ]);
  const [newPost, setNewPost] = useState('');

  // Function to call Gemini API
  const generateResponse = async (userInput) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful travel assistant specializing in India. Provide concise, accurate responses to travel questions.
              If the question isn't travel-related, politely decline to answer. Keep responses under 100 words.
              
              User question: ${userInput}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 200
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response. Please try again.";

      return generatedText;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm having trouble connecting to the travel assistant. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message immediately
    const userMessage = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get AI response
    const aiResponse = await generateResponse(input);
    setMessages(prev => [...prev, { text: aiResponse, type: 'bot' }]);
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

  // Suggested questions for the chatbot
  const suggestedQuestions = [
    "Best beaches in South India?",
    "What should I pack for a trip to Ladakh?",
    "Suggest a 5-day itinerary for Rajasthan"
  ];

  return (
    <div className='min-h-screen p-8'>
      <h1 className='mb-4 text-2xl font-bold'>Travel Community</h1>
      <p className='mb-6 text-gray-600'>Connect with fellow travelers and share your experiences!</p>

      {/* Community Posts Section */}
      <div className='max-w-3xl mx-auto'>
        {/* Create Post */}
        <div className='p-4 mb-6 border rounded-lg shadow'>
          <textarea
            className='w-full p-2 mb-2 border rounded'
            placeholder='Share your travel experience or ask a question...'
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
          />
          <button
            onClick={handleAddPost}
            className='px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600'
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className='space-y-4'>
          {communityPosts.map(post => (
            <div key={post.id} className='p-4 border rounded-lg shadow'>
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
        className='fixed p-3 text-white transition bg-blue-500 rounded-full shadow-lg bottom-6 left-6 hover:bg-blue-600'
      >
        {showChatbot ? '✕' : '💬 Travel Help'}
      </button>

      {/* Chatbot Section */}
      {showChatbot && (
        <div className='fixed p-4 bg-white border rounded-lg shadow-lg bottom-20 left-6 w-80'>
          <h2 className='mb-3 text-lg font-semibold'>Travel Assistant</h2>
          <div className='h-48 p-2 mb-3 overflow-y-auto bg-gray-100 border rounded'>
            {messages.length === 0 ? (
              <div className='py-4 text-gray-500'>
                <p className='mb-2 text-center'>Ask me about travel destinations in India!</p>
                <div className='space-y-2'>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className='w-full p-2 text-sm text-left bg-gray-200 rounded hover:bg-gray-300'
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`p-2 my-1 rounded ${msg.type === 'user' ? 'bg-blue-200 text-right' : 'bg-gray-300 text-left'}`}>
                  {msg.text}
                </div>
              ))
            )}
            {isLoading && (
              <div className='p-2 my-1 text-left bg-gray-300 rounded'>
                <div className='flex space-x-2'>
                  <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'></div>
                  <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                  <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
          <div className='flex gap-2'>
            <input
              type='text'
              className='flex-1 p-2 border rounded'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask about travel...'
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className={`px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
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