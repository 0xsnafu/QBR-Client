import { useEffect, useState } from 'react'
// import ReactGA from 'react-ga';
// import { Link } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { setInParty } from '../redux/game';
// import ErrorMsg from './ErrorMsg';
import MemoryItem from '../items/MemoryItem';

// if (process.env.NODE_ENV !== 'development') {
//     ReactGA.initialize('UA-103417969-4');
//     ReactGA.pageview('/');
// }

const Memory = () => {
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [isIncorrect, setIsIncorrect] = useState(false);

    useEffect(() => {
        if (cards.length === 0) { //Only run on start, when there are no cards loaded
            let temp = [];
            for (let i = 0; i < 5; i++) {
                let redCard = {
                    index: 0,
                    color: "red",
                    isSelected: false,
                    isPaired: false
                }
                let blueCard = {
                    index: 0,
                    color: "blue",
                    isSelected: false,
                    isPaired: false
                }
                if (i === 0 || i === 3) {
                    redCard.index = i;
                    temp.push(redCard);
                } else {
                    blueCard.index = i;
                    temp.push(blueCard);
                }
            }

            setCards(temp);
        }

        CheckForPairs();
        // eslint-disable-next-line
    }, [selectedCards, cards])

    const CheckForPairs = () => {
        if (selectedCards.length === 2) { //Check cards for pair
            if (selectedCards[0].color === selectedCards[1].color) { //Match
                let newCards = [...cards];
                cards[selectedCards[0].index].isPaired = true;
                cards[selectedCards[0].index].isSelected = false;
                cards[selectedCards[1].index].isPaired = true;
                cards[selectedCards[1].index].isSelected = false;
                setSelectedCards([]);
                setCards(newCards);
            } else { //No Match
                setIsIncorrect(true);

                setTimeout(() => {
                    let tempCards = cards;
                    for (let i = 0; i < tempCards.length; i++) {
                        tempCards[i].isSelected = false;
                    }
                    setSelectedCards([]);
                    setCards(tempCards)
                    setIsIncorrect(false);
                }, 750);
            }

        }
    }

    const FlipCard = (card) => {
        if (isIncorrect) return; //Can't flip during Incorrect penalty
        if (selectedCards.length === 1 && selectedCards[0].index === card.index) return; //Can't flip same card again

        card.isSelected = true;
        setSelectedCards([...selectedCards, card]);
    }

    return (
        <div>
            <h2 className='text-3xl font-bold text-center'>Memory</h2>
            <hr className='my-2' />

            <div className="grid grid-cols-12 gap-4">
                {cards.map((card, index) => (
                    <div key={index} className='col-span-3' onClick={() => FlipCard(card)}>
                        <MemoryItem card={card} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Memory;