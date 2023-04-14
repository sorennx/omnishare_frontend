<script lang="ts">
  import Tags from 'svelte-tags-input';
  import { Textarea, Label, Button } from 'flowbite-svelte';
  import type { AxiosResponse, AxiosError } from 'axios';
  import { api, getBearerToken } from '../../stores/auth';
  import { Spinner } from 'flowbite-svelte';

  const tagList = ['Cool', 'Nice', 'Now', 'Amazing'];
  export let showCreatePost: boolean;
  export let post_channel_id: string;
  export let post_title: string;

  let post_short_description = '';
  let post_tags: any = [];
  let post_publication_date = '';
  let post_content = '';

  const validatePost = (postData: FormData) => {
    let check = true;
    for (const pair of postData.entries()) {
      if (pair[1] == '') {
        check = false;
        console.log('Fill all the fields in post form.');
        return check;
      }
    }
    if (post_channel_id == '0' || post_channel_id == '') {
      check = false;
    }
    return check;
  };

  let showLoader = false;
  const toggleLoader = () => {
    showLoader = !showLoader;
  };

  api.interceptors.request.use((config) => {
    toggleLoader();
    return config;
  });

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      // Hide the loader after receiving the response
      setTimeout(() => {
        toggleLoader();
      }, 200);
      setTimeout(() => {
        handlePostSaveSuccess();
      }, 1000);
      // toggleLoader();
      return response;
    },
    (error) => {
      // Hide the loader on error
      toggleLoader();
      return Promise.reject(error);
    }
  );

  async function savePost(postData: FormData) {
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const req = await api
      .post('/api/post', postData)
      .then((response: AxiosResponse<{ user: { name: string } }>) => {
        console.log(response);
      })
      .catch((reason: AxiosError<{ message: string }>) => {
        console.log(reason.message);
      });
  }

  async function sendPost() {
    let postData = new FormData();
    postData.append('post_title', post_title);
    postData.append('post_channel_id', post_channel_id);
    postData.append('post_short_description', post_short_description);
    postData.append('post_content', post_content);
    postData.append('post_publication_date', post_publication_date);
    postData.append('post_tags', post_tags);
    if (validatePost(postData)) {
      await savePost(postData);
    }
  }

  function handlePostSaveSuccess() {
    // Reset form elements
    document.getElementById('post_creation_form')!.reset();
    post_title = '';
    post_channel_id = '';
    showCreatePost = false;
    // Reset tag component
    post_tags = [];
  }
</script>

<createpost>
  <div class="post_container flex flex-col mb-3 rounded-md dark:bg-gray-700 p-2">
    <form class="flex grow" id="post_creation_form">
      <div class="flex flex-row grow">
        <div class="flex flex-col ml-1 grow">
          <div class="flex mb-2 justify-between grow">
            <div class="flex flex-row grow mr-10">
              <label
                for="short_desc"
                class="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-l-lg dark:bg-gray-600 dark:hover:bg-gray-600 dark:text-white border-r dark:border-gray-600"
                >Short desc</label>
              <div class="flex w-full">
                <input
                  bind:value="{post_short_description}"
                  required
                  maxlength="255"
                  type="textarea"
                  id="post_short_description"
                  name="post_short_description"
                  class="border dark:border-gray-600 rounded-r-lg bg-gray-50 text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:outline-0" />
              </div>
            </div>
            <div class="flex flex-row">
              <label
                for="post_title"
                class="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-l-lg dark:bg-gray-600 dark:hover:bg-gray-600 dark:text-white border-r dark:border-gray-600"
                >Date</label>
              <input
                bind:value="{post_publication_date}"
                required
                type="date"
                class="flex grow border dark:border-gray-600 rounded-r-lg bg-gray-50 text-gray-900 text-sm w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:outline-0" />
            </div>
          </div>
          <div class="flex grow mb-2"></div>
          <div class="mb-2">
            <Label for="post_content" class="mb-2">Post content</Label>
            <Textarea bind:value="{post_content}" id="post_content" placeholder="Post content" rows="4" name="message" />
          </div>
          <div class="tags-input text-black">
            <Tags
              bind:tags="{post_tags}"
              addKeys="{[9, 13]}"
              maxTags="{5}"
              allowPaste="{true}"
              allowDrop="{true}"
              splitWith="{'/'}"
              onlyUnique="{true}"
              removeKeys="{[27, 8]}"
              placeholder="{'Enter tags for your post'}"
              autoComplete="{tagList}"
              name="{'post-tags'}"
              id="{'post-tags'}"
              allowBlur="{true}"
              disable="{false}"
              readonly="{false}"
              minChars="{3}"
              onlyAutocomplete="{false}"
              labelText="{'Tags'}"
              labelShow />
          </div>
        </div>
      </div>
    </form>
    <div class="flex-shrink-0 inline-flex items-center ml-1 mt-2 text-sm">
      {#if !showLoader}
        <Button
          btnClass="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-gray-100 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white border-0"
          on:click="{sendPost}">Send</Button>
      {:else}
        <Button disabled>
          <Spinner size="4" />
        </Button>
      {/if}
    </div>
  </div>
</createpost>

<style>
  .tags-input :global(.svelte-tags-input-layout) {
    --tw-bg-opacity: 1;
    background-color: rgb(55 65 81 / var(--tw-bg-opacity));
    display: flex;
    border: 1px solid rgb(75 85 99);
    box-sizing: border-box;
    border-radius: 0.5rem;
  }

  .tags-input :global(.svelte-tags-input-layout label) {
    --tw-bg-opacity: 1;
    background-color: rgb(75 85 99 / var(--tw-bg-opacity));
    padding: 0;
    color: #ffffff;
    font-weight: normal;
    padding: 0.625rem;
    display: inline-flex;
    flex-shrink: 0;
    border: 1px solid rgb(75 85 99);
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    margin: 0 0.2rem 0 0;
  }

  .tags-input :global(.svelte-tags-input) {
    background-color: rgb(55 65 81);
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding-top: 0.625rem /* 10px */;
    padding-bottom: 0.625rem /* 10px */;
    margin: 0 0 0 0.2rem;
    align-self: center;
    color: #ffffff;
    font-weight: normal;
  }

  .tags-input :global(.svelte-tags-input-layout) {
    margin: 0;
    padding: 0;
  }

  .tags-input :global(.svelte-tags-input-tag.focus),
  .tags-input :global(.svelte-tags-input:focus) {
    outline: 0;
  }
  .tags-input :global(.svelte-tags-input-layout:focus),
  .tags-input :global(.svelte-tags-input-layout:hover),
  .tags-input :global(.svelte-tags-input-layout:focus-within) {
    outline: 0;
    border: 1px solid rgb(75 85 99);
  }
  .tags-input :global(.svelte-tags-input-tag) {
    background-color: rgb(75 85 99);
    margin: 0;
    align-self: center;
    border-radius: 0.5rem;
    margin-right: 0.1rem;
    margin-left: 0.1rem;
    padding: 0.2rem;
  }
</style>
