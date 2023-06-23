import React from 'react';
import Main from './Main/Main.js';
import Footer from './Footer/Footer.js';
import PopupWithForm from './PopupWithForm/PopupWithForm.js';
import ImagePopup from './ImagePopup/ImagePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CurrentCards } from '../contexts/CurrentCards.js';
import api from '../utils/api';
import EditProfilePopup from './EditProfilePopup/EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup/AddPlacePopup.js';
import PopupConfirm from './PopupConfirm/PopupConfirm';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register.js';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.js';
import * as auth from '../auth.js';
import InfoTooltip from './InfoTooltip/InfoTooltip.js';

function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isPopupConfirm, setIsPopupConfirm] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [cardData, setCardData] = React.useState([]);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState({});
    const [isPopupSuccessOpen, setIsPopupSuccessOpen] = React.useState(false);
    const [isPopupSuccess, setIsPopupSuccess] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        api.getUserInfo().then(response => {
            setCurrentUser(response);
        }).catch(err => console.log(err));

        api.getCards().then(data => {
            setCards(data.map(card => {
                return card;
            }));
        }).catch(err => console.log(err));

        tokenCheck();

    }, [])

    function tokenCheck () {       
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            auth.getToken(token).then(res => {
                if (res) {
                    setLoggedIn(true);
                    setUserEmail({
                        email: res.data.email
                    });
                    navigate('/', {replace: true})
                } else {
                    return;
                }                 
            }).catch(e => {
                console.log(e);
            })
        }
    }

    function handleEditProfileClick () {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick () {
        setIsEditAvatarPopupOpen(true);
    }

    function handleAddPlaceClick () {
        setIsAddPlacePopupOpen(true);
    }

    function handlePopupConfirmClick(card) {
        setCardData(card);
        setIsPopupConfirm(true);
    }

    function handleCardClick (card) {
        setSelectedCard(card);
    }

    function handleCardLike (card) {
        const isLiked = card.likes.some(like => like._id === currentUser._id);

        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err => console.log(err));
    }

    function handleCardDelete (card) {
        api.deleteCard(card._id).then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id))
        }).catch(err => console.log(err));
    }

    function handleUpdateUser (userData) {
        setIsLoading(true);
        api.editUserInfo(userData).then(data => {
            setCurrentUser(data);
        }).catch(err => console.log(err))
        .finally(() => {
            setIsLoading(false);
        });
    }

    function handleUpdateAvatar (userAvatar) {
        setIsLoading(true);
        api.editAvatar(userAvatar).then(data => {
            setCurrentUser(data);
        }).catch(err => console.log(err))
        .finally(() => {
            setIsLoading(false);
        });
    } 

    function handleAddPlaceSubmit (card) {
        setIsLoading(true); 
        api.addCard(card).then((newCard) => {
            setCards([newCard, ...cards]);
        }).catch(err => console.log(err))
        .finally(() => {
            setIsLoading(false);
        });
    }

    function closeAllPopups () {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard({});
        setIsPopupConfirm(false);
        setIsPopupSuccessOpen(false);
    }

    function handleLogin () {
        setLoggedIn(true);
    }

    function handleRegister () {
        setIsPopupSuccessOpen(true);
    }

    function handleSuccess (boolean) {
        setIsPopupSuccess(boolean);
    }


  return (
    <div className="page">

        <CurrentUserContext.Provider value={currentUser}>
            <CurrentCards.Provider value={cards}>
                <Routes>

                <Route path='/' element={<ProtectedRoute 
                    loggedIn={loggedIn} 
                    element={Main}
                    userEmail={userEmail.email}
                    onEditProfile={handleEditProfileClick} 
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onPopupConfirm={handlePopupConfirmClick}/>}
                    />
  
                    <Route path='/sign-in' element={<Login 
                        handleLogin={handleLogin}
                        handleRegister={handleRegister}
                        handleSuccess={handleSuccess}
                        userEmail={setUserEmail}/>}/>
                    <Route path='/sign-up' element={<Register 
                        handleRegister={handleRegister} 
                        handleSuccess={handleSuccess} />} />
                        
                </Routes>

                <EditProfilePopup 
                        isOpen={isEditProfilePopupOpen} 
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                        isLoading={isLoading} />   

                <EditAvatarPopup 
                        isOpen={isEditAvatarPopupOpen} 
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                        isLoading={isLoading}/> 

                <AddPlacePopup  
                        isOpen={isAddPlacePopupOpen} 
                        onClose={closeAllPopups}
                        onAddPlace={handleAddPlaceSubmit}
                        isLoading={isLoading}/>

                <PopupConfirm 
                        isOpen={isPopupConfirm}
                        onClose={closeAllPopups}
                        onCardDelete={handleCardDelete}
                        card={cardData}/>

                <InfoTooltip 
                    isOpen={isPopupSuccessOpen}
                    onClose={closeAllPopups}
                    isSuccess={isPopupSuccess}
                    />
            </CurrentCards.Provider>
        </CurrentUserContext.Provider>
        <Footer />
 
        <PopupWithForm name='form-confirm' title='Вы уверены?' textButton='Да'></PopupWithForm>

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

    </div>
  );
}

export default App;