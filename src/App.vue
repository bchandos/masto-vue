<template>
  <v-app id="inspire">
    <NavigationDrawer />
    <AppBar />
    <!-- TODO: Add toast notification system (copy from budget planner?) -->
    <v-content>
      <v-container
        class="fill-height"
      >
        <v-row
          align="center"
          justify="center"
        >
          <!-- TODO: Move this column left and add another to the right for spotlight -->
          <TootFeed v-if="appState.primaryView == 'feed'" />
        </v-row>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2020 <a href="https://billchandos.dev">billchandos.dev</a></span>
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
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),

    created () {
      this.$vuetify.theme.dark = true;
      store.getPublicTimeline();
      store.getTrends();
      store.pollData();
    },
    beforeDestroy () {
      clearInterval(this.appState.polling);
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
