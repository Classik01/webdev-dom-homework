import { renderComments } from './commentModule.js';
import { format } from "date-fns";


const todosURL = "https://wedev-api.sky.pro/api/v2/aidar-sultanov/comments"
const userURL = "https://wedev-api.sky.pro/api/user/login";

export let token;
export const setToken = (newToken) => {
    token = newToken;
};

export let userName;
export const setUserName = (newUserName) => {
    userName = newUserName;
};

export const fetchComments = ({ commentsData }) => {
    return fetch(todosURL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            return response;
        })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            const getApiComments = responseData.comments.map((comment) => {
                const newDate = format(
                    new Date(comment.date),
                    'yyyy-MM-dd hh.mm.ss',
                  );
                return {
                    author: comment.author.name,
                    date: newDate,
                    likes: comment.likes,
                    isLiked: false,
                    text: comment.text,
                };
            });
            commentsData = getApiComments;
            renderComments({ commentsData });
            document.getElementById("loadingMessage").style.display = "none";
        })
};

export const postComment = ({ newComment, commentsData }) => {
    fetch(todosURL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: newComment.name,
            text: newComment.text,
            forceError: false,
        }),
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 400 || response.status === 500) {
                return Promise.reject(response.status);
            }
        })
        .then((responseData) => {
            return fetch(todosURL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            const getApiComments = responseData.comments.map((comment) => {
                const newDate = format(
                    new Date(comment.date),
                    'yyyy-MM-dd hh.mm.ss',
                );
                return {
                    author: comment.author.name,
                    date: newDate,
                    likes: comment.likes,
                    isLiked: false,
                    text: comment.text,
                };
            });
            commentsData = getApiComments;
            renderComments({ commentsData });
        })
        .then(() => {
            document.getElementById("addingCommentMessage").style.display = "none";
            document.querySelector(".add-form").style.display = "flex";
            commentInput.value = "";
        })
        .catch((error) => {
            document.getElementById("addingCommentMessage").style.display = "none";
            document.querySelector(".add-form").style.display = "flex";

            if (error === 400) {
                alert("Имя и комментарий должны быть не короче 3 символов");
            } else if (error === 500) {
                alert("Сервер сломался, попробуйте позже");
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            }
            console.warn(error);
        });
};

export function login({ login, password }) {
    const buttonElement = document.getElementById("loginButton");
    return fetch(userURL, {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            alert("Неправильный логин или пароль")
        }
        return response.json();
    });
}