<template>
<!-- TODO: Figure out desired auto-scroll behavior (maybe to top when clicking menu, no change during regular updates) -->
    <v-col class="shrink">
        <v-card width="500px" v-for="toot in englishToots" :key="toot.id" class="grey darken-3 pa-2 ma-2">
            <v-card-title class="headline">
            <v-img :src="toot.account.avatar" class="avatar ma-2" max-height="2rem" max-width="2rem"/>
            <span v-html="toot.account.display_name || toot.account.username"/>
            </v-card-title>
            <v-card-subtitle class="overline pl-7">
            {{ toot.created_at | formatDate }}
            </v-card-subtitle>
            <v-card-text v-if="toot.new_content" v-html="toot.new_content"></v-card-text>
            <v-card-text v-else v-html="toot.content"></v-card-text>
            <v-img v-for="image in toot.media_attachments" :key="image.id" :src="image.preview_url" :alt="image.description"></v-img>
        </v-card>
    </v-col>
</template>

<script>
import { store } from "../store.js";

export default {
    data: () => ({
      sharedState: store.state,
    }),
    computed: {
      englishToots: function() {
        // TODO: Optional bot filter
        return this.sharedState.currentToots.filter(t => t.language=='en' && t.sensitive==false);
      }
    },
    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    }
}
</script>