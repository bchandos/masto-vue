<template>
  <v-app id="inspire">
    <Settings v-if="appState.settingsDialog" />
    <NavigationDrawer :class="{blurred: appState.galleryDialog}"/>
    <AppBar :class="{blurred: appState.galleryDialog}"/>
    <!-- TODO: Add toast notification system (copy from budget planner?) -->
    <!-- TODO: Add routing -->
    <v-main>
      <v-container
        class="fill-height"
      >
        <Gallery />
        <TootFeed v-if="appState.primaryView == 'feed'" :class="{blurred: appState.galleryDialog}" />
      </v-container>
    </v-main>
    <v-footer app :class="{blurred: appState.galleryDialog}">
      <v-spacer />
      <span>&copy; 2020-22 <a href="https://billchandos.dev">billchandos.dev</a></span>
    </v-footer>
  </v-app>
</template>

<script>
import { store } from "./store.js";
import TootFeed from "./components/TootFeed.vue";
import NavigationDrawer from './components/NavigationDrawer.vue';
import AppBar from './components/AppBar.vue';
import Settings from './components/Settings.vue';
import Gallery from "./components/Gallery";

  export default {
    components: {
      TootFeed,
      NavigationDrawer,
      AppBar,
      Settings,
      Gallery,
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
  .blurred {
    filter: blur(2px);
  }
</style>
