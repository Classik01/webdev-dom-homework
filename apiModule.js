import { renderComments } from './commentModule.js';

const loadingMessage = document.getElementById("loadingMessage");

export const fetchComments = ({ commentsData }) => {
    return fetch("https://wedev-api.sky.pro/api/v1/aidar-sultanov/comments", {
        method: "GET",
    })
        .then((response) => {
            return response;
        })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            const getApiComments = responseData.comments.map((comment) => {
                return {
                    author: comment.author.name,
                    date: new Date(comment.date),
                    likes: comment.likes,
                    isLiked: false,
                    text: comment.text,
                };
            });
            commentsData = getApiComments;
            loadingMessage.innerText = "";
            renderComments({ commentsData });
        })
};

export const postComment = ({ newComment, commentsData }) => {
    fetch("https://wedev-api.sky.pro/api/v1/aidar-sultanov/comments", {
        method: "POST",
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
            return fetch("https://wedev-api.sky.pro/api/v1/aidar-sultanov/comments", {
                method: "GET",
            })
        })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            const getApiComments = responseData.comments.map((comment) => {
                return {
                    author: comment.author.name,
                    date: new Date(comment.date),
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
            nameInput.value = "";
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