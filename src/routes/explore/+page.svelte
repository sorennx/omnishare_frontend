<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import axios from 'axios';
  import type { AxiosResponse, AxiosError } from 'axios';
  import { goto } from '$app/navigation';
  import { api, getBearerToken } from '../../stores/auth';
  import { Spinner, Button } from 'flowbite-svelte';

  async function navigate(/** @type {string | URL} */ link: string | URL) {
    await goto(link);
  }

  let user_unsubscribed_channels: any[] = [];
  function extractData(data: any): any[] {
    const extractedData: any[] = [];
    for (const item of data) {
      extractedData.push(item);
    }
    return extractedData;
  }

  async function getUnsubscribedChannels() {
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const req = await api
      .get('/api/explore')
      .then((response: AxiosResponse<{ user: { name: string } }>) => {
        user_unsubscribed_channels = extractData(response.data);
      })
      .catch((reason: AxiosError<{ additionalInfo: string }>) => {
        if (reason.response!.status === 401) {
          // Handle not auth
        } else {
          // Handle else
          console.log(reason.message);
        }
      });
  }
  let post_channel_id = 0;
  const handleSubscribeClick = async (e: any) => {
    e.preventDefault();
    post_channel_id = e.target.id;
    subscribeToChannel(post_channel_id);
    await getUnsubscribedChannels();
  };
  async function subscribeToChannel(id: number) {
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const req = await api
      .post('/api/feed/channel', {
        post_channel_id: id,
      })
      .then((response: AxiosResponse<{ user: { name: string } }>) => {
        user_unsubscribed_channels = extractData(response.data);
        // console.log(response.data);
      })
      .catch((reason: AxiosError<{ additionalInfo: string }>) => {
        console.log(reason.message);
      });
  }

  onMount(async () => {
    getUnsubscribedChannels();
  });

  function convertToHumanReadable(date: string): string {
    let dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    return `${year}-${month}-${day}`;
  }
</script>

<h2 class="text-white mb-2">Explore the channels</h2>
<div class="text-white">
  {#each user_unsubscribed_channels as { id, user_id, name, description, created_at, username }}
    <div transition:slide class="post_container flex mb-3 rounded-md dark:bg-gray-700 p-2 grow">
      <div class="post_header flex flex-row grow">
        <div class="author_details flex border-r dark:border-gray-600">
          <div class="flex flex-row justify-center items-center">
            <div class="author_image w-16 mr-3">
              <img class="object-cover rounded-full" src="" alt="Post's author's avatar." />
            </div>
            <div class="flex flex-col mr-1 min-w-fit">
              <div class="author_name text-lg">{username}</div>
              <div class="author_nickname text-xs">#00{user_id}</div>
            </div>
          </div>
        </div>
        <div class="post_header_details flex flex-row ml-1 grow border-r dark:border-gray-600">
          <div class="post_header_main ml-1">
            <div class="post_main_title">{name}</div>
            <div class="post_short_description text-xs">{description}</div>
          </div>
        </div>
        <div class="post_header_footer items-center flex-col flex basis-40 justify-center">
          <div class="publication_date ml-1 text-sm border-b dark:border-gray-600">{convertToHumanReadable(created_at)}</div>

          <div class="post_channel ml-1 text-sm">
            <Button on:click="{handleSubscribeClick}" id="{id}" size="sm">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
