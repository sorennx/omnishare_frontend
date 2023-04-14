import { writable } from 'svelte/store';

export const apiPath = writable('https://api.kamilpula.com');
export const csrfCookiePath = writable('/sanctum/csrf-cookie');
