import Image from 'next/image'
import ExampleCard from '@/assets/ex_card1.jpg'
import { useRef, useState, useEffect } from "react";
import Card from './card'
import axios from 'axios';


export default function RequestedCards() {

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [hideNext, setHideNext] = useState(false);
  const [numb, setNumb] = useState(0);
  const [cards, setCards] = useState([]);



  useEffect(() => {

    const fetchCards = async () => {
      try {
        const response = await axios.get('http://root:password@localhost:8000/api/cards');
        setCards(response.data);
        // console.log('test', response.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchCards();

    setWidth(carouselRef.current.offsetWidth);
    const childCount = trackRef.current?.childElementCount || 0;
    setNumb(childCount);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    setWidth(carouselRef.current.offsetWidth);
  }

  function handleNextClick(e) {
    e.preventDefault();
    setIndex(index + 1);
    const updatedIndex = index + 1
    if (updatedIndex >= (numb - 4)) {
      setHideNext(true);
    }
    else {
      setHideNext(false);
    }
    console.log(updatedIndex);
    console.log(numb);
  }

  function handlePrevClick() {
    setIndex(index - 1);
    setHideNext(false);
  }

  return (
    <>
      <div className='cl-cards-showcase'>
        <div className='csc-top cl-border'>
          <h1>Request Cards</h1>
        </div>
        <div className='cl-center carousel-container' ref={carouselRef}>
          <div className='cl-inner-carousel'>
            <div className='cl-cards-show track' ref={trackRef} style={{ transform: `translateX(${(-index) * 23.30}%)` }}>{/* translateX(${(-index) * (width)}px) */}
              {cards.map((card) => {
                if (
                  card.requested
                ) {
                  return <Card key={card.id} cardData={card} requestCard={true}/>;
                }
              })}
              {/* <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/>
              <Card requestCard={true}/> */}
              {/* <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div>
              <div className='cl-card-showbox'>
                <Image src={ExampleCard} className='card'/>
              </div> */}
            </div>
            <div className="cl-cr-nav">
              <button className={`cl-cr-prev ${index !== 0 ? `show` : ''}`} onClick={handlePrevClick} ref={prevRef}>prev</button>
              <button className={`cl-cr-next ${hideNext === true || numb <= 4 ? `hide` : ''}`} onClick={handleNextClick} ref={nextRef}>next</button>
            </div>
          </div>
        </div>
        <div className='csc-bottom cl-border'></div>
      </div>
    </>
  )
}
