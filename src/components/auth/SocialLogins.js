import React from 'react';
import axios from 'axios';
import querystring from 'query-string';
import jwt_decode from "jwt-decode";

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import { useDispatch } from 'react-redux';
import { addFlashMsg } from '../../redux/flash';
import { setUser } from '../../redux/user';
import setAuthToken from '../../utils/setAuthToken';

const SocialLogins = ({ buttonText }) => {
    const dispatch = useDispatch();

    //FACEBOOK
    const responseFacebook = (response) => {
        SendRequest(response.email)
    }

    //GOOGLE
    const responseGoogle = (response) => {
        console.log(999)
        SendRequest(response.profileObj.email)
    }

    const SendRequest = (email) => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/social/login`, querystring.stringify({ email }), { withCredentials: true })
            .then(res => {
                setAuthToken(res.data);
                localStorage.setItem('jwt', res.data);

                const decoded = jwt_decode(localStorage.getItem('jwt'));
                dispatch(setUser(decoded));
                dispatch(addFlashMsg({ msg: "Welcome back!😎", type: 'success' }))
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h4 className='text-gray-500 text-center my-2'>- - - or - - -</h4>
            <div className='text-center flex justify-evenly'>
                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_ID}
                    autoLoad={false}
                    fields="email"
                    callback={(e) => responseFacebook(e)}
                    icon="fa-facebook"
                    textButton={buttonText}
                    cssClass='fb-button py-2 px-4'
                />
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_ID}
                    buttonText={buttonText}
                    onSuccess={(e) => responseGoogle(e)}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    )
}

export default SocialLogins