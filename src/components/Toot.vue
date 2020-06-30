<template>
    <v-card dense dark class="grey darken-2">
        <span class="caption font-italic pl-1">In reply to..</span>
        <v-card-title class="headline pt-1">
            <span v-html="toot.account.display_name || toot.account.username"/>
        </v-card-title>
            
        <v-card-subtitle class="overline pl-7">
            {{ toot.created_at | formatDate }} <span class="ma-3">|</span> {{ toot.account.acct }}
        </v-card-subtitle>
        <v-card-text 
            class="mb-0 pb-1"
            v-html="toot.content" 
            @click.prevent="captureClick(toot.mentions, toot.tags, $event)"
        />
        <!--
        <TootCard v-if="toot.card" :card="toot.card" />
        <TootImage 
            v-if="toot.media_attachments.length"
            :mediaAttachments="toot.media_attachments" 
        />
        
        <v-card-actions>
        <v-btn icon><v-icon>mdi-comment-outline</v-icon></v-btn> {{ toot.replies_count }}
        <v-spacer/>
        <v-btn icon><v-icon>mdi-repeat</v-icon></v-btn> {{ toot.reblogs_count }}
        <v-spacer />
        <v-btn icon><v-icon>mdi-heart-outline</v-icon></v-btn> {{ toot.favourites_count }}
        <v-spacer/>
        </v-card-actions>
        -->
    </v-card>
</template>

<script>
import { store } from "../store.js";

export default {
    components: {
    },
    props: {
        toot: {
            type: Object,
            required: true,
        }
    },
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),

    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    },
}
</script>