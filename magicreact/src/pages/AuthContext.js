import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Anonymous from '@/assets/anonymous_profile.png';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [error_code, setErrorCode] = useState(0);
  const [displayname, setDisplayname] = useState(null);
  const [profileImage, setProfileImage] = useState(Anonymous);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on initial load
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const response = await axios.get('http://root:password@localhost:8000/api/check-authentication', {
        withCredentials: true,
      });
      const data = response.data;

      if (data.authentication) {
        setAuthenticated(true);
        setUserId(data.user_id);
        setUsername(data.username);
        setIsAdmin(data.isAdmin)
        if (data.image) {
          setProfileImage(data.image);
        }
        loadImage();
      } else {
        setAuthenticated(false);
        setUserId(null);
        setUsername(null);
        setProfileImage(Anonymous);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking user authentication:', error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        'http://root:password@localhost:8000/api/log-in',
        { username: username, password: password },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data)

      if (data.authentication) {
        setAuthenticated(true);
        setUserId(data.user_id);
        setUsername(data.username);
        setDisplayname(shorterUsername(data.username));
        setIsAdmin(data.isAdmin);
        if (data.image) {
          setProfileImage(data.image);
        }
        loadImage();
        router.push('/');
      } else {
        setAuthenticated(false);
        setUserId(null);
        setUsername(null);
        setProfileImage(Anonymous);
        setIsAdmin(false);
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        'http://root:password@localhost:8000/api/log-out',
        null,
        {
          withCredentials: true,
        }
      );
      setAuthenticated(response.data.authentication);
      setUserId(null);
      setUsername(null);
      setDisplayname(shorterUsername('username'));
      setProfileImage(Anonymous);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const register = async (username, email, password, confirm_password) => {
    try {
      const response = await axios.post(
        'http://root:password@localhost:8000/api/register',
        { username: username, email: email, password: password, confirm_password: confirm_password }
      );
      const data = await response.data;

      console.log(data.authentication);
      console.log(data.message);
      console.log(data.username);
      if (data.authentication) {
        setAuthenticated(true);
        setUserId(data.user_id);
        setUsername(data.username);
        console.log('Registration Success');
        setDisplayname(shorterUsername(data.username));
        setIsAdmin(data.isAdmin)
        if (data.image) {
          setProfileImage(data.image);
        }
        loadImage();
        router.push('/');
      } else {
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const shorterUsername = (username) => {
    // Logic to shorten the username if necessary
    if (username.length > 6) {
      return username.substring(0, 6) + "-";
    }
    return username;
  };

  const loadImage = async () => {
    if (profileImage !== Anonymous) {
      try {
        const response = await axios.post(
          'http://root:password@localhost:8000/api/get-profile-picture',
          { username: username }
        );
        const imageURL = response.data.image; // Retrieve the image URL from the response
  
        const image = new Image();
        image.src = imageURL;
  
        const loadImageDimensions = () => {
          const { width, height } = image.getBoundingClientRect();
          if (width !== 0 && height !== 0) {
            setProfileImage({
              src: imageURL,
              width: width,
              height: height,
            });
          } else {
            setTimeout(loadImageDimensions, 100);
          }
        };
  
        image.onload = loadImageDimensions;
      } catch (error) {
        console.error('Error loading image:', error);
        setProfileImage(Anonymous);
      }
    }
  };

  const contextValue = {
    authenticated,
    userId,
    username,
    displayname,
    profileImage,
    error_code,
    login,
    logout,
    register,
    isAdmin
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;