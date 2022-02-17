import { useSelector } from 'react-redux';

import Countdown from './Countdown';

const GameStatus = () => {
    const { status, count, inParty } = useSelector(state => state.game);

    return (
        <div>
            {status === 0 && (<p>Match starts in <Countdown count={count} /></p>)}

            {(status === 4 && !inParty && (<h3>Searching for players...</h3>))}
        </div>
    )
}

export default GameStatus;