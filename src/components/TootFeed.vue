<template>
    <v-col class="shrink">
      <v-card v-if="userState.currentAccount">
        <!-- TODO: Add account header card -->
      </v-card>

        <v-card dense dark width="500px" v-for="toot in filteredToots" :key="toot.id" class="grey darken-3 pa-2 ma-2">
            <v-hover v-slot:default="{ hover }">
              <v-card-title class="headline">
                <v-img 
                  :src="toot.account.avatar" 
                  :lazy-src="settings.lazyAvatarUrl"
                  class="avatar ma-2"
                  max-height="2rem" 
                  max-width="2rem"
                  @click="loadAccount(toot.account.id)"
                  />
                <span v-html="toot.account.display_name || toot.account.username"/>
                <v-expand-transition>
                  <AccountInfo v-if="hover" :account="toot.account" />
                </v-expand-transition>
              </v-card-title>
            </v-hover>
            <!-- TODO: Handle Toot Cards -->
            <v-card-subtitle class="overline pl-7">
              {{ toot.created_at | formatDate }} <span class="ma-3">|</span> {{ toot.account.acct }}
            </v-card-subtitle>
            <v-card-text v-html="toot.content" @click.prevent="captureClick(toot.mentions, toot.tags, $event)"></v-card-text>
            <!-- TODO: image overflow -->
            <!-- TODO: dynamically determine width below -->
            
              <v-card v-if="toot.card">
                <v-card-title>
                  {{ toot.card.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ toot.card.description }}
                </v-card-subtitle>
              </v-card>
            <v-img v-for="image in toot.media_attachments" 
              contain
              :key="image.id" 
              :src="image.url"
              :lazy-src="image.preview_url"
              :alt="image.description"
              :aspect-ratio="image.aspect"
              class="mt-2 mb-2"
              ></v-img>
          <v-card-subtitle>
            <v-icon>mdi-comment-outline</v-icon> {{ toot.replies_count }}
            <v-icon class="pl-6">mdi-repeat</v-icon> {{ toot.reblogs_count }}
            <v-icon class="pl-6">mdi-heart-outline</v-icon> {{ toot.favourites_count }}
          </v-card-subtitle>
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
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),
    computed: {
      filteredToots: function() {
        return this.appState.currentToots.filter( (t) => {
          let combinedArray = [true];
          if (this.userState.activeFilters.includes('english')) {
            combinedArray.push(t.language=='en');
          } 
          if (this.userState.activeFilters.includes('bots')) {
            combinedArray.push(t.account.bot==false);
          }
          if (this.userState.activeFilters.includes('sensitive')) {
            combinedArray.push(true);
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
      captureClick: function(mentions, tags, e) {
        // Capture a click inside a Toot so we can redirect
        // tag and mention navigation internally
        let target = null;
        if (e.target.tagName == 'A') {
          target = e.target;
        } else if (e.target.parentElement.tagName == 'A') {
            target = e.target.parentElement;
        }
        // if user has clicked on a link, see if it's
        // a hashtag or a mention, if not, behave as if
        // it's a normal link
        if (target != null) {
          const href = target.href;
          if (mentions.length || tags.length) {
            const classes = target.classList;
            if (classes.contains('hashtag') && tags.length) {
              const tag = href.split('/').slice(-1)[0];
              store.getTagTimeline(tag);
            } else if (classes.contains('mention') && mentions.length) {
              // TODO: Handle user profile navigation
              const mentionId = mentions.find(e => e.url == href).id;
              console.log(mentionId);
            }
          } else {
            window.open(href, '_blank');
          }
        }

      }
    },
}
</script>