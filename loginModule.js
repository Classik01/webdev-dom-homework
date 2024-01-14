import { login, setToken, setUserName } from "./apiModule.js"

export const renderLogin = ({ fetchComments }) => {
    const appElement = document.getElementById("app");
    const loginHTML = `
    <div class="container">
        <ul class="login" id="loginList">
        </ul>
        <div class="login-form">
            <div class="login-title">Форма входа</div>
            <input type="text" class="add-form-login" id="loginInput" placeholder="Введите логин" />
            <input type="password" class="add-form-password" id="passwordInput" placeholder="Введите пароль" />
            <div class="login-form-row">
                <button class="login-form-button" id="loginButton">Войти</button>
            </div>
        </div>
    </div>`;
    appElement.innerHTML = loginHTML;

    const buttonElement = document.getElementById("loginButton");
    const loginInputElement = document.getElementById("loginInput");
    const passwordInputElement = document.getElementById("passwordInput");

    let isButtonClicked = false;

    buttonElement.addEventListener("click", () => {
        if (!isButtonClicked) {
            isButtonClicked = true;
            buttonElement.textContent = "Подождите";
            buttonElement.disabled = true;
            login({
                login: loginInputElement.value,
                password: passwordInputElement.value,
            }).then((responseData) => {
                setToken(responseData.user.token);
                setUserName(responseData.user.name);
            }).then((commentsData) => {
                fetchComments({ commentsData });
            }).catch((error) => {
                isButtonClicked = false;
                buttonElement.disabled = false;
                console.warn(error);
                buttonElement.textContent = "Войти";
            }).finally(() => {
                if (!isButtonClicked) {
                    buttonElement.textContent = "Войти";
                }
            });
        }
    });
}
