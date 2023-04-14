<script lang="ts">
  import Post from '../post/post.svelte';
  import type { AxiosResponse, AxiosError } from 'axios';
  import { authenticated, api, getBearerToken } from '../../stores/auth';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  let auth: boolean;
  authenticated.subscribe((a) => (auth = a));

  let feed: any[] = [];
  function extractData(data: any): any[] {
    const extractedData: any[] = [];
    for (const item of data) {
      feed.push(item);
    }
    return feed;
  }

  async function getData() {
    api.defaults.headers.common['Authorization'] = `Bearer ${getBearerToken()}`;
    const req = await api
      .get('/api/feed')
      .then((response: AxiosResponse<{ user: { name: string } }>) => {
        feed = extractData(response.data);
      })
      .catch((reason: AxiosError<{ additionalInfo: string }>) => {
        console.log(reason.message);
      });
  }
  onMount(async () => {
    await getData();
  });
</script>

<div>
  {#if auth}
    {#each feed as { id, name, post_channel_id, post_title, post_short_description, post_content, post_publication_date, post_tags, author_name, author_id }}
      <div transition:slide>
        <Post
          author_name="{author_name}"
          author_tag="{author_id}"
          post_id="{id}"
          post_title="{post_title}"
          post_short_description="{post_short_description}"
          post_channel_name="{name}"
          publication_date="{post_publication_date}"
          post_content="{post_content}"
          post_tags="{post_tags}"
          edit="{false}" />
      </div>
    {/each}
  {/if}
</div>
