<template>
  <v-app id="inspire">
    <NavigationDrawer />
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="sharedState.navigationDrawer = !sharedState.navigationDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mastodon Vue-r</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
        <!-- TODO: Move this column left and add another to the right for spotlight -->
          <TootFeed />
        </v-row>
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

  export default {
    components: {
      TootFeed,
      NavigationDrawer,
    },
    props: {
      source: String,
    },

    data: () => ({
      sharedState: store.state,
    }),

    created () {
      this.$vuetify.theme.dark = true;
      store.getPublicTimeline();
      store.getTrends();
    },
    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    }
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
