import React from 'react';
import { Avatar, Box, HStack, Heading, Text, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BsDot } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function PostCard({ post, loggedPosts }) {
  const toast = useToast();

  const getDate = (createdAt) => {
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    let date = createdAt.split('T')[0].split('-').map(Number);
    return `${date[2]} ${months[date[1] - 1]}`;
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        toast({
          title: 'Post deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Optionally, you can remove the post from the UI here
      } else {
        toast({
          title: 'Failed to delete post.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error deleting post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="post-card" style={{ marginTop: 10 }}>
      <HStack spacing='15px' mt={8}>
        <Avatar size='sm' name={post.author} src={post.avatar} />
        <Heading fontWeight={500} size='sm'>{post.author}</Heading>
        <BsDot />
        <Heading fontWeight={500} size='xs'>{getDate(post.createdAt)}</Heading>
        {loggedPosts && (
          <RiDeleteBin6Line
            onClick={() => handleDeletePost(post.id)}
            size={20}
            className='delete-button'
            style={{ marginLeft: "20px" }}
          />
        )}
      </HStack>
      <Link to={`/homepage/${post.id}`}>
        <Heading
          style={{
            fontFamily: "sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
          as='h4'
          fontSize={22}
          mt={3}
        >
          {post.title}
        </Heading>
        <Text
          style={{
            fontFamily: "charter, Georgia, Cambria, 'Times New Roman', Times, serif",
            color: "rgba(41, 41, 41, 1)",
            letterSpacing: ".2px"
          }}
          fontSize="16px"
          mt={3}
        >
          {post.content.substring(0, 250)} . . . .
        </Text>
        <HStack spacing='5px' mt={4}>
          <Text fontSize='13px' color='rgba(117, 117, 117, 1)'>{Math.round(Math.random() * 7 + 1)} min read</Text>
          <BsDot />
          <Text fontSize='13px' color='rgba(117, 117, 117, 1)'>Selected for you</Text>
        </HStack>
      </Link>
    </Box>
  );
}



