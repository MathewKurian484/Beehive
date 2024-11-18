import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, VStack, useToast, Avatar } from '@chakra-ui/react';
import PostCard from '../midPart/component/PostCard'; // Update the path to the correct location
import { useNavigate, Link } from 'react-router-dom';
import './account.css';

export default function Account() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user')).id;
      try {
        const userResponse = await fetch(`http://localhost:5000/getSingleUser/${userId}`);
        const userData = await userResponse.json();
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
        setPassword(userData.password);


        const postsResponse = await fetch(`http://localhost:5000/getPostsByUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId}),
        });
        const postsData = await postsResponse.json();
        console.log(postsData)
        setPosts(Array.isArray(postsData) ? postsData : []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const userId = (JSON.parse(localStorage.getItem('user'))).id;
    console.log(userId, name , email, password)
    try {
      const response = await fetch(`http://localhost:5000/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, name, email, password }),
      });
      const data = await response.json();
      console.log(data)
      if (data.error) {
        toast({
          title: 'Error updating user.',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'User updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUser({ ...user, name, email, password });
        localStorage.setItem('user', JSON.stringify({ ...user, name, email, password }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    try {
      const response = await fetch(`http://localhost:5000/deleteUser/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.error) {
        toast({
          title: 'Error deleting user.',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'User deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Box className="account-container">
      <Heading className="account-heading">Account Details</Heading>
      <VStack className="account-details" spacing={4} align="stretch">
        <Box>
          <Text>Name</Text>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Box>
        <Box>
          <Text>Email</Text>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Box>
        <Box>
          <Text>Password</Text>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Box>
        <Button id="account-update-button" onClick={handleUpdate} colorScheme="blue">Update</Button>
        <Button id="account-delete-button" onClick={handleDelete} className="delete-button">Delete Account</Button>
      </VStack>
      <Heading className="posts-heading">Your Posts</Heading>
      <Box className="posts-container">
        {isLoading ? (
          <Text className="loading-text">Loading...</Text>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} loggedPosts={true} />
          ))
        )}
      </Box>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
        <Link to="/homepage">
          <Button style={{ backgroundColor: "green", color: "white", borderRadius: "100px", margin: "auto", fontWeight: "450", fontFamily: "sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Homepage</Button>
        </Link>
      </div>
    </Box>
  );
}