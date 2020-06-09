<template>
  <v-app id="inspire">
    <NavigationDrawer />
    <!-- TODO: Move app bar into component -->
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="sharedState.navigationDrawer = !sharedState.navigationDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mastodon Vuer</v-toolbar-title>
      <!-- TODO: Refine tag search -->
      <v-toolbar-items>
        <!-- Allow only single word lookup. Check API docs for tag length limit -->
        <v-text-field 
          append-icon="mdi-magnify" 
          prepend-inner-icon="mdi-pound"
          class="mt-4 ml-4" 
          clearable
          @change="searchForTag"
          v-model="searchTag" />
      </v-toolbar-items>
      <v-progress-linear
        :active="sharedState.loading"
        :indeterminate="sharedState.loading"
        absolute
        bottom
      ></v-progress-linear>
    </v-app-bar>
    <!-- TODO: Add toast notification system (copy from budget planner?) -->
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
      searchTag: String,
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
    },
    // TODO: Add polling with frequency settings
    // https://renatello.com/vue-js-polling-using-setinterval/
    methods: {
      searchForTag: function() {
        if (this.searchTag) {
          store.getTagTimeline(this.searchTag);
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
