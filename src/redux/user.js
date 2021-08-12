import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import setAuthToken from '../utils/setAuthToken';

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (thunkAPI) => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getuser`)
        return response.data
    }
)

const initialState = {
    user: {}
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.user = payload
        },
        logoutUser: (state, { payload }) => {
            state.user = payload;
            localStorage.removeItem('jwt');

            axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`)
                .then(res => {
                    // localStorage.removeItem('jwt');
                })
                .catch(err => console.log(err))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateUser.fulfilled, (state, { payload }) => {
            //Update the User state
            const decoded = jwt_decode(payload);

            state.user.username = decoded.username;
            state.user.gamesPlayed = decoded.gamesPlayed;
            state.user.gamesWon = decoded.gamesWon;
            state.user.isVerified = decoded.isVerified;

            //Update local storage token and axios token
            setAuthToken(payload)
            localStorage.setItem('jwt', payload);
        })
    },
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer