import React, { useState } from 'react'
import ReactGA from 'react-ga';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setInParty } from '../redux/game';
import ErrorMsg from './ErrorMsg';

// if (process.env.NODE_ENV !== 'development') {
//     ReactGA.initialize('UA-103417969-4');
//     ReactGA.pageview('/');
// }

const Memory = () => {


    return (
        <div>
            <h2>Memory</h2>
        </div>
    )
}

export default Memory;