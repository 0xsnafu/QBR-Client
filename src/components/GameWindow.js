import { useSelector } from 'react-redux';

import Math from './games/Math';
import Memory from './games/Memory';
import GameStatus from './GameStatus';
import Fireworks from "./Fireworks";

const GameWindow = ({ socket }) => {
    const { gameType, status } = useSelector(state => state.game);

    const DisplayGame = () => {
        if (status === 0 || status === 4 || status === 11) return <GameStatus socket={socket} />;
        if (gameType === "Math") return <Math socket={socket} />;
        if (gameType === "Memory") return <Memory socket={socket} />;
    }

    return (
        <>
            {DisplayGame()}

            <audio id='victory-audio' src='/audio/victory-sound.mp3' preload='auto' />
            <audio id='fireworks-audio' src='/audio/fireworks-sound.mp3' preload='auto' />
            <audio id='correct-audio' src='/audio/correct-sound.mp3' preload='auto' />
            <audio id='incorrect-audio' src='/audio/incorrect-sound.mp3' preload='auto' />

            <Fireworks />
        </>
    )
}

export default GameWindow;