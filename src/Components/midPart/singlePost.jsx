import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SinglePostCard from './component/singlePostCard';
import Left from '../LeftNav/LeftNav';
import RightTwo from '../RightParts/rightTwo';
import { Box, Skeleton, SkeletonCircle } from '@chakra-ui/react';

export default function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(postId)
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/postsdisplay/${postId}`,{
          method: "GET",
          headers: {
            "content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setPost(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div>
      <Left />
      <RightTwo userPost={post?.author} />
      <div className="post">
        {isLoading ? (
          <Box mt={2} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SkeletonCircle size="10" />
            <Skeleton height="20px" width="150px" />
            <Skeleton height="30px" mt={1} mb={1} />
            <Skeleton height="18px" />
            <Skeleton height="18px" />
            <Skeleton height="18px" />
          </Box>
        ) : (
          post && <SinglePostCard post={post} />
        )}
      </div>
    </div>
  );
}