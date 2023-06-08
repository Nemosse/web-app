import Image from 'next/image'
import style from './card.module.css'
// import ExampleCard from '@/assets/ex_card1.jpg'
import ExampleCard from '@/assets/ex_card1.jpg'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from "react";
import axios from 'axios';


export default function Card({
  disableHover,
  requestCard,
  cardShowCase,
  disableLink,
  card_name,
  cardData
}) {
  // const [cardData, setCardData] = useState(null);
  const [temporaryImage, setTemporaryImage] = useState(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-card', {
          params: {
            name: cardData.name
          }
        });
        // setCardData(response.data);
        // if (response.data.image_data) {
        //   const decodedImage = decodeBase64Image(response.data.image_data);
        //   setTemporaryImage(decodedImage);
        // }
        console.log(response.data.name)
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    fetchCardData();
  }, []);

  if (!cardData) {
    return <div>Loading...</div>;
  }

  const { name } = cardData;

  return (disableLink ?
    <>
      <div className={`${style['card-showbox']} ${!disableHover ? style['hoverable'] : style['disableHover']} ${requestCard ? style['requestCard'] : ''} ${cardShowCase ? style['cardShowCase'] : ''}`}>
        <Image src={ExampleCard} className={style['card']} />
      </div>
    </> :
    <>
      <div className={`${style['card-showbox']} ${!disableHover ? style['hoverable'] : style['disableHover']} ${requestCard ? style['requestCard'] : ''} ${cardShowCase ? style['cardShowCase'] : ''}`}>
      <Link href={`cards-library/card/${cardData.name.replace(/\s+/g, '-')}`}><Image src={ExampleCard} className={style['card']} /></Link>
      </div>
    </>
  )
}

function decodeBase64Image(base64Image) {
  const img = new Image();
  img.src = `data:image/jpeg;base64,${base64Image}`;
  return img;
}