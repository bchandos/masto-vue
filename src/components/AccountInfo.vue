<template>
<div class="caption d-block text-justify">
  @{{ account.username }} 
  <span class="ma-3">|</span> 
  {{ account.followers_count }} Followers 
  <span class="ma-3">|</span> 
  {{ account.following_count }} Following 
  <span class="ma-3">|</span> 
  {{ account.statuses_count }} Posts
</div>
</template>

<script>
import { store } from "../store.js";

export default {
    data: () => ({
      sharedState: store.state,
    }),
    props: {
        account: Object,
    }
}
</script>