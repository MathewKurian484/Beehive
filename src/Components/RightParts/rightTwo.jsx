import { Avatar, Box, Button, Heading, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './right.css';
import { GiMailedFist } from 'react-icons/gi';
import PostCard from '../midPart/component/PostCard';

export default function RightTwo({ userPost = {} }) {
  const [singleUser, setSingleUser] = useState(userPost);
  const [user, setUser] = useState();
  const [followed, setFollowed] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const checkFollowed = async user => {
    if (userPost._id && user.following.includes(userPost._id)) {
      setIsLoadingUser(true);
      setFollowed(true);
      setIsLoadingUser(false);
    } else {
      setFollowed(false);
    }
  };

  const followUser = async userId => {
    try {
      setIsLoadingUser(true);
      await fetch(`http://localhost:5000/followUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: user.id }),
      });
      setFollowed(true);
      setIsLoadingUser(false);
    } catch (error) {
      console.error('Error following user:', error);
      setIsLoadingUser(false);
    }
  };

  const unfollowUser = async userId => {
    try {
      setIsLoadingUser(true);
      await fetch(`http://localhost:5000/unfollowUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: user.id }),
      });
      setFollowed(false);
      setIsLoadingUser(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setIsLoadingUser(false);
    }
  };

  const getUser = async token => {
    try {
      setIsLoadingUser(true);
      let res = await fetch(`http://localhost:5000/getUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      });
      let user = await res.json();
      setUser(user);
      setIsLoadingUser(false);
      checkFollowed(user);
    } catch (error) {
      console.log(error);
      setIsLoadingUser(false);
    }
  };

  const getPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await fetch("http://localhost:5000/posts", {
        method: "GET",
        headers: {
          "content-Type": "application/json",
        }
      });
      const data = await response.json();
      setPosts(data);
      setIsLoadingPosts(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUser(localStorage.getItem('token'));
    }
    getPosts();
  }, []);

  return (
    <div className="right">
      <div>
        {isLoadingUser ? (
          <Box className="loading" ml="40px" mt={15} mb={5}>
            <SkeletonCircle size="20" margin="auto" mt={5} />
          </Box>
        ) : (
          <>
            {singleUser._id ? (
              <>
                <div
                  style={{
                    margin: 'auto',
                    marginTop: '40px',
                    marginBottom: '20px',
                  }}
                >
                  <Avatar size={'xl'} name={singleUser.name} src={singleUser.avatar}/>
                </div>
                <div>
                  <Heading size="lg" textAlign="center">
                    {singleUser.name}
                  </Heading>
                </div>
                <br />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <Heading size="xs" fontWeight={500} textAlign="center">
                    Following : {singleUser.following.length}
                  </Heading>
                  <Heading size="xs" fontWeight={500} textAlign="center">
                    Followers : {singleUser.followers.length}
                  </Heading>
                  <Heading size="xs" fontWeight={500} textAlign="center">
                    User since : {singleUser.createdAt.split('T')[0]}
                  </Heading>
                </div>
                {
                  user && user._id === singleUser._id ? (<h1 style={{marginTop:"40px", marginBottom:"40px"}}></h1>) : <>
                  <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '30px',
                  }}
                >
                  {followed ? (
                    <Button
                      onClick={() => {
                        unfollowUser(singleUser._id);
                      }}
                      style={{
                        backgroundColor: 'white',
                        color: 'green',
                        width: '120px',
                        margin: '0px',
                        border: '.1px solid green',
                      }}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        followUser(singleUser._id);
                      }}
                      style={{
                        backgroundColor: 'green',
                        width: '120px',
                        margin: '0px',
                      }}
                    >
                      Follow
                    </Button>
                  )}
                  <Button
                    style={{
                      width: '50px',
                      borderRadius: '50%',
                      backgroundColor: 'green',
                      margin: '0px',
                    }}
                  >
                    <GiMailedFist />
                  </Button>
                </div>
                  </>
                }
              </>
            ) : null}
          </>
        )}
      </div>
      <Heading as="h4" marginLeft={10} marginTop={7} marginBottom={5} fontSize={20} fontWeight={500} className="li-tag">
        More Posts
      </Heading>
      <div className="topic">
        {isLoadingPosts ? (
          <Box mt={2} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box mt={5} style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <SkeletonCircle size="10" />
              <Skeleton height="20px" margin='auto' ml={0} mr={0} width='150px' />
              <Skeleton height="20px" margin="auto" ml={0} width='100px' />
            </Box>
            <Skeleton height="30px" mt={1} mb={1} />
            <Skeleton height="18px" />
            <Skeleton height="18px" />
            <Skeleton height="18px" />
            <Box style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <Skeleton height="15px" width={100} />
              <Skeleton height="15px" width={150} />
            </Box>
          </Box>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}