import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Avatar, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, HStack } from '@chakra-ui/react';
import PostCard from '../midPart/component/PostCard'; // Update the path to the correct location
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './authoracc.css'; // Import the new CSS file

const AuthorAcc = () => {
  const { user_id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/authors/${user_id}`);
        const data = await response.json();
        setAuthor(data.author);
        setPosts(data.posts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching author details:', error);
        setIsLoading(false);
      }
    };

    const checkIfFollowing = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;
      const authorId = user_id;
      try {
        const response = await fetch(`http://localhost:5000/isFollowing/${userId}/${authorId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error('Error checking following status:', error);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/followerCount/${user_id}`);
        const data = await response.json();
        setFollowerCount(data.followerCount);
      } catch (error) {
        console.error('Error fetching follower count:', error);
      }
    };

    const fetchFollowers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/followers/${user_id}`);
        const data = await response.json();
        setFollowers(data.followers || []);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchAuthorDetails();
    checkIfFollowing();
    fetchFollowerCount();
    fetchFollowers();
  }, [user_id]);

  const handleFollow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    const authorId = user_id;

    if (isFollowing) {
      toast({
        title: `You are already following ${author.name}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/followUser/${authorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: userId }),
      });

      if (response.ok) {
        setIsFollowing(true);
        setFollowerCount(followerCount + 1);
        toast({
          title: `Following ${author.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Failed to follow user');
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    const authorId = user_id;

    try {
      const response = await fetch(`http://localhost:5000/unfollowUser/${authorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: userId }),
      });

      if (response.ok) {
        setIsFollowing(false);
        setFollowerCount(followerCount - 1);
        toast({
          title: `Unfollowed ${author.name}`,
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

  const handleGoToHomepage = () => {
    navigate('/homepage');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!author) {
    return <Text>Author not found</Text>;
  }

  return (
    <Box className="author-container">
      <VStack spacing={5} align="stretch">
        <Button
          id="go-to-homepage-button"
          onClick={handleGoToHomepage}
          colorScheme="green"
          style={{ width: '150px' }}
        >
          Go to Homepage
        </Button>
        <Avatar name={author.name} src={author.avatar} size="xl" className="author-avatar" />
        <Heading as="h2" size="xl" className="author-name">
          {author.name}
        </Heading>
        <Text fontSize="lg" className="author-email">{author.email}</Text>
        <Button onClick={handleOpenModal} colorScheme="teal" variant="link">
          Followers: {followerCount}
        </Button>
        {isFollowing ? (
          <Button onClick={handleUnfollow} colorScheme="red" style={{ width: '150px' }}>
            Unfollow
          </Button>
        ) : (
          <Button onClick={handleFollow} colorScheme="blue" style={{ width: '150px' }}>
            Follow
          </Button>
        )}
        <Heading as="h3" size="lg" mt={5} className="posts-heading">
          Posts by {author.name}
        </Heading>
        <Box className="posts-container">
          {posts.map((post) => (
            <Box key={post.id} className="post-card">
              <PostCard post={post} />
            </Box>
          ))}
        </Box>
      </VStack>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
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
                </HStack>
              ))
            ) : (
              <Text>No followers found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AuthorAcc;