<template>
    <v-col class="shrink">
      <AccountHeader v-if="appState.feedView=='account'" />
        <div v-intersect="onIntersect" />
        <v-card 
          dense 
          dark 
          width="500px" 
          v-for="toot in filteredToots" 
          :key="toot.id" 
          class="grey darken-3 pa-2 ma-2 hide-overflow">
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
                  <AccountInfo v-if="hover && appState.feedView!='account'" :account="toot.account" />
                </v-expand-transition>
              </v-card-title>
            </v-hover>
            <v-card-subtitle class="overline pl-7">
              {{ toot.created_at | formatDate }} <span class="ma-3">|</span> {{ toot.account.acct }}
            </v-card-subtitle>
            <v-card-text 
              v-html="toot.content" 
              @click.prevent="captureClick(toot.mentions, toot.tags, $event)"
              />
            <TootCard v-if="toot.card" :card="toot.card" />
            <!-- TODO: card overflow -->
            <!-- TODO: dynamically determine width below -->
            <!-- TODO: GIF/movie stop after x loops? -->
            <div v-for="image in toot.media_attachments" :key="image.id">
              <v-img
              v-if="image.type!='gifv'"
              contain
              :src="image.url"
              :lazy-src="image.preview_url"
              :alt="image.description"
              :aspect-ratio="image.aspect"
              class="mt-2 mb-2"
              ></v-img>
              <video 
                v-if="image.type=='gifv'" 
                autoplay 
                loop 
                muted>
                <source :src="image.url" type="video/mp4"/>
              </video>
            </div>
          <v-card-actions>
            <v-btn icon><v-icon>mdi-comment-outline</v-icon></v-btn> {{ toot.replies_count }}
            <v-spacer/>
            <v-btn icon><v-icon>mdi-repeat</v-icon></v-btn> {{ toot.reblogs_count }}
            <v-spacer />
            <v-btn icon><v-icon>mdi-heart-outline</v-icon></v-btn> {{ toot.favourites_count }}
            <v-spacer/>
          </v-card-actions>
        </v-card>
        <v-fab-transition>
          <v-btn
            v-show="!appState.isIntersecting"
            fab
            fixed
            bottom
            @click="$vuetify.goTo(0)"
          >
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
        </v-fab-transition>
    </v-col>
</template>

<script>
import { store } from "../store.js";
import AccountInfo from '../components/AccountInfo.vue';
import TootCard from '../components/TootCard.vue';
import AccountHeader from '../components/AccountHeader'

export default {
    components: {
      AccountInfo,
      TootCard,
      AccountHeader,
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
          if (!this.userState.activeFilters.includes('sensitive')) {
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
          // Only check for mention and tags if they exist
          if (mentions.length || tags.length) {
            const classes = target.classList;
            if (classes.contains('hashtag') && tags.length) {
              const tag = href.split('/').slice(-1)[0];
              store.getTagTimeline(tag);
            } else if (classes.contains('mention') && mentions.length) {
              // TODO: Handle user profile navigation
              const mentionId = mentions.find(e => e.url == href).id;
              // TODO: Figure out if this ID is universal or unique
              //  to the mastodon server
              this.loadAccount(mentionId);
            }
          } else {
            window.open(href, '_blank');
          }
        }

      },

      loadAccount: function(id) {
        this.appState.feedView = 'account';
        store.getUserTimeline(id);
      },

      onIntersect (entries) {
        // More information about these options
        // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        this.appState.isIntersecting = entries[0].isIntersecting
      },
    },
}
</script>

<style>
  .hide-overflow {
    overflow: hidden;
  }
</style>