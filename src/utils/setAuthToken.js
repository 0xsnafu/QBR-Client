import axios from 'axios';

const setAuthToken = token => {
    if (token) {
        //Apply to every request        
        axios.defaults.headers['Authorization'] = token;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
        //Delete Auth Header
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;