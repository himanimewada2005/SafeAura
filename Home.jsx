// pages/Home.jsx
import React from "react";
import Carousel from "../components/Carousel";
import Statistics from "../components/Statistics";
import About from "../components/About";
import News from "../components/News";

const Home = () => {
  return (
    <div className="flex flex-col w-full animate-fadeIn">
      <Carousel />
      <Statistics />
      <About />
      <News />
    </div>
  );
};

export default Home;
