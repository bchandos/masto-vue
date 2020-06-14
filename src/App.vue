<template>
  <v-app id="inspire">
    <NavigationDrawer />
    <AppBar />
    <!-- TODO: Add toast notification system (copy from budget planner?) -->
    <v-content>
      <v-container
        class="fill-height"
        
      >
        <v-col>
          <v-row
            align="center"
            justify="center"
          >
          <!-- TODO: Move this column left and add another to the right for spotlight -->
            <TootFeed />
          </v-row>
        </v-col>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import { store } from "./store.js";
import TootFeed from "./components/TootFeed.vue";
import NavigationDrawer from './components/NavigationDrawer.vue';
import AppBar from './components/AppBar.vue';

  export default {
    components: {
      TootFeed,
      NavigationDrawer,
      AppBar,
    },
    props: {
      source: String,
    },

    data: () => ({
      sharedState: store.state,
      searchTag: '',
    }),

    created () {
      this.$vuetify.theme.dark = true;
      store.getPublicTimeline();
      store.getTrends();
      store.pollData();
    },
    beforeDestroy () {
      clearInterval(this.sharedState.polling);
    },
    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    },
    methods: {
      searchForTag: function() {
        if (this.searchTag) {
          // TDOD: Clear toots on search?
          store.getTagTimeline(this.searchTag.split(' ')[0]);
          this.sharedState.selectedTrend = '';
        }
        this.searchTag = '';
      }
    },
  }
</script>
<style>
  .emoji {
    width: 1rem;
  }
  .avatar {
    border-radius: 50%;
  }
</style>
