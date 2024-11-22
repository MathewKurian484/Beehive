import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Left from '../LeftNav/LeftNav';
import Right from '../RightParts/right';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import PostCard from '../midPart/component/PostCard'; // Update the path to the correct location

function Bookmark() {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else {
      fetchLikedPosts();
    }
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/likedPosts/${user.id}`);
      const data = await response.json();
      setLikedPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Left />
      <Right />
      <div style={{ marginLeft: '17%', marginRight: '36%', marginTop: '53px', width: '47%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Heading
            style={{
              fontFamily: "sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            Liked Posts
          </Heading>
        </div>
        <Box mt={4}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : likedPosts.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {likedPosts.map((post) => (
                <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                  <PostCard post={post} loggedPosts={true} />
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No liked posts found.</Text>
          )}
        </Box>
      </div>
    </>
  );
}

export default Bookmark;