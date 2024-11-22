import { Heading, Box, VStack, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Left from '../LeftNav/LeftNav';
import Right from '../RightParts/right';
import PostCard from '../midPart/component/PostCard'; // Update the path to the correct location

function Notification() {
  const navigate = useNavigate();
  const [followedPosts, setFollowedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/');
    } else {
      fetchFollowedPosts();
    }
  }, []);

  const fetchFollowedPosts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/followedPosts/${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFollowedPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching followed posts:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Left />
      <Right />
      <div style={{ marginLeft: '17%', marginRight: '36%', marginTop: '53px', width: '47%' }}>
        <Heading
          style={{
            fontFamily: "sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
          fontSize="42px"
          fontWeight={700}
        >
          Notifications
        </Heading>
        <Box mt={4}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : followedPosts.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {followedPosts.map((post) => (
                <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                  <PostCard post={post} loggedPosts={true} />
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No new posts from followed accounts.</Text>
          )}
        </Box>
      </div>
    </>
  );
}

export default Notification;