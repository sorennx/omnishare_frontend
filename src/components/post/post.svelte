<script lang="ts">
  import type { AxiosResponse, AxiosError } from 'axios';
  import { goto } from '$app/navigation';
  import { api, getBearerToken } from '../../stores/auth';
  import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
  import Fa from 'svelte-fa';
  import { faCheck, faEdit, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
  import { slide, fade } from 'svelte/transition';
  export let author_name: string;
  export let author_tag: string;
  export let author_avatar =
    'https://lh3.ggpht.com/_PurPuvPnbIU/TcFG-8KaRVI/AAAAAAAAA10/e4zF8A8gYvs/s72-c/I%20Am%20Not%20A%20Witch%20-%20Monty%20Python%20and%20the%20Holy%20Grail%5B9%5D.jpg?imgmax=300';
  export let post_title: string;
  export let post_id: string;
  export let post_short_description: string;
  export let post_channel_name: string;
  export let publication_date: string;
  export let post_tags: string[];
  export let post_content: string;
  export let edit: boolean;

  let showEditPostModal = false;
  const openModal = async (e: any) => {
    e.preventDefault();
    showEditPostModal = true;
  };

  const editPost = async (e: any) => {
    e.preventDefault();
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const formData = new FormData(e.target);
    let formJson: any = {};
    formData.forEach(function (value, key) {
      formJson[key] = value;
    });
    const req = await api.put('/api/post/' + post_id, formJson).then(function (response) {
      handlePostUpdate();
    });
  };

  let showPostEditSuccessModal = false;
  const handlePostUpdate = async () => {
    showEditPostModal = false;
    showPostEditSuccessModal = true;
  };

  const deletePost = async (e: any) => {
    e.preventDefault();
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const req = await api.delete('/api/post/' + post_id).then(function (response) {
      handlePostDelete();
    });
  };

  let showDeleteConfirmationModal = false;
  let showPostDeleteSuccessModal = false;
  const showDeleteConfModal = async () => {
    showDeleteConfirmationModal = true;
  };

  const handlePostDelete = async () => {
    showEditPostModal = false;
    showPostDeleteSuccessModal = true;
    showDeleteConfirmationModal = false;
  };
</script>

<feed>
  <div class="post_container flex mb-3 flex-col rounded-md dark:bg-gray-700 p-2">
    <div class="post_header flex flex-row">
      <div class="author_details flex border-r dark:border-gray-600">
        <div class="flex flex-row justify-center items-center">
          <div class="author_image w-16 mr-3">
            <img class="object-cover rounded-full" src="{author_avatar}" alt="Post's author's avatar." />
          </div>
          <div class="flex flex-col mr-1 min-w-fit">
            <div class="author_name text-lg">{author_name}</div>
            <div class="author_nickname text-xs">#{author_tag}</div>
          </div>
        </div>
      </div>
      <div class="post_header_details flex flex-row ml-1 grow border-r dark:border-gray-600">
        <div class="post_header_main ml-1">
          <div class="post_main_title">{post_title}</div>
          <div class="post_short_description text-xs">{post_short_description}</div>
        </div>
      </div>
      <div class="post_header_footer items-center flex-col flex basis-40 justify-center">
        <div class="publication_date ml-1 text-sm border-b dark:border-gray-600">{publication_date}</div>
        <div class="post_channel ml-1 text-sm">{post_channel_name}</div>
      </div>
    </div>
    <div class="border-t dark:border-gray-600 mt-1">
      {post_content}
    </div>
    <div class="mt-3 flex">
      {#if edit}
        <Button on:click="{openModal}" id="{post_id}"><Fa icon="{faEdit}" /></Button>
      {/if}
    </div>
  </div>
</feed>

<Modal bind:open="{showEditPostModal}" size="xs" autoclose="{false}" class="w-full">
  <div in:slide>
    <form on:submit|preventDefault="{editPost}" class="flex flex-col space-y-6" action="#">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Edit post</h3>
      <Label class="space-y-2">
        <span>Post title</span>
        <Input type="text" name="post_title" placeholder="Post title" required value="{post_title}" />
      </Label>
      <Label class="space-y-2">
        <span>Post short description</span>
        <Input type="text" name="post_short_description" placeholder="Post short description" required value="{post_short_description}" />
      </Label>
      <Label class="space-y-2">
        <span>Post content</span>
        <Textarea name="post_content" placeholder="Post content" required value="{post_content}" />
      </Label>
      <Label class="space-y-2">
        <span>Post title</span>
        <Input type="date" name="post_publication_date" placeholder="Post title" required value="{publication_date}" />
      </Label>
      <Button type="submit">Edit</Button>
      <Button on:click="{showDeleteConfModal}" type="button" color="red">Delete</Button>
    </form>
  </div>
</Modal>

<Modal bind:open="{showPostEditSuccessModal}" size="xs" autoclose>
  <div transition:slide>
    <div class="text-center flex flex-col">
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Your post has been edited!</h3>
      <div class="flex self-center mb-2">
        <Fa icon="{faCheck}" />
      </div>
      <div class="text-sm mb-2">You might need to refresh the page to see updated content of your post.</div>
      <Button class="flex shrink">Nice!</Button>
    </div>
  </div>
</Modal>

<Modal bind:open="{showDeleteConfirmationModal}" size="xs" autoclose>
  <div class="text-center">
    <svg
      aria-hidden="true"
      class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this post?</h3>
    <Button on:click="{deletePost}" color="red" class="mr-2">Yes, I'm sure</Button>
    <Button outline color="dark">No, cancel</Button>
  </div>
</Modal>

<Modal bind:open="{showPostDeleteSuccessModal}" size="xs" autoclose>
  <div transition:slide>
    <div class="text-center flex flex-col">
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Your post has been deleted.</h3>
      <div class="flex self-center mb-2">
        <Fa icon="{faCheck}" />
      </div>
      <div class="text-sm mb-2">You might need to refresh the page to see updated list of your posts.</div>
      <Button class="flex shrink">Ok</Button>
    </div>
  </div>
</Modal>
