import { postComment, userName, fetchComments } from './apiModule.js';
import { renderLogin } from './loginModule.js';

function displayComments(commentsData) {
  const commentList = document.getElementById("commentList");
  commentsData.forEach((comment, index) => {
    const commentItem = document.createElement("li");
    commentItem.className = "comment";
    commentItem.style.cursor = "pointer";

    commentItem.addEventListener("click", () => replyToComment(commentsData, index));

    const commentHeader = document.createElement("div");
    commentHeader.className = "comment-header";
    commentHeader.innerHTML = `<div>${comment.author}</div><div>${comment.date.toLocaleString()}</div>`;

    const commentBody = document.createElement("div");
    commentBody.className = "comment-body";
    const commentTextDiv = document.createElement("div");
    commentTextDiv.className = "comment-text";
    commentTextDiv.innerHTML = comment.text;
    commentBody.appendChild(commentTextDiv);

    const commentFooter = document.createElement("div");
    commentFooter.className = "comment-footer";
    const likes = document.createElement("div");
    likes.className = "likes";
    const likeButton = document.createElement("button");
    likeButton.className = "like-button" + (comment.isLiked ? " -active-like" : "");
    likeButton.addEventListener("click", () => toggleLike(commentsData, index));
    likes.innerHTML = `<span class="likes-counter">${comment.likes}</span>`;
    likes.appendChild(likeButton);

    commentFooter.appendChild(likes);
    commentItem.appendChild(commentHeader);
    commentItem.appendChild(commentBody);
    commentItem.appendChild(commentFooter);
    if (commentList) {
      commentList.appendChild(commentItem);
    }
  });
}

export function renderComments({ commentsData }) {
  const appElement = document.getElementById("app");
  if (!userName) {
    appElement.innerHTML = `
      <div class="container">
      <div id="loadingMessage" style="display: flex;">Пожалуйста, подождите, комментарии загружаются...</div>
        <ul class="comments" id="commentList">
        </ul>
        <div id="loginMessage">Чтобы добавить комментарий, 
        <a href="#" id="login-link">авторизуйтесь</a>
      </div>
      </div>
    `;

    const linkElement = document.getElementById("login-link");
    linkElement.addEventListener("click", () => {
      renderLogin({ fetchComments });
    });

    displayComments(commentsData);
    return;
  }
  const appHTML = `
    <div class="container">
    <div id="loadingMessage" style="display: none;">Пожалуйста, подождите, комментарии загружаются...</div>
        <ul class="comments" id="commentList">
        </ul>
        <div id="addingCommentMessage" style="display: none;">Комментарий добавляется...</div>
        <div class="add-form">
            <input id="name-input" type="text" value="${userName}" readonly="readonly" class="add-form-name"  />
            <textarea type="textarea" class="add-form-text" id="commentInput" placeholder="Введите ваш комментарий"
                rows="4"></textarea>
            <div class="add-form-row">
                <button class="add-form-button" id="submitButton">Написать</button>
            </div>
        </div>
    </div>`;
  appElement.innerHTML = appHTML;
  displayComments(commentsData);

  const commentInput = document.getElementById("commentInput");
  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function () {
    const name = userName.value;
    const commentText = escapeHtml(commentInput.value);

    if (commentText.trim() === "") {
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
}

function toggleLike(commentsData, index) {
  event.stopPropagation()
  commentsData[index].isLiked = !commentsData[index].isLiked;
  if (commentsData[index].isLiked) {
    commentsData[index].likes++;
  } else {
    commentsData[index].likes--;
  }

  renderComments({ commentsData });
}

function replyToComment(commentsData, index) {
  const selectedComment = commentsData[index];
  const replyText = `> ${selectedComment.text}
${selectedComment.author} , `;
  commentInput.value = replyText + commentInput.value;
  commentInput.focus();
}

export function escapeHtml(text) {
  return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
