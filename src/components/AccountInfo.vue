<template>
<div>
  @{{ account.username }}
  {{ account.followers_count }} Followers / {{ account.following_count }} Following / {{ account.statuses_count }} Posts
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