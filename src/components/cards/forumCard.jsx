import React from 'react';
import { useNavigate } from 'react-router-dom';
import './forumCard.css';

const ForumCard = ({ forum }) => {
    const navigate = useNavigate();

    const handleViewComments = () => {
        navigate(`/dashboard/forum/${forum._id}`);
    };

    return (
        <div className="forum-card">
            <h3 className="forum-title">{forum.title}</h3>
            <p className="forum-type">Description: {forum.type}</p>
            <button className="view-comments-btn" onClick={handleViewComments}>
                View Comments
            </button>
        </div>
    );
};

export default ForumCard;