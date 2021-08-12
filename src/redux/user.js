import axios from 'axios';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import setAuthToken from '../utils/setAuthToken';

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (thunkAPI) => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getuser`)
        console.log(response)
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
            // state.user.username = payload.username;
            // state.user.gamesPlayed = payload.gamesPlayed;
            // state.user.gamesWon = payload.gamesWon;
            // state.user.isVerified = payload.isVerified;
            console.log(payload)
            setAuthToken(payload)
            localStorage.setItem('jwt', payload);
        })
    },
})

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer