import React from 'react';
import { Heading, HStack, Text, Box, Avatar } from '@chakra-ui/react';
import { BsDot, BsFillHeartFill } from 'react-icons/bs';
import { useNavigate, Link } from 'react-router-dom';

export default function SinglePostCard({ post = {} }) {
  const navigate = useNavigate();
  const [liked, setLiked] = React.useState(false);
  const [user, setUser] = React.useState({});

  const handleLike = () => {
    if (liked) {
      dislikePost();
    } else {
      likePost();
    }
  };

  const likePost = async () => {
    try {
      await fetch(`http://localhost:5000/likePost/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('user'),
        },
      });
      setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const dislikePost = async () => {
    try {
      await fetch(`http://localhost:5000/dislikePost/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('user'),
        },
      });
      setLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkLiked = (user) => {
    let check = post.likes && post.likes.includes(user.id);
    if (check) {
      setLiked(true);
    } else {
      setLiked(false);
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

  React.useEffect(() => {
    if (localStorage.getItem('user')) {
      getUser(localStorage.getItem('user'));
    }
  }, []);

  const handleAuthorClick = () => {
    navigate(`/AuthorAcc/${post.user_id}`);
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
          <BsFillHeartFill
            onClick={handleLike}
            className="heart-icon"
            color={liked ? 'rgb(207, 55, 38)' : 'gray'}
            size={25}
            style={{ marginLeft: '100px' }}
          />
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
}