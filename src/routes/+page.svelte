<svelte:options accessors />

<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { AxiosResponse, AxiosError } from 'axios';
  import { api, getBearerToken, authenticated } from '../stores/auth';
  import FeedChannel from '../components/feed/feed-channel.svelte';
  import CreatePost from '../components/feed/create-post.svelte';
  import Fa from 'svelte-fa';
  import { faCheck, faEdit, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import { Button, Dropdown, DropdownItem, Chevron, Modal, Input, Label, Textarea } from 'flowbite-svelte';
  import { goto } from '$app/navigation';

  $: showCreatePost = false;
  let post_channel = '';
  let post_channel_id: string = '0';
  $: post_title = '';
  let dropdownOpen: false;

  const handleCreatePostClick = (e: any) => {
    e.preventDefault();
    showCreatePost = !showCreatePost;
  };

  const handleChannelSelect = (e: any) => {
    e.preventDefault();
    post_channel = e.target.innerText;
    post_channel_id = e.target.id;
    dropdownOpen = false;
  };

  let post_channel_data: any[] = [];
  const populatePostChannelData = (data: any) => {
    post_channel_data = [];
    post_channel_data.push(data);
  };

  async function getData() {
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const req = await api
      .get('/api/post/post-channel')
      .then(function (response) {
        populatePostChannelData(response.data);
      })
      .catch((reason: AxiosError<{ status: string }>) => {
        console.log(reason.message);
      });
  }

  onMount(async () => {
    await getData();
  });

  let showModal = false;

  const openModal = (e: any) => {
    e.preventDefault();
    showModal = true;
  };

  const createPostChannel = async (e: any) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const formData = new FormData(e.target);
    const req = await api.post('/api/post/post-channel', formData).then(function (response) {
      handlePostChannelCreationSuccess();
    });
  };

  let showPostChannelCreationSuccessModal = false;
  async function handlePostChannelCreationSuccess() {
    showPostChannelCreationSuccessModal = true;
    showModal = false;
    await getData();
  }
</script>

<div class="dark:text-white mb-3">
  <div class="mb-3">
    <h3>Latest Shares</h3>
  </div>

  <div class="text-sm">
    <div class="flex">
      <Button
        btnClass="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border-r dark:border-gray-600"
        ><Chevron>
          {#if post_channel == ''}
            Channel
          {:else}
            {post_channel}
          {/if}
        </Chevron>
      </Button>
      <Dropdown bind:open="{dropdownOpen}">
        {#if post_channel_data.length > 0}
          {#each post_channel_data[0] as { id, name }}
            <DropdownItem on:click="{handleChannelSelect}" id="{id}">{name}</DropdownItem>
          {/each}
        {/if}
        <DropdownItem on:click="{openModal}">
          <div class="flex row">
            <div class="flex grow">Create new</div>
            <div class="ml-1"><Fa size="lg" icon="{faPlusCircle}" /></div>
          </div>
        </DropdownItem>
      </Dropdown>
      <input
        bind:value="{post_title}"
        id="post_title"
        required
        maxlength="255"
        type="text"
        placeholder="Title of your post"
        class="bg-gray-50 text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:outline-0" />
      <Button
        on:click="{handleCreatePostClick}"
        btnClass="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border-l dark:border-gray-600"
        ><Fa icon="{faEdit}" /></Button>
    </div>
  </div>
</div>
{#if showCreatePost}
  <div transition:slide class="flex flex-col dark:text-white">
    <CreatePost bind:post_title post_channel_id="{post_channel_id}" bind:showCreatePost />
  </div>
{/if}

{#if showModal}
  <Modal bind:open="{showModal}" size="xs" autoclose="{false}" class="w-full">
    <form on:submit|preventDefault="{createPostChannel}" class="flex flex-col space-y-6" action="#">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Create new post channel</h3>
      <Label class="space-y-2">
        <span>Post channel name</span>
        <Input type="text" name="name" placeholder="Post channel name" required />
      </Label>
      <Label class="space-y-2">
        <span>Description</span>
        <Textarea name="description" placeholder="Descirption" required />
      </Label>
      <Button type="submit"><Fa icon="{faPlus}" /></Button>
    </form>
  </Modal>
{/if}
<Modal bind:open="{showPostChannelCreationSuccessModal}" size="xs" autoclose>
  <div class="text-center flex flex-col">
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Your channel has been created!</h3>
    <div class="flex self-center mb-2">
      <Fa icon="{faCheck}" />
    </div>

    <Button class="flex shrink">Cool!</Button>
  </div>
</Modal>
<div class="flex flex-col dark:text-white">
  <FeedChannel />
</div>
