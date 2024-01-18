import { fetchComments } from './apiModule.js';
import { renderLogin } from './loginModule.js';

document.addEventListener("DOMContentLoaded", function () {

    fetchComments({ renderLogin });

});