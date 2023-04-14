<script lang="ts">
  import axios from 'axios';
  import type { AxiosResponse, AxiosError } from 'axios';
  import { passwordStrength } from 'check-password-strength';
  import type { Result } from 'postcss';
  import { goto } from '$app/navigation';
  import Cookies from 'js-cookie';
  import { authenticated, api, logIn } from '../../stores/auth';
  import { Spinner, Button } from 'flowbite-svelte';
  async function navigate(/** @type {string | URL} */ link: string | URL) {
    await goto(link);
  }

  let email = '',
    password = '',
    username = '';

  const http = axios.create({
    baseURL: 'https://api.kamilpula.com',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
  });

  let isPasswordValid = false;
  let hasUppercase = false;
  let hasLowercase = false;
  let hasDigit = false;
  let hasSymbol = false;

  function validatePassword(password: string): any {
    return passwordStrength(password);
  }

  let showLoader = false;
  const toggleLoader = () => {
    showLoader = !showLoader;
  };

  api.interceptors.request.use((config) => {
    toggleLoader();
    return config;
  });

  async function handleRegistrationSuccess() {
    goto('/login');
  }

  async function getUser() {
    const login = await api
      .post('/api/login', {
        email: email,
        password: password,
      })
      .then((response: AxiosResponse<{ token: string }>) => {
        logIn();
        Cookies.set('token', response.data.token, { expires: 86400, sameSite: 'lax' });
      })
      .catch((reason: AxiosError<{ additionalInfo: string }>) => {
        if (reason.response!.status === 401) {
          // Handle bad credentials
        } else {
          // Handle else
          console.log(reason.message);
        }
      });
  }

  async function registerUser() {
    if (validatePassword(password)) {
      const csrf = await api.get('/sanctum/csrf-cookie');
      const register = await api
        .post('/api/register', {
          name: username,
          password: password,
          password_confirmation: password,
          email: email,
        })
        .then((response: AxiosResponse<{ user: { name: string } }>) => {
          setTimeout(() => {
            getUser();
          }, 200);
        })
        .catch((reason: AxiosError<{ additionalInfo: string }>) => {
          if (reason.response!.status === 401) {
            setTimeout(() => {
              toggleLoader();
            }, 200);
          } else {
            // Handle else
            console.log(reason.message);
          }
          authenticated.set(false);
        });
    }
  }

  $: {
    let validationResult: any = validatePassword(password);
    if (validationResult['contains'].includes('lowercase')) {
      hasLowercase = true;
    } else {
      hasLowercase = false;
    }
    if (validationResult['contains'].includes('uppercase')) {
      hasUppercase = true;
    } else {
      hasUppercase = false;
    }
    if (validationResult['contains'].includes('number')) {
      hasDigit = true;
    } else {
      hasDigit = false;
    }
    if (validationResult['contains'].includes('symbol')) {
      hasSymbol = true;
    } else {
      hasSymbol = false;
    }
  }
</script>

<main class="form-signin">
  <div class="flex flex-col items-center">
    <a href="/home" class="flex items-center mb-6 text-2xl font-semibold text-white">
      <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
      Omnishare
    </a>
    <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">Register account</h1>
        <form on:submit|preventDefault="{registerUser}" class="space-y-4 md:space-y-6" action="#">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-white">Your email</label>
            <input
              bind:value="{email}"
              type="email"
              name="email"
              id="email"
              class=" bordersm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 :border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email" />
          </div>
          <div>
            <label for="username" class="block mb-2 text-sm font-medium text-white">Your username</label>
            <input
              bind:value="{username}"
              type="username"
              name="username"
              id="username"
              class=" bordersm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 :border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Username" />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
            <input
              bind:value="{password}"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              class=" sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          {#if !isPasswordValid}
            <div id="validation_errors" class="text-white">
              Your password needs to consist of at least:
              <ul class="list-disc">
                {#if !hasUppercase}
                  <li id="characters-upper-let-req">one uppercase letter</li>
                {/if}
                {#if !hasLowercase}
                  <li id="characters-lower-let-req">one lowercase letter</li>
                {/if}
                {#if !hasDigit}
                  <li id="characters-min-digit">one digit</li>
                {/if}
                {#if !hasSymbol}
                  <li id="characters-min-digit">one special symbol</li>
                {/if}
              </ul>
            </div>
          {/if}

          {#if !showLoader}
            <button
              type="submit"
              class="w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-600 focus:ring-blue-800"
              >Register</button>
          {:else}
            <button
              disabled
              class="w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-600 focus:ring-blue-800"
              ><Spinner size="4" /></button>
          {/if}
        </form>
      </div>
    </div>
  </div>
</main>
