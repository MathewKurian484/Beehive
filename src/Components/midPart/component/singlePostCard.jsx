import React, { useState, useEffect } from 'react';
import { Box, HStack, Avatar, Heading, Text, useToast } from '@chakra-ui/react';
import { BsDot, BsFillHeartFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const SinglePostCard = ({ post, liked }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState({});

  const handleLike = () => {
    if (isLiked) {
      dislikePost();
    } else {
      likePost();
    }
  };

  const likePost = async () => {
    if (isLiked) return; // Prevent liking the post multiple times

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(`http://localhost:5000/likePost/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      toast({
        title: 'Liked post',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const dislikePost = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(`http://localhost:5000/dislikePost/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      setIsLiked(false);
      setLikeCount(likeCount - 1);
      toast({
        title: 'Disliked post',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkLiked = (user) => {
    let check = post.likes && post.likes.includes(user.id);
    if (check) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  const getDate = (createdAt) => {
    if (!createdAt) return '';
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let date = createdAt.split('T')[0].split('-').map(Number);
    return `${date[2]} ${months[date[1] - 1]}`;
  };

  const getUser = async (token) => {
    try {
      let res = await fetch(`http://localhost:5000/getUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      });
      let user = await res.json();
      setUser(user);
      checkLiked(user);
    } catch (error) {
      console.log(error);
    }
  };

  const isLiking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/isLiking/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await response.json();
      setIsLiked(data.isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const getLikeCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/likeCount/${post.id}`);
      const data = await response.json();
      setLikeCount(data.likeCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      getUser(localStorage.getItem('user'));
      isLiking();
      getLikeCount();
    }
  }, []);

  const handleAuthorClick = () => {
    navigate(`/authoracc/${post.user_id}`);
  };

  return (
    <div>
      <Box style={{ marginTop: 10 }}>
        <HStack spacing="25px" mt={8}>
          <Avatar
            name={post.author}
            src={post.avatar}
            style={{ cursor: 'pointer' }}
            onClick={handleAuthorClick}
          />
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <Heading as="h5" size="sm">
              {post.author?.name}
            </Heading>
            <div style={{ width: '120px', display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
              <Text fontSize="xs">{Math.round(Math.random() * 7 + 1)} min read</Text>
              <BsDot style={{ margin: 'auto' }} />
              <Text fontSize="xs">{getDate(post.createdAt)}</Text>
            </div>
          </div>
          <HStack spacing="5px" alignItems="center">
            <BsFillHeartFill
              onClick={handleLike}
              className="heart-icon"
              color={isLiked ? 'rgb(207, 55, 38)' : 'gray'}
              size={25}
              style={{ cursor: 'pointer' }}
            />
            <Text fontSize="md">{likeCount}</Text>
          </HStack>
        </HStack>
        <Heading
          style={{
            fontFamily: "sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
          fontSize="32px"
          fontWeight={700}
          mt={7}
        >
          {post.title}
        </Heading>
        <Text
          style={{
            fontFamily: "charter, Georgia, Cambria, 'Times New Roman', Times, serif",
            lineHeight: '32px',
            color: 'rgba(41, 41, 41, 1)',
            overflowWrap: 'break-word',
          }}
          fontWeight={400}
          fontSize="20px"
          mt={6}
        >
          {post.content}
        </Text>
      </Box>
    </div>
  );
};

export default SinglePostCard;