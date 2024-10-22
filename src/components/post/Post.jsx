import React, { useState } from 'react';
import { Input } from "../Input.jsx";
import { useNavigate } from "react-router-dom";
import { usePost, useFetchPosts } from '../../shared/hooks';
import './post.css';

export const Post = () => {
  const { createPost, isLoading } = usePost();
  const { posts, isLoading: isLoadingPosts, error } = useFetchPosts();
  const [formState, setFormState] = useState({
    title: {
      value: "",
      isValid: false,
      showError: false,
    },
    description: {
      value: "",
      isValid: false,
      showError: false,
    },
    image: null,
  });
  const [message, setMessage] = useState('');

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value,
      },
    }));
  };

  const handleImageChange = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = value.trim() !== "";
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid,
        showError: !isValid
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: formState.title.value,
      description: formState.description.value,
      photo: formState.image,
    };

    const result = await createPost(data);
    if (result.error) {
      setMessage('Error al crear el post');
    } else {
      await refetch();
      setMessage('Post creado exitosamente');
    }
  };

  const isSubmitButtonDisabled = isLoading || !formState.title.isValid || !formState.description.isValid;

  return (
    <div className='body-container'>
      <div className='titlePost'>
        <h1>POST</h1>
        <hr />
      </div>
      <div className='content-container'>
        <div className='first-container'>
          <Input
            field='title'
            label='Title'
            value={formState.title.value}
            onChangeHandler={handleInputValueChange}
            type='text'
            onBlurHandler={handleInputValidationOnBlur}
            showErrorMessage={formState.title.showError}
            validationMessage='Title is required'
          />
          <h4>Description</h4>
          <Input
            field='description'
            textarea='Description'
            value={formState.description.value}
            onChangeHandler={handleInputValueChange}
            type='text'
            onBlurHandler={handleInputValidationOnBlur}
            showErrorMessage={formState.description.showError}
            validationMessage='Description is required'
          />
          <div className='button'>
            <button className="pushable" onClick={handleSubmit} disabled={isSubmitButtonDisabled}>
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front">ADD</span>
            </button>
          </div>
          {message && <p>{message}</p>}
        </div>
        <div className='posts-container'>
          {isLoadingPosts ? (
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
      </div>
    </div>
  );
};