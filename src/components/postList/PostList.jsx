import React from 'react';
import { useFetchPosts } from '../../shared/hooks';
import './postList.css';

export const PostList = () => {
  const { posts, isLoading, error } = useFetchPosts();

  return (
    <div className='posts-container'>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Error loading posts: {error.message}</p>
      ) : (
        posts.map((post) => (
          <div className='post-card' key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            {post.photo && <img src={post.photo} alt={post.title} />}
          </div>
        ))
      )}
    </div>
  );
};

