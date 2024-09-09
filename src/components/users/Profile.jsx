// src/components/Profile.js
import React, { useEffect } from 'react';
import { useProfile } from '../../shared/hooks/useProfile';
import { useUserDetails } from "../../shared/hooks/useUserDetails"
import { Navbar } from "../../components/Navbar";
import './profile.css';

export const Profile = () => {

    const { user, loading, error, fetchUserProfile } = useProfile();
    const { username } = useUserDetails();


    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading profile: {error}</p>;

    return (
        <div className="profile-container">
            <Navbar user={username} />
            {user && (
                <div className="profile-details">
                    <h2>{user.name}</h2>
                    <p>Username: {user.username}</p>
                    <p>Role: {user.role}</p>
                    <p>Progress: {user.progress}</p>
                    <p>Vices: {user.vices}</p>
                </div>
            )}
        </div>
    );
};
