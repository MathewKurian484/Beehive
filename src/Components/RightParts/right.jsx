import React, { useState } from 'react';
import { HStack, Avatar, Heading, Box, Input, Button, Text, VStack, Center } from '@chakra-ui/react';
import './right.css';
import PostCard from '../midPart/component/PostCard'; // Update the path to the correct location

export default function Right() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/searchPosts?keyword=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className='right'>
      <Box mb={6}></Box>
      <Box mb={6}> {/* Add margin-bottom to move the search bar down */}
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts or users"
          mb={4}
        />
        <Button onClick={handleSearch} colorScheme="blue" mb={4}>
          Search
        </Button>
      </Box>
      <Box
        maxHeight="400px"
        overflowY="auto"
        border="1px solid #e2e8f0"
        borderRadius="md"
        p={4}
      >
        {searchResults.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {searchResults.map((post) => (
              <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                <PostCard post={post} />
              </Box>
            ))}
          </VStack>
        ) : (
          <Center>
            <Text>No results found</Text>
          </Center>
        )}
      </Box>
    </div>
  );
}