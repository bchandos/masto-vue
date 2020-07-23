<template>
  <v-app id="inspire">
    <Settings v-if="appState.settingsDialog" />
    <NavigationDrawer />
    <AppBar />
    <!-- TODO: Add toast notification system (copy from budget planner?) -->
    <v-content>
      <v-container
        class="fill-height"
      >
        <TootFeed v-if="appState.primaryView == 'feed'" />
      </v-container>
    </v-content>
    <v-footer app>
      <v-spacer />
      <span>&copy; 2020 <a href="https://billchandos.dev">billchandos.dev</a></span>
    </v-footer>
  </v-app>
</template>

<script>
import { store } from "./store.js";
import TootFeed from "./components/TootFeed.vue";
import NavigationDrawer from './components/NavigationDrawer.vue';
import AppBar from './components/AppBar.vue';
import Settings from './components/Settings.vue';

  export default {
    components: {
      TootFeed,
      NavigationDrawer,
      AppBar,
      Settings,
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
      store.loadStorage();
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.appState.navigationDrawer = true;
      }
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
