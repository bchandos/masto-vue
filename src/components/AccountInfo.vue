<template>
<div class="caption d-block text-justify">
  @{{ account.username }} 
  <span class="ma-3">|</span> 
  {{ account.followers_count }} Followers 
  <span class="ma-3">|</span> 
  {{ account.following_count }} Following 
  <span class="ma-3">|</span> 
  {{ account.statuses_count }} Posts
  <span v-if="account.note" class="d-block" v-html="account.note" />
</div>
</template>

<script>
import { store } from "../store.js";

export default {
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),
    props: {
        account: Object,
    }
}
</script>