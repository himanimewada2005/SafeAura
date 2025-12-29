import React, { useState } from 'react';
//import HeroSection from '../components/TutHero';
import VideoSearchSection from '../components/TutVideo';
import TutorialSection from '../components/Tuttut';
import EmergencySection from '../components/TutEm';
import RightsSection from '../components/TutRt';
import EventsSection from '../components/TutEv';
import StoriesSection from '../components/TutSt';
//import FooterCTA from '../components/FooterCTA';
import TutorialModal from '../components/TutMd';
import styles from "../CSS/Tut.module.css";

function Tutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialType, setTutorialType] = useState('');

  const openTutorial = (type) => {
    setTutorialType(type);
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className={styles.tutPage}>
      
      
      <VideoSearchSection />
    
      <TutorialSection openTutorial={openTutorial} />
      <EmergencySection />
      <RightsSection />
      <EventsSection />
      <StoriesSection />
      

      {showTutorial && (
        <TutorialModal type={tutorialType} onClose={closeTutorial} />
      )}
    </div>
  );
}

export default Tutorial;