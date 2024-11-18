import React from 'react';
import Left from '../LeftNav/LeftNav';
import Posts from '../midPart/Posts';
import Right from '../RightParts/right';
import { useNavigate } from 'react-router-dom';
import { LeftNavContext } from '../../Context/LeftNavContext';

function HomepageAS() {
  const navigate = useNavigate();
  const { handleClick, setUser } = React.useContext(LeftNavContext);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
    handleClick('home');
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Left />
      <Right />
      <Posts />
    </div>
  );
}

export default HomepageAS;