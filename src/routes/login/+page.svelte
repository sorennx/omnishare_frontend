<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import type { AxiosResponse, AxiosError } from 'axios';
  import { goto } from '$app/navigation';
  import Cookies from 'js-cookie';
  import { authenticated, logIn, logOut, api, getBearerToken } from '../../stores/auth';

  async function navigate(/** @type {string | URL} */ link: string | URL) {
    await goto(link);
  }

  let email = '',
    password = '';

  async function getUser() {
    const csrf = await api.get('/sanctum/csrf-cookie');

    const login = await api
      .post('/api/login', {
        email: email,
        password: password,
      })
      .then((response: AxiosResponse<{ token: string }>) => {
        Cookies.set('token', response.data.token, { expires: 60 * 60, sameSite: 'lax' });
        setTimeout(async () => {
          logIn();
        }, 100);

        console.log(response.data.token);
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
</script>

<main class="form-signin">
  <div class="flex flex-col items-center">
    <a href="/home" class="flex items-center mb-6 text-2xl font-semibold text-white">
      <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
      Omnishare
    </a>
    <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">Sign in to your account</h1>
        <form on:submit|preventDefault="{getUser}" class="space-y-4 md:space-y-6" action="#">
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
            <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
            <input
              bind:value="{password}"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              class=" sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button
            type="submit"
            class="w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-600 focus:ring-blue-800"
            >Sign in</button>
          <p class="text-sm font-light text-gray-400">
            Don't have an account yet? <a href="/register" class="font-semibold text-blue-500 hover:underline ">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</main>
