import React from 'react';
import Places from '../components/Places';
import Header from './homepage/Header';
import Plan from './homepage/Plan';
import AgentAvatar from './homepage/AgentAvatar';
import Articles from './homepage/Articles';
import Booking from '../components/modals/Booking'

const Home = () => {
  return (
    <>
      <Header />
      <Booking />
      <Plan />
      <AgentAvatar />
      <Articles />
    </>
  );
};

export default Home;
