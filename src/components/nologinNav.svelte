<script>
  import Fa from 'svelte-fa';
  import { faHome, faSearch, faSignIn } from '@fortawesome/free-solid-svg-icons';
  import { goto } from '$app/navigation';

  const navigate = async (/** @type {string | URL} */ link) => {
    await goto(link);
  };
</script>

<nologinNav class="dark">
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
        <li>
          <a href="/login" class="flex items-center p-2 text-xl font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Fa icon="{faSignIn}" />
            <span class="flex-1 ml-3 whitespace-nowrap">Log in</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</nologinNav>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
