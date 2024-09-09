import React from 'react';
import { useGetForums } from '../../shared/hooks/useGetForums';
import ForumCard from '../cards/forumCard';
import { useNavigate } from 'react-router-dom';
import './foro.css';

export const ForumList = () => {
    const { forums, loading, error } = useGetForums();
    const navigate = useNavigate();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const add = () => {
        navigate('/dashboard/forum');
    };

    return (
        <div className="discord2">
            <h2>Forums</h2>
            <div className="chat-window">
                {forums.length > 0 ? (
                    forums.map(forum => (
                        <ForumCard key={forum._id} forum={forum} />
                    ))
                ) : (
                    <div>No forums available</div>
                )}
                <div className="back-button-container">
                    <button onClick={add} className="back-button">Add</button>
                </div>
            </div>
        </div>
    );
};
