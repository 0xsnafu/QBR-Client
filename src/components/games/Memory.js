import { useEffect, useState } from 'react';
import MemoryItem from '../items/MemoryItem';

import { IsMatchOver, CheckForPair } from '../../utils/gameUtils';

import { useSelector, useDispatch } from 'react-redux';
import { selectCard, unselectCards, pairCards } from '../../redux/game';

const Memory = ({ socket }) => {
    const { cards, rankings, myID } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const [isIncorrect, setIsIncorrect] = useState(false);

    useEffect(() => {
        CheckForPairs();

        // eslint-disable-next-line
    }, [cards])



    const CheckForPairs = () => {
        let cardsSelected = cards.filter(card => card.isSelected)

        if (cardsSelected.length === 2) { //Check cards for pair
            if (CheckForPair(cards)) { //Match
                dispatch(pairCards());

                console.log(cardsSelected);
                let message = {
                    status: 3,
                    body: [cardsSelected[0].index.toString(), cardsSelected[1].index.toString()]
                }

                socket.send(JSON.stringify(message))

                document.getElementById('correct-audio').play()
            } else { //No Match
                setIsIncorrect(true);
                document.getElementById('incorrect-audio').play()

                setTimeout(() => {
                    dispatch(unselectCards());
                    setIsIncorrect(false);
                }, 750);
            }

        }
    }

    const FlipCard = (card) => {
        if (isIncorrect) return; //Can't flip during Incorrect penalty
        dispatch(selectCard(card));
    }

    // const CheckAnswer = (card) => {
    //     console.log(99)
    //     if (IsMatchOver(rankings, myID)) return;
    //     console.log(88)

    //     if (CheckForPair(cards)) { //Correct
    //         console.log(77)
    //         document.getElementById('correct-audio').play()
    //     }
    //     else { //Incorrect
    //         setIsIncorrect(true);
    //         document.getElementById('incorrect-audio').play()

    //         setTimeout(() => { setIsIncorrect(false) }, 750);
    //     }

    //     let message = {
    //         status: 6,
    //         body: [card.toString()]
    //     }

    //     socket.send(JSON.stringify(message))
    // }

    return (
        <div className="grid grid-cols-12 gap-4">
            {cards.map((card, index) => (
                <div key={index} className='col-span-4' onClick={() => FlipCard(card)}>
                    <MemoryItem card={card} />
                </div>
            ))}
        </div>
    )
}

export default Memory;