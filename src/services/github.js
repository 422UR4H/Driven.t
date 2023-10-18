import axios from 'axios';
import api from './api';

export async function getGithubAccessToken(code) {
    return await api.get('/auth/acess-token?code=' + code);
}
export async function signInWithGithub(email, password) {
    return await api.post('/auth/sign-in', { email, password });
}
export async function signUpWithGithub(email, password) {
    return await api.post('/users', { email, password });
}

export async function getGithubUserInfo(token) {
    return await axios.get('https://api.github.com/user/emails',{headers:{Authorization:"Bearer " + token}});
}