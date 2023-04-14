import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export const authenticated = writable(false);
import { goto } from '$app/navigation';
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import cookie from 'cookie';

const navigate = async (/** @type {string | URL} */ link: string | URL) => {
  await goto(link);
};

export const isUserLoggedIn = writable({
  token: '',
});

export const api = axios.create({
  baseURL: 'https://api.kamilpula.com',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      logOut();
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);

export function getBearerToken() {
  return Cookies.get('token');
}

export const isLoggedIn = (reqCookies = null) => {
  // if we don't have request cookies, get the cookie from client
  if (!reqCookies) {
    return !!Cookies.get('ticket_management_is_user_logged_in');
  }

  // otherwise get cookie from server
  return !!cookie.parse(reqCookies).ticket_management_is_user_logged_in;
};

export const logIn = () => {
  Cookies.set('ticket_management_is_user_logged_in', 'true', { expires: 86400, sameSite: 'lax' });
  axios.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
  authenticated.set(true);
  navigate('/');
};

export const logOut = () => {
  if (typeof window !== 'undefined') {
    // remove logged in user's cookie and redirect to login page
    Cookies.remove('token', { path: '' });
    Cookies.remove('ticket_management_is_user_logged_in', { expires: 86400, sameSite: 'lax' });
    authenticated.set(false);
    navigate('/login');
  }
};
