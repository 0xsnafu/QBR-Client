import React, { useEffect, useState } from 'react';
// import ReactGA from 'react-ga';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { setMyID, setRoomID, setUserList, setQuestion, setCards, setRankings, setCount, setStatus, setIsHost, ResetState, setInParty, setIsWinner } from '../../redux/game';

import UserList from "../UserList";

import { OrderUserList } from "../../utils/userUtils";
import { IsMatchOver } from "../../utils/gameUtils";
import GameWindow from '../GameWindow';

// if (process.env.NODE_ENV !== 'development') {
//     ReactGA.initialize('UA-103417969-4');
//     ReactGA.pageview('/play');
// }

let socket;

const Play = () => {
    const { myID, roomID, userList, question, rankings, inParty, isHost, isWinner } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const [gameType, setGameType] = useState("");

    const Connect = (queryRoomId) => {
        //queryRoomId will be undefined if creating a room. If joining, queryRoomId should be the room id
        if (inParty && queryRoomId === undefined) { //Will create party Room
            socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws?inParty=true&roomID=&token=${localStorage.getItem('jwt')}`);
        } else if (queryRoomId !== undefined) { //Will join party Room
            if (!inParty) { dispatch(setInParty(true)) }
            socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws?inParty=true&roomID=${queryRoomId}&token=${localStorage.getItem('jwt')}`);
        } else { //Will search for open room
            socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws?inParty=false&roomID=&token=${localStorage.getItem('jwt')}`);
        }
    }

    //Runs only when component first mounts
    useEffect(() => {
        let query = queryString.parse(window.location.search);

        //Makes this player the host if creating a Party Room
        if (query.roomID === undefined && inParty) {
            dispatch(setIsHost(true));
        } else {
            dispatch(setIsHost(false));
            dispatch(setUserList([]))
        }

        if (!socket && query.roomID) { Connect(query.roomID) }
        if (!socket && !query.roomID) { Connect(undefined) }

        return () => {
            const Disconnect = () => {
                if (socket === undefined) return;

                socket.close(1000); //1000 is normal closing status for WS
                socket = undefined;
                dispatch(ResetState());
            }
            Disconnect()
        }

        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (data) => {
            let msg = JSON.parse(data.data);
            let message;

            switch (msg.status) {
                case 0: //Receiving countdown
                    if (inParty && IsMatchOver(rankings, myID)) { dispatch(ResetState()); }
                    dispatch(setStatus(0));
                    dispatch(setCount(msg.body));
                    break;
                case 1: //Server says start match
                    if (gameType === "Math") { //Get Question                    
                        message = { status: 5 }
                    } else if (gameType === "Memory") { //Get Cards     
                        message = { status: 4 }
                    }
                    socket.send(JSON.stringify(message));
                    break;
                case 2: //Getting user list        
                    let clientList = msg.body;
                    dispatch(setUserList(OrderUserList(userList, clientList, question.message ? true : false)));
                    break;
                case 3: //Getting my ID
                    dispatch(setMyID(msg.body[0]));
                    break;
                case 4: //Server is searching for players...
                    dispatch(setStatus(4));
                    break;
                case 5: //Receiving Question
                    dispatch(setStatus(5));
                    if (gameType === "Math") { //Get Question          
                        dispatch(setQuestion(JSON.parse(msg.body)));
                    } else if (gameType === "Memory") { //Get Cards     
                        console.log(JSON.parse(msg.body))
                        dispatch(setCards(JSON.parse(msg.body)));
                    }
                    break;
                case 6: //Receiving Game Type
                    setGameType(msg.body[0]);
                    break;
                case 8: //Receiving Rankings
                    dispatch(setRankings(msg.body));
                    break;
                case 10: //Receive Room ID
                    dispatch(setRoomID(msg.body[0]));
                    break;
                default: console.log("DEFAULT: msg.status: ", msg.status); break;
            }
        };

        socket.onerror = error => {
            console.log("Socket Error: ", error);
        };

        if (socket !== undefined && rankings[0] === myID && !isWinner) { //Will set winner if index 0 in rankings is this user and not already set as winner
            dispatch(setIsWinner(true));

            if (document.getElementById('victory-audio') === null) return //document.getElementById('victory-audio') is occasionally null. No idea why.
            document.getElementById('victory-audio').play()
            document.getElementById('fireworks-audio').play()
        } else if (rankings.length === 0 && isWinner) { //If rankings get cleared(Play Again) and user was winner, clears winner
            dispatch(setIsWinner(false));
        }

        if (inParty) {
            //If this current user was not the host before but now is the host(old host disconnected), set this user as new host
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].id === myID && userList[i].isHost && !isHost) {
                    dispatch(setIsHost(true));
                }
            }
        }
        // eslint-disable-next-line
    }, [inParty, question, rankings, myID, isWinner, userList, isHost])

    return (
        <div className='grid grid-cols-12 gap-4'>

            {inParty &&
                (<div className='col-start-2 col-span-10 md:col-start-3 md:col-span-8'>
                    <p className='inline'><span className='font-bold'>Code:</span> {roomID}</p>
                </div>)}

            <div className='col-start-2 col-span-10 md:col-start-3 md:col-span-8 border-2 border-green-500 rounded'>
                <UserList />
            </div>

            <div className='col-start-2 col-span-10 md:col-start-3 md:col-span-8 border-2 border-green-500 rounded p-2 min-h-300 text-center'>
                <GameWindow socket={socket} gameType={gameType} />
            </div>

        </div>
    );
}

export default Play;