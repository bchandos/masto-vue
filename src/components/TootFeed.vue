<template>
    <v-col class="shrink">
        <v-card dense dark width="500px" v-for="toot in filteredToots" :key="toot.id" class="grey darken-3 pa-2 ma-2">
            <!-- TODO: Some kind of slick user info interface -->
            <v-hover v-slot:default="{ hover }">
              <v-card-title class="headline">
                <v-img :src="toot.account.avatar" class="avatar ma-2" max-height="2rem" max-width="2rem"/>
                <span v-html="toot.account.display_name || toot.account.username"/>
            <AccountInfo v-if="hover" :account="toot.account" />
              </v-card-title>
            </v-hover>
            
            <v-card-subtitle class="overline pl-7">
            {{ toot.created_at | formatDate }}
            </v-card-subtitle>
            <v-card-text v-if="toot.new_content" v-html="toot.new_content"></v-card-text>
            <v-card-text v-else v-html="toot.content" @click.prevent="captureClick"></v-card-text>
            <!-- TODO: placeholder image here and avatar (blurhash???)-->
            <v-img v-for="image in toot.media_attachments" 
              :key="image.id" 
              :src="image.url"
              :alt="image.description"
              :aspect-ratio="image.aspect"
              ></v-img>
        </v-card>
    </v-col>
</template>

<script>
import { store } from "../store.js";
import AccountInfo from '../components/AccountInfo.vue';

export default {
    components: {
      AccountInfo,
    },
    data: () => ({
      sharedState: store.state,
    }),
    computed: {
      filteredToots: function() {
        return this.sharedState.currentToots.filter( (t) => {
          let combinedArray = [true];
          if (this.sharedState.activeFilters.includes('english')) {
            combinedArray.push(t.language=='en');
          } 
          if (this.sharedState.activeFilters.includes('bots')) {
            combinedArray.push(t.account.bot==false);
          }
          if (this.sharedState.activeFilters.includes('sensitive')) {
            combinedArray.push(t.sensitive==true);
          } else {
            combinedArray.push(t.sensitive==false);
          }
          return combinedArray.every(Boolean);
        });
      }
    },
    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    },

    methods: {
      // TODO: capture tag clicks, pass all others
      captureClick: function(ev) {
        if (ev.target.nodeName=='A') {
        console.log(ev.target);
        } else {
          console.log(ev.target.parentNode);
        }
      },
    },
}
</script>