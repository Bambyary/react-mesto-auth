
class Api {
    constructor (baseUrl, headers) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _getResponseData (response) {
        if(response.ok) {
            return response.json()
        } else {
            return Promise.reject(`Ошибка ${response.status}`)
        }
    }

    getCards () {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._headers
        })
        .then(response => {
            return this._getResponseData(response);
        })
    }

    addCard(card){
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: card.name,
                link: card.link
            })
        })
        .then(response => {
            return this._getResponseData(response);
        })
    }

    getUserInfo() {
        return fetch (`${this._baseUrl}/users/me`, {
            headers: this._headers
        })
        .then((response) => {
            return this._getResponseData(response);
        })
    }

    editUserInfo(userData) {
        return fetch (`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                name: userData.name,
                about: userData.about
            })
        })
        .then(response => {
            return this._getResponseData(response);
        })
    }

    deleteCard(cardId) {
        console.log(cardId)
        return fetch (`${this._baseUrl}/cards/${cardId}`, {
            method: "DELETE",
            headers: this._headers,
        })
        .then(response => {
            return this._getResponseData(response);
        })
    }

    changeLikeCardStatus (cardId, isLiked) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: !isLiked ? 'PUT' : 'DELETE',
            headers: this._headers
        }).then(response => {
            return this._getResponseData(response);
        })
    }

    editAvatar (data) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar
            })
        })
        .then(response => {
            return this._getResponseData(response);
        })
    }

    getInitialInfo() {
        return Promise.all([this.getUserInfo(), this.getCards()]);
    }
}


const api = new Api('https://mesto.nomoreparties.co/v1/cohort-65', {authorization: 'b15bc02e-ae06-46a3-b490-b1ce7ba85320', "content-type": 'application/json; charset=UTF-8'});

export default api;