import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { IsMatchOver } from '../utils/gameUtils';
import { ResetState } from '../redux/game';

import Countdown from './Countdown';

const GameStatus = ({ socket }) => {
    const { question, status, inParty, rankings, myID, isHost, count } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [buttonText, setButtonText] = useState(inParty ? "Start!" : "Play Again")

    useEffect(() => {
        if (!inParty && IsMatchOver(rankings, myID)) { setIsButtonVisible(true); return; }
        if (!inParty && !IsMatchOver(rankings, myID)) { setIsButtonVisible(false); return; }

        if (inParty && !isHost) { setIsButtonVisible(false); return; } //Not party host, no need to see button ever
        if (inParty && isHost) {
            if ((status === 5 && IsMatchOver(rankings, myID)) || status === 11) { //Match finished
                setButtonText("Play Again");
                setIsButtonVisible(true);
            } else if (status === 4 && !question.message) {
                setButtonText("Play");
                setIsButtonVisible(true);
            } else {
                setIsButtonVisible(false);
            }
        }

        // eslint-disable-next-line
    }, [status, isHost, question, inParty, rankings, myID])

    const Play = () => {
        setIsButtonVisible(false);

        if (!inParty) {
            GenerateMessage(7);
        } else if (inParty) {
            GenerateMessage(11);
        }
    }

    const GenerateMessage = (statusToSend) => {
        let message = { status: statusToSend }

        socket.send(JSON.stringify(message));
        dispatch(ResetState());
    }

    return (
        <div>
            {status === 0 && (<p>Match starts in <Countdown count={count} /></p>)}

            {(status === 4 && !inParty && (<h3>Searching for players...</h3>))}

            {(status === 11 || (inParty && status === 4)) && (
                <button className={`bg-blue-400 hover:bg-blue-600 ${isButtonVisible ? 'inline' : 'hidden'}`}
                    onClick={() => Play()}>{buttonText}</button>
            )}
        </div>
    )
}

export default GameStatus;