"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

export const UserDetailContext = createContext(null);

function Provider({ children }) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState(null);

    useEffect(() => {
        if (user && !userDetail) {
            CreateNewUser();
        }
    }, [user, userDetail]);

    const CreateNewUser = async () => {
        try {
            const result = await axios.post('/api/user', {
                name: user?.fullName,
                email: user?.primaryEmailAddress?.emailAddress
            });
            setUserDetail(result.data);
        } catch (error) {
            console.error("Error creating or fetching user:", error);
        }
    };

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div> {children} </div>
        </UserDetailContext.Provider>
    );
}

export default Provider;

export const useUserDetail = () => {
  const context = useContext(UserDetailContext);
  if (context === undefined) {
    throw new Error('useUserDetail must be used within a Provider');
  }
  return context;
};