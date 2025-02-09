const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
    headers: {
      authorization: 'a7dedf44-5931-44ff-b669-b86e19c452de',
      'Content-Type': 'application/json'
    }
}

export const getUser = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'GET',

        headers: config.headers,
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const patchProfile = (name, about) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',

        headers: config.headers,

        body: JSON.stringify({
            name: name,
            about: about,
        })
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const postCard = (name, link) => {

    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',

        headers: config.headers,

        body: JSON.stringify({
            name: name,
            link: link,
        })
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const deleteCard = (id) => {
    return fetch(`${config.baseUrl}/cards/${id}`, {
        method: 'DELETE',

        headers: config.headers
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const putLike = (id) => {
    return fetch(`${config.baseUrl}/cards/likes/${id}`, {
        method: 'PUT',

        headers: config.headers
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const deleteLike = (id) => {
    return fetch(`${config.baseUrl}/cards/likes/${id}`, {
        method: 'DELETE',

        headers: config.headers
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}

export const patchAvatar = (avatar) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',

        headers: config.headers,

        body: JSON.stringify({
            avatar: avatar,
        }),
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    }); 
}