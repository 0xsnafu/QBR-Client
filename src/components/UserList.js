import React from 'react';
import { useSelector } from 'react-redux';

const UserList = () => {
    const { userList, myID, rankings, gameType, status } = useSelector(state => state.game);

    const CalculateRankings = (userId) => {
        for (let i = 0; i < rankings.length; i++) {
            if (rankings[i] === userId) {
                switch (i) {
                    case 0: return <img className='mx-auto' src={window.location.origin + '/medals/first-medal.png'} alt='First place medal' />
                    case 1: return <img className='mx-auto' src={window.location.origin + '/medals/second-medal.png'} alt='Second place medal' />
                    case 2: return <img className='mx-auto' src={window.location.origin + '/medals/third-medal.png'} alt='Third place medal' />
                    default: return (i + 1) + 'th' //For rankings after 3, for larger games
                }
            }
        }
    }

    const DetermineScoreText = (user) => {
        if (status === 4) return "---"; //5 is the status code for in game

        switch (gameType) {
            case "Math": return user.score;
            case "Memory": return user.score; //Use  "Pairs: " + in future, after layout overhaul
            default: return "";
        }
    }

    return (
        <ul className="grid grid-cols-12">
            {userList !== undefined && userList.map((user, index) => (
                <li key={index} className={`list-none py-2 col-span-12 md:col-span-3 text-center ${index !== userList.length - 1 && 'border-b-2 md:border-r-2'} md:border-b-0 border-green-500`}>

                    <div className='grid grid-cols-12'>
                        <div className='col-span-9 md:col-span-12'>
                            <span className='font-bold mx-1 float-left'>{user.elapsedTime.length > 0 && (user.elapsedTime)}</span>
                            {user.username}
                            {user.id === myID && (<span className='text-green-600 font-bold'>(You)</span>)}
                            {user.isHost && (<span className='text-red-600 font-bold'>(host)</span>)}
                        </div>

                        <div className='col-span-3 md:col-span-12'>
                            <div className='grid grid-cols-12'>
                                <div className='col-span-6 border-r-2 border-green-500'>
                                    <p className='bg-blackd px-1 text-black md:block md:ml-0 font-bold'>{DetermineScoreText(user)}</p>
                                </div>
                                <div className='col-span-6'>
                                    <p className='bg-blackd px-1 text-black md:block md:ml-0 font-bold'>{CalculateRankings(user.id)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </li>
            ))}
        </ ul>
    )
}

export default UserList;