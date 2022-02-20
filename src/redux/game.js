import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    myID: '',
    roomID: '',
    userList: [],
    question: {},
    cards: [],
    rankings: [],
    count: 10,
    status: 4,
    inParty: false,
    isHost: false,
    isWinner: false,
    gameType: ''
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setMyID: (state, action) => {
            state.myID = action.payload
        },
        setRoomID: (state, action) => {
            state.roomID = action.payload
        },
        setUserList: (state, action) => {
            state.userList = action.payload
        },
        setQuestion: (state, action) => {
            state.question = action.payload
        },
        setCards: (state, action) => {
            state.cards = action.payload
        },
        selectCard: (state, action) => {
            state.cards[action.payload.index].isSelected = true;
        },
        unselectCards: (state, action) => {
            for (let i = 0; i < state.cards.length; i++) {
                state.cards[i].isSelected = false;
            }
        },
        pairCards: (state, action) => {
            for (let i = 0; i < state.cards.length; i++) {
                if (state.cards[i].isSelected) {
                    state.cards[i].isPaired = true;
                    state.cards[i].isSelected = false;
                }
            }
        },
        setRankings: (state, action) => {
            state.rankings = action.payload
        },
        setCount: (state, action) => {
            state.count = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setInParty: (state, action) => {
            state.inParty = action.payload
        },
        setIsHost: (state, action) => {
            state.isHost = action.payload
        },
        setIsWinner: (state, action) => {
            state.isWinner = action.payload
        },
        setGameType: (state, action) => {
            state.gameType = action.payload
        },
        ResetState: (state) => {
            state.question = {};
            state.roomID = state.inParty ? state.roomID : "";
            state.rankings = [];
            state.status = 4;
            state.userList = state.inParty ? state.userList : [];
            state.isHost = false;
        },
    },
})

export const { setMyID, setRoomID, setUserList, setQuestion, setCards, selectCard, unselectCards, pairCards, setRankings, setCount, setStatus, setInParty, setIsHost, setIsWinner, setGameType, ResetState } = gameSlice.actions

export default gameSlice.reducer