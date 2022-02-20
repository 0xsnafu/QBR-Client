import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { IsMatchOver } from '../utils/gameUtils';
import { ResetState } from '../redux/game';

import Math from './games/Math';
import Memory from './games/Memory';
import GameStatus from './GameStatus';
import Fireworks from "./Fireworks";

const GameWindow = ({ socket }) => {
    const { question, status, inParty, rankings, myID, isHost, gameType } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [buttonText, setButtonText] = useState(inParty ? "Start!" : "Play Again")

    useEffect(() => {
        if (!inParty && IsMatchOver(rankings, myID)) { setIsButtonVisible(true); return; }
        if (!inParty && !IsMatchOver(rankings, myID)) { setIsButtonVisible(false); return; }

        if (inParty && !isHost) { setIsButtonVisible(false); return; } //Not party host, no need to see button ever
        if (inParty && isHost) {
            if (status === 5 && IsMatchOver(rankings, myID)) { //Match finished
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

    const GenerateMessage = (statusToSend) => {
        let message = { status: statusToSend }

        socket.send(JSON.stringify(message));
        dispatch(ResetState());
    }

    const Play = () => {
        setIsButtonVisible(false);

        if (!inParty) {
            GenerateMessage(7);
        } else if (inParty) {
            GenerateMessage(11);
        }
    }

    const DisplayGame = () => {
        if (status === 0 || status === 4) return <GameStatus status={status} />;
        if (gameType === "Math") return <Math socket={socket} question={question} />;
        if (gameType === "Memory") return <Memory socket={socket} />;
    }

    return (
        <div>

            {DisplayGame()}

            <audio id='victory-audio' src='/audio/victory-sound.mp3' preload='auto' />
            <audio id='fireworks-audio' src='/audio/fireworks-sound.mp3' preload='auto' />
            <audio id='correct-audio' src='/audio/correct-sound.mp3' preload='auto' />
            <audio id='incorrect-audio' src='/audio/incorrect-sound.mp3' preload='auto' />

            <Fireworks />

            {isButtonVisible}
            <button className={`bg-blue-400 hover:bg-blue-600 ${isButtonVisible ? 'inline' : 'hidden'}`}
                onClick={() => Play()}>{buttonText}</button>
        </div>
    )
}

export default GameWindow;