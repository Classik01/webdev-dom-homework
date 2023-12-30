const commentList = document.getElementById("commentList");

export function renderComments({commentsData}) {
    const commentList = document.getElementById("commentList");
    commentList.innerHTML = "";

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

        commentList.appendChild(commentItem);
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

    renderComments({commentsData});
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

