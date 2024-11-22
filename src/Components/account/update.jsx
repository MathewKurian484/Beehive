import React, { useState, useEffect } from 'react';
import { Box, HStack, Avatar, Heading, Text, Input, Textarea, Button, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [post, setPost] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/postsdisplay/${postId}`);
        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await fetch(`http://localhost:5000/updateposts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, user_id: user.id }),
      });
      toast({
        title: 'Post updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/account');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box style={{ marginTop: 10 }}>
      <HStack spacing="25px" mt={8}>
        <Avatar name={post.author} src={post.avatar} />
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Heading as="h5" size="sm">
            {post.author?.name}
          </Heading>
          <div style={{ width: '120px', display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
            <Text fontSize="xs">{Math.round(Math.random() * 7 + 1)} min read</Text>
            <Text fontSize="xs">{new Date(post.createdAt).toLocaleDateString()}</Text>
          </div>
        </div>
      </HStack>
      <Box mt={4}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          size="lg"
          mb={4}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          size="lg"
          rows={10}
        />
        <Button onClick={handleUpdate} colorScheme="blue" mt={4}>
          Update Post
        </Button>
      </Box>
    </Box>
  );
};

export default UpdatePost;