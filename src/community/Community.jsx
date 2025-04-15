import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../service/api'; 

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const user = JSON.parse(localStorage.getItem('user')) || { 
    _id: 'guest',
    givenName: 'Guest',
    profilePicture: '/default-avatar.png'
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