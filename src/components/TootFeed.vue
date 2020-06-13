<template>
<!-- TODO: Figure out desired auto-scroll behavior (maybe to top when clicking menu, no change during regular updates) -->
    <v-col class="shrink">
        <v-card dense dark width="500px" v-for="toot in filteredToots" :key="toot.id" class="grey darken-3 pa-2 ma-2">
            <!-- TODO: Some kind of slick user info interface -->
            <!-- <v-hover v-slot:default="{ hover }"> -->
              <v-card-title class="headline">
                <v-img :src="toot.account.avatar" class="avatar ma-2" max-height="2rem" max-width="2rem"/>
                <span v-html="toot.account.display_name || toot.account.username"/>
                <!-- <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal caption white--text"
                    style="height: 100%;"
                    v-html="toot.account.note"
                  >
                  </div>
                </v-expand-transition> -->
              </v-card-title>
            <!-- </v-hover> -->
            <v-card-subtitle class="overline pl-7">
            {{ toot.created_at | formatDate }}
            </v-card-subtitle>
            <v-card-text v-if="toot.new_content" v-html="toot.new_content"></v-card-text>
            <v-card-text v-else v-html="toot.content" @click.prevent="captureClick"></v-card-text>
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
        console.log(ev);
      }
    },
}
</script>