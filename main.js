import { renderComments, escapeHtml } from './commentModule.js';
import { fetchComments, postComment } from './apiModule.js';

document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("nameInput");
    const commentInput = document.getElementById("commentInput");
    const submitButton = document.getElementById("submitButton");

    let commentsData = [];

    fetchComments({commentsData});

    submitButton.addEventListener("click", function () {
        const name = escapeHtml(nameInput.value);
        const commentText = escapeHtml(commentInput.value);

        if (name.trim() === "" || commentText.trim() === "") {
            alert("Пожалуйста, заполните все поля.");
            return;
        }
  
        const newComment = {
            name: name,
            date: new Date(),
            text: commentText,
            likes: 0,
            isLiked: false,
        };

        document.querySelector(".add-form").style.display = "none";
        document.getElementById("addingCommentMessage").style.display = "block";

        postComment({ newComment, commentsData });

    });

    renderComments({commentsData});
});