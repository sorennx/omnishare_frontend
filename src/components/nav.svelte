<script lang="ts">
  import Fa from 'svelte-fa';
  import { faHome, faSearch, faEnvelope, faUser, faCog, faSignOut } from '@fortawesome/free-solid-svg-icons';
  import { goto } from '$app/navigation';

  import type { AxiosResponse, AxiosError } from 'axios';
  import { api, logOut } from '../stores/auth';
  import Cookies from 'js-cookie';
  
  async function logout() {

    const logout = await api
      .post('/api/logout')
      .then((response: AxiosResponse<{ token: string }>) => {
        logOut();
        Cookies.remove('token', { path: '' })
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

<nav class="dark">
  <aside class="flex items-center justify-between" aria-label="Sidebar">
    <div class="py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
      <a href="/" class="flex items-center pl-2.5 mb-5">
        <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-7" alt="Omnishare Logo" />
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Omnishare</span>
      </a>
      <ul class="space-y-2">
        <li>
          <a href="/" class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faHome}" />
            <span class="ml-3">Home</span>
          </a>
        </li>
        <li>
          <a
            href="/explore"
            class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faSearch}" />
            <span class="flex-1 ml-3 whitespace-nowrap">Explore</span>
          </a>
        </li>
        <!-- <li>
          <a
            href="/messages"
            class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faEnvelope}" />
            <span class="flex-1 ml-3 whitespace-nowrap">Messages</span>
            <span
              class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200"
              >3</span>
          </a>
        </li> -->
        <li>
          <a
            href="/profile"
            class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faUser}" />
            <span class="flex-1 ml-3 whitespace-nowrap">Profile</span>
          </a>
        </li>
        <li>
          <a
            href="/settings"
            class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faCog}" />
            <span class="flex-1 ml-3 whitespace-nowrap">Settings</span>
          </a>
        </li>
        <li>
          <button
            on:click="{logout}"
            class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faSignOut}" />
            <span class="flex-1 ml-3 whitespace-nowrap">Log out</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</nav>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
