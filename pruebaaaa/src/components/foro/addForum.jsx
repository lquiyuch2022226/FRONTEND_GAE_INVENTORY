import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createForum } from '../../services/api';

import './foro.css';

export const AddForum = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await createForum({ title, type });
        if (result.error) {
            setError(result.message);
        } else {
            navigate('/dashboard/forums');
        }
    };

    const volver = () => {
        navigate('/dashboard/forums');
    };

    return (
        <div className='discord2'>
            <button onClick={volver} className="back-button">Back</button>
            <h2>Add New Forum</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} className="chat-input">
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="description"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Forum</button>
            </form>
        </div>
    );
};
