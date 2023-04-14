<script lang="ts">
  import Nav from '../components/nav.svelte';
  import NologinNav from '../components/nologinNav.svelte';
  import { onMount } from 'svelte';
  import { authenticated, isLoggedIn } from '../stores/auth';
  import { goto } from '$app/navigation';

  async function navigate(/** @type {string | URL} */ link: string | URL) {
    await goto(link);
  }

  let auth: boolean;
  authenticated.subscribe((a) => (auth = a));
  onMount(async () => {
    const isUserLoggedIn = isLoggedIn();
    if (!isUserLoggedIn) {
      navigate('/login');
      authenticated.set(false);
    } else {
      authenticated.set(true);
    }
  });
</script>

<svelte:head>
  <title>Omnishare Solutions</title>
  <script>
    document.documentElement.classList.add('dark');
  </script>
</svelte:head>

<div class="pt-4 flex font-roboto justify-center overflow-y-hidden" style="height:95vh">
  <header class="w-1/4 flex justify-end">
    <div class="px-2">
      {#if auth}
        <Nav />
      {:else}
        <NologinNav />
      {/if}
    </div>
  </header>

  <main class="flex flex-column overflow-y-hidden w-1/2">
    <div class="py-4 overflow-y-scroll min-w-full">
      <slot />
    </div>
  </main>
  <aside class="flex w-1/4"></aside>
</div>

<style>
  :global(body) {
    background-color: rgb(31 41 55);
  }
  :global(::-webkit-scrollbar) {
    display: none;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
