
const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            email
        })
    }).then(res => {
        if(res.ok) {
            return res.json();
        } else {
            console.log(res.status)
        }
    }).then(res => {
        return res;
    })
}

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password,
            email
        })
    }).then(res => {
        if(res.status === 200) {
            return res.json();
        } else {
            console.log(res.status)
        }
    }).then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data;
        } else {
            return;
        }
    })
}

export const getToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then(res => {
        if(res.status === 200) {
            return res.json();
        } else {
            console.log(res.status)
        }
    }).then(data => {
        return data;
    })
}
