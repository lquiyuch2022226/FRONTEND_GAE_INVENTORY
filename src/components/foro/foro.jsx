import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetForum } from '../../shared/hooks/useGetForum';
import { useAddCommentForo } from '../../shared/hooks/useAddCommentForo';
import notRegisterImage from '../../assets/img/notRegister.jpeg'

import './foro.css';

export const Foro = () => {

    const { id } = useParams();
    const { forum, loading, error: fetchError } = useGetForum(id);
    const { addComment, error: addCommentError } = useAddCommentForo();
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleNewComment = async () => {
        if(forum && forum.title) {
            await addComment(forum.title, username, newComment);
            setNewComment('');
            setUsername('');
            window.location.reload();
        }else{
            setAddCommentError("Forum title is missing.");
        }
    };

    const volver = () => {
        navigate('/dashboard/forums');
    };

    if(loading) return <div>Loading...</div>;
    if(fetchError) return <div>Error: {fetchError}</div>;
    if(!forum) return <div>No forum found</div>;

    console.log(forum)
    console.log('Forum title:', forum ? forum.title : 'No forum object');

    return(
        <div className='discord2'>
            <button onClick={volver} className="back-button">Back</button>
            <h2>{forum.title}</h2>
            <div className="chat-window">
                {forum.comentaries && forum.comentaries.length > 0 ? (
                    forum.comentaries.map(comment => (
                        <div key={comment._id} className="chat-message">
                            <strong>{comment.user}:</strong> {comment.text}
                            <br />
                            <small>{new Date(comment.fecha).toLocaleString()}</small>
                        </div>
                    ))
                ) : (
                    <div>
                        <img src={notRegisterImage} alt="" height='50px'/>
                        <br />
                        <span style={{ color: 'black', fontFamily: 'revert-layer'}}>Sorry, not message yet</span>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleNewComment}>Send</button>
            </div>
            {addCommentError && <div>Error: {addCommentError}</div>}
        </div>
    )
}