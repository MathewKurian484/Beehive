import React, { useState } from 'react';
import { HStack, Avatar, Heading, Box, Input, Button, Text } from '@chakra-ui/react';
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
      <div>
        <button>Get unlimited access</button>
      </div>
      <div>
        <Input
          type="text"
          id='search'
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div>
        {searchResults.length > 0 ? (
          searchResults.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <Text>No search results found.</Text>
        )}
      </div>
    </div>
  );
}