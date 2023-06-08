import { useState, useEffect } from 'react';

export default function Home({
  text
}) { 
  const [backgroundSize, setBackgroundSize] = useState(150);
  const [opacity, setOpacity] = useState(1);

  const handleScroll = () => {
    setBackgroundSize(150 - window.pageYOffset/12);
    setOpacity(1 - window.pageYOffset/700);
  };

  // Add an event listener for scrolling when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
    };
  }, []);


  return (
    <>
      <div className='slidershow' id="slideshow" style={{ backgroundSize: `${backgroundSize}%`, opacity: opacity}}>      
        <h1 className='slidershow-text'>{text}</h1>
      </div>

    </>
  )
}