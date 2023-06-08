import Image from 'next/image'
import style from './cards_library.module.css'
import filterIm from '@/assets/filter.png'
import searchBtn from '@/assets/searchbutton.png'
import Card from '@/components/cards/card'
import { AuthContext } from '@/pages/AuthContext.js';
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import axios from 'axios';


export default function Card_Library() {
  const [card_id, setCardID] = useState(null)
  const [card_name, setCardName] = useState('')
  const [request_card_name, setRequestCardName] = useState('')
  const [expansion_set, setExpansionSet] = useState(null)
  const [mana_cost, setManaCost] = useState(null)
  const [power, setPower] = useState(null)
  const [toughness, setToughness] = useState(null)
  const [card_type, setCardType] = useState(null)
  const [ability, setAbility] = useState(null)
  const [flavor_text, setFlavorText] = useState(null)
  const [quote, setQuote] = useState(null)
  const [image_data, setImageData] = useState(null)
  const [request_image_data, setRequestImageData] = useState(null)
  const addCardDropDownRef = useRef(null);
  const requestCardDropDownRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { authenticated, isAdmin } = useContext(AuthContext);

  const handleCardIDChange = (e) => {
    setCardID(e.target.value);
  };

  const handleCardNameChange = (e) => {
    setCardName(e.target.value);
  };

  const handleRequestCardNameChange = (e) => {
    setRequestCardName(e.target.value);
  };

  const handleExpansionChange = (e) => {
    setExpansionSet(e.target.value);
  };

  const handleManaCostChange = (e) => {
    setManaCost(e.target.value);
  };

  const handlePowerChange = (e) => {
    setPower(e.target.value);
  };

  const handleToughnessChange = (e) => {
    setToughness(e.target.value);
  };

  const handleCardTypeChange = (e) => {
    setCardType(e.target.value);
  };

  const handleAbilityChange = (e) => {
    setAbility(e.target.value);
  };

  const handleFlavorTextChange = (e) => {
    setFlavorText(e.target.value);
  };

  const handleQuoteTextChange = (e) => {
    setQuote(e.target.value);
  };

  const handleImageDataChange = (e) => {
    // const file = e.target.files[0];
    // setImageData(file);

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      console.log(imageData);
      setImageData(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleRequestImageDataChange = (e) => {
    // const file = e.target.files[0];
    // setImageData(file);

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      console.log(imageData);
      setRequestImageData(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitAddCard = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append('card_id', card_id);
    formData.append('name', card_name);
    formData.append('expansion_set', expansion_set);
    formData.append('mana_cost', mana_cost);
    formData.append('power', power);
    formData.append('toughness', toughness);
    formData.append('card_type', card_type);
    formData.append('ability', ability);
    formData.append('flavor_text', flavor_text);
    formData.append('quote', quote);
    formData.append('imageData', image_data);
    formData.append('requested', 'False');


    try {
      const response = await axios.post(
        'http://root:password@localhost:8000/api/add-card',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log(response);

      setCardID(null);
      setCardName('');
      setExpansionSet(null);
      setManaCost(null);
      setPower(null);
      setToughness(null);
      setCardType(null);
      setAbility(null);
      setFlavorText(null);
      setQuote(null);
      setImageData(null);

      e.target.reset();

      addCardDropDownRef.current.classList.remove('show');
    } catch (error) {
      console.log(error);
    }

  }

  const handleSubmitRequestCard = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append('card_id', null);
    formData.append('name', request_card_name);
    formData.append('expansion_set', null);
    formData.append('mana_cost', null);
    formData.append('power', null);
    formData.append('toughness', null);
    formData.append('card_type', 0);
    formData.append('ability', null);
    formData.append('flavor_text', null);
    formData.append('quote', quote);
    formData.append('imageData', image_data);
    formData.append('requested', 'True');

    try {
      const response = await axios.post(
        'http://root:password@localhost:8000/api/add-card',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log(response);

      setCardID(null);
      setRequestCardName('');
      setExpansionSet(null);
      setManaCost(null);
      setPower(null);
      setToughness(null);
      setCardType(null);
      setAbility(null);
      setFlavorText(null);
      setQuote(null);
      setRequestImageData(null);

      e.target.reset();

      addCardDropDownRef.current.classList.remove('show');
    } catch (error) {
      console.log(error);
    }

  }

  const addCardDropdown = useCallback(() => {
    const addCardDropdown = addCardDropDownRef.current;
    if (addCardDropdown) {
      addCardDropdown.classList.toggle(style['show']);
    }
  }, []);

  const requestCardDropdown = useCallback(() => {
    const requestCardDropdown = requestCardDropDownRef.current;
    if (requestCardDropdown) {
      requestCardDropdown.classList.toggle(style['show']);
    }
  }, []);

  const onClickOutside = useCallback((event) => {
    if (!event.target.matches(".dropbtn") && !event.target.matches(".dropcontent")) {
      const dropdowns = document.getElementsByClassName(style["add-card-dropdown"]);
      Array.from(dropdowns).forEach((openDropdown) => {
        if (openDropdown.classList.contains(style['show'])) {
          openDropdown.classList.remove(style['show']);
        }
      });
    }
    if (!event.target.matches(".request-dropbtn") && !event.target.matches(".request-dropcontent")) {
      const dropdowns = document.getElementsByClassName(style["request-card-dropdown"]);
      Array.from(dropdowns).forEach((openDropdown) => {
        if (openDropdown.classList.contains(style['show'])) {
          openDropdown.classList.remove(style['show']);
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get('http://root:password@localhost:8000/api/cards');
        setCards(response.data);
        // console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchCards();
    const handleClickOutside = (event) => {
      onClickOutside(event);
    };


    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);
    }


    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", handleClickOutside);
      }
    };


  }, [onClickOutside]);

  return (
    <>
      <div className={style['cl-cardlist']}>
        <div className={style['cl-top']}>
          <div className={style['cl-search-section']}>
            <button className={style['cl-filter']}><Image src={filterIm} className={style['cl-icon']} /><p className={style['cl-filter-button']}>Filter</p></button>
            <input
              type="text"
              className={style['cl-searchbar']}
              placeholder={'search here...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={style['cl-searchbutton']}><Image src={searchBtn} className={style['cl-searchbtn']} /></button>
          </div>
          <div className={style['cl-request-section']}>
            {authenticated && <input type="button" className={` ${style['cl-requestbtn']} request-dropbtn`} value={`Request Card`} onClick={requestCardDropdown} />}
            <form className={`request-card-dropdown`} onSubmit={handleSubmitRequestCard}>
              <div className={style['request-card-dropdown']} ref={requestCardDropDownRef}>
                <div className={style['add-card-content']}>
                  <div className={`request-dropcontent`}>
                    <label htmlFor="name" className={`request-dropcontent`}>Name:</label>
                    <input type="text" id="name" name="name" required value={request_card_name} onChange={handleRequestCardNameChange} className={`request-dropcontent`} />
                  </div>
                  <div className={`request-dropcontent`}>
                    <label htmlFor="image" className={`request-dropcontent`}>Image:</label>
                    <input type="file" id="image" name="imageData" accept="image/*" required onChange={handleRequestImageDataChange} className={`request-dropcontent`} />
                    {/* {image_data} */}
                    {/* value={image_data} */}
                  </div>
                  <button type="submit">Request</button>
                </div>
              </div>
            </form>
            {authenticated && isAdmin && <input type="button" className={` ${style['cl-requestbtn']} dropbtn`} value={`Add Card`} onClick={addCardDropdown} />}
            <form className={`add-card-dropdown`} onSubmit={handleSubmitAddCard}>
              <div className={style['add-card-dropdown']} ref={addCardDropDownRef}>
                <div className={style['add-card-content']}>
                  <div className={`dropcontent`}>
                    <label htmlFor="card_id" className={`dropcontent`}>Card ID:</label>
                    <input type="text" id="card_id" name="card_id" required value={card_id} onChange={handleCardIDChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="name" className={`dropcontent`}>Name:</label>
                    <input type="text" id="name" name="name" required value={card_name} onChange={handleCardNameChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="expansion_set" className={`dropcontent`}>Expansion Set:</label>
                    <input type="text" id="expansion_set" name="expansion_set" required value={expansion_set} onChange={handleExpansionChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="mana_cost" className={`dropcontent`}>Mana Cost:</label>
                    <input type="text" id="mana_cost" name="mana_cost" required value={mana_cost} onChange={handleManaCostChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="power" className={`dropcontent`}>Power:</label>
                    <input type="text" id="power" name="power" required value={power} onChange={handlePowerChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="toughness" className={`dropcontent`}>Toughness:</label>
                    <input type="text" id="toughness" name="toughness" required value={toughness} onChange={handleToughnessChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="card_type" className={`dropcontent`}>Card Type:</label>
                    <select id="card_type" name="card_type" required value={card_type} onChange={handleCardTypeChange} className={`dropcontent`}>
                      <option value="1">Sorcery</option>
                      <option value="2">Instant</option>
                      <option value="3">Land</option>
                      <option value="4">Creature</option>
                      <option value="5">Artifact</option>
                      <option value="6">Enchantment</option>
                      <option value="7">Planeswalker</option>
                      <option value="8">Battle</option>
                    </select>
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="ability" className={`dropcontent`}>Ability:</label>
                    <input type="text" id="ability" name="ability" required value={ability} onChange={handleAbilityChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="flavor_text" className={`dropcontent`}>Flavor Text:</label>
                    <input type="text" id="flavor_text" name="flavor_text" value={flavor_text} onChange={handleFlavorTextChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="quote" className={`dropcontent`}>Quote:</label>
                    <input type="text" id="quote" name="quote" value={quote} onChange={handleQuoteTextChange} className={`dropcontent`} />
                  </div>
                  <div className={`dropcontent`}>
                    <label htmlFor="image" className={`dropcontent`}>Image:</label>
                    <input type="file" id="image" name="imageData" accept="image/*" required onChange={handleImageDataChange} className={`dropcontent`} />
                    {/* {image_data} */}
                    {/* value={image_data} */}
                  </div>
                  <button type="submit">Add</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={style['cl-cardshow-list']}>
          {cards.map((card) => {
            if (
              !card.requested &&
              card.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return <Card key={card.id} cardData={card} />;
            }
          })}
        </div>
        <div className={style['cl-bottom']}></div>
      </div>
    </>
  )
}
