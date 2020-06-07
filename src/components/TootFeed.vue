<template>
    <v-col class="shrink">
        <v-card width="500px" v-for="toot in sharedState.currentToots" :key="toot.id" class="grey darken-3 pa-2 ma-2">
            <v-card-title class="headline">
            <v-img :src="toot.account.avatar" class="avatar ma-2" max-height="2rem" max-width="2rem"/>
            <span v-html="toot.account.display_name"/>
            </v-card-title>
            <v-card-subtitle class="overline pl-7">
            {{ toot.created_at | formatDate }}
            </v-card-subtitle>
            <v-card-text v-if="toot.new_content" v-html="toot.new_content"></v-card-text>
            <v-card-text v-else v-html="toot.content"></v-card-text>
            <v-img v-for="image in toot.media_attachments" :key="image.id" :src="image.preview_url"></v-img>
        </v-card>
    </v-col>
</template>

<script>
import { store } from "../store.js";

export default {
    data: () => ({
      sharedState: store.state,
    }),

    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    }
}
</script>