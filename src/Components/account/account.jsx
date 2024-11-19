import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, VStack, useToast, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, HStack, Spacer } from '@chakra-ui/react';
import PostCard from '../midPart/component/PostCard'; // Update the path to the correct location
import { useNavigate } from 'react-router-dom';
import './account.css';

export default function Account() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
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
          body: JSON.stringify({ id: userId }),
        });
        const postsData = await postsResponse.json();
        setPosts(Array.isArray(postsData) ? postsData : []);
        setIsLoading(false);

        const followerCountResponse = await fetch(`http://localhost:5000/followerCount/${userId}`);
        const followerCountData = await followerCountResponse.json();
        setFollowerCount(followerCountData.followerCount);

        const followersResponse = await fetch(`http://localhost:5000/followers/${userId}`);
        const followersData = await followersResponse.json();
        setFollowers(followersData.followers || []);

        const followingResponse = await fetch(`http://localhost:5000/following/${userId}`);
        const followingData = await followingResponse.json();
        setFollowing(followingData.following || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    try {
      const response = await fetch(`http://localhost:5000/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, name, email, password }),
      });
      const data = await response.json();
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

  const handleGoToHomepage = () => {
    navigate('/homepage');
  };

  const handleOpenFollowersModal = () => {
    setIsFollowersModalOpen(true);
  };

  const handleCloseFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };

  const handleOpenFollowingModal = () => {
    setIsFollowingModalOpen(true);
  };

  const handleCloseFollowingModal = () => {
    setIsFollowingModalOpen(false);
  };

  const handleUnfollow = async (followerId) => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    try {
      const response = await fetch(`http://localhost:5000/unfollowUser/${followerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: userId }),
      });

      if (response.ok) {
        setFollowers(followers.filter(follower => follower.id !== followerId));
        setFollowerCount(followerCount - 1);
        toast({
          title: 'Unfollowed successfully.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <Box className="account-container">
      <VStack spacing={5} align="stretch">
        <Button
          id="go-to-homepage-button"
          onClick={handleGoToHomepage}
          colorScheme="green"
          style={{ width: '150px' }}
        >
          Go to Homepage
        </Button>
        <Avatar name={user.name} src={user.avatar} size="xl" className="account-avatar" />
        <Heading as="h2" size="xl" className="account-heading">
          {user.name}
        </Heading>
        <Text fontSize="lg" className="account-email">{user.email}</Text>
        <Button onClick={handleOpenFollowersModal} colorScheme="teal" variant="link">
          Followers: {followerCount}
        </Button>
        <Button onClick={handleOpenFollowingModal} colorScheme="teal" variant="link">
          Following: {following.length}
        </Button>
        <Box>
          <Text>Name</Text>
          <Input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '400px' }} />
        </Box>
        <Box>
          <Text>Email</Text>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '400px' }} />
        </Box>
        <Box>
          <Text>Password</Text>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '400px' }} />
        </Box>
        <Button
          id="account-update-button"
          onClick={handleUpdate}
          colorScheme="blue"
          style={{ width: '150px' }}
        >
          Update
        </Button>
        <Button
          id="account-delete-button"
          onClick={handleDelete}
          className="delete-button"
          style={{ width: '150px' }}
        >
          Delete Account
        </Button>
      </VStack>
      <Heading className="posts-heading">Your Posts</Heading>
      <Box className="posts-container">
        {isLoading ? (
          <Text className="loading-text">Loading...</Text>
        ) : (
          posts.map((post) => (
            <Box key={post.id} className="post-card">
              <PostCard post={post} loggedPosts={true} />
            </Box>
          ))
        )}
      </Box>

      <Modal isOpen={isFollowersModalOpen} onClose={handleCloseFollowersModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Followers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {followers.length > 0 ? (
              followers.map((follower) => (
                <HStack key={follower.id} spacing={4} mb={4}>
                  <Avatar name={follower.name} src={follower.avatar} />
                  <Text>{follower.name}</Text>
                  <Spacer />
                  <Button onClick={() => handleUnfollow(follower.id)} colorScheme="red" size="sm">
                    Unfollow
                  </Button>
                </HStack>
              ))
            ) : (
              <Text>No followers found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseFollowersModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFollowingModalOpen} onClose={handleCloseFollowingModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Following</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {following.length > 0 ? (
              following.map((followedUser) => (
                <HStack key={followedUser.id} spacing={4} mb={4}>
                  <Avatar name={followedUser.name} src={followedUser.avatar} />
                  <Text>{followedUser.name}</Text>
                </HStack>
              ))
            ) : (
              <Text>Not following anyone.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseFollowingModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}