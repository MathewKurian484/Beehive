import React from 'react';

export const LeftNavContext = React.createContext();

export function LeftNavProvider({ children }) {
  const [home, setHome] = React.useState(true);
  const [noti, setNoti] = React.useState(false);
  const [book, setBook] = React.useState(false);
  const [story, setStory] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const handleClick = (button) => {
    if (button === 'home') {
      setHome(true);
      setNoti(false);
      setBook(false);
      setStory(false);
    } else if (button === 'noti') {
      setHome(false);
      setNoti(true);
      setBook(false);
      setStory(false);
    } else if (button === 'book') {
      setHome(false);
      setNoti(false);
      setBook(true);
      setStory(false);
    } else if (button === 'story') {
      setHome(false);
      setNoti(false);
      setBook(false);
      setStory(true);
    }
  };

  const getUser = async (token) => {
    try {
      token = token || localStorage.getItem('user');
      let res = await fetch(`http://localhost:5000/getUser/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token
        }
      });
      let user = await res.json();
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('user')) {
      getUser(localStorage.getItem('user'));
    }
  }, []);

  return (
    <LeftNavContext.Provider value={{ home, noti, book, story, handleClick, user, setUser }}>
      {children}
    </LeftNavContext.Provider>
  );
}