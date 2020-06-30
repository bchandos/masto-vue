<template>
  <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon 
        @click.stop="appState.navigationDrawer = !appState.navigationDrawer" />
      <v-toolbar-title>
        <!-- TODO: Custom logo -->
        <v-img 
          src="../assets/logo.png" 
          max-width="1.5em" 
          class="d-inline-flex mr-2 mt-2"
          @click="resetApp"
          />
        <span 
          v-if="$vuetify.breakpoint.mdAndUp" 
          class="d-inline-flex">
          Mastodon Vuer
        </span>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-form @submit.prevent="searchForTag">
          <v-text-field 
            append-icon="mdi-magnify" 
            prepend-inner-icon="mdi-pound"
            class="mt-4 ml-4" 
            clearable
            @click:append="searchForTag"
            @click:clear="clearTag"
            @keyup.space="searchForTag"
            v-model="searchTag" />
        </v-form>
        <v-btn 
          icon
          :color="appState.continuousRefresh ? 'light-blue' : ''"
          @click="toggleRefresh">
          <v-icon>mdi-cloud-refresh</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-progress-linear
        :active="appState.loading"
        :indeterminate="appState.loading"
        absolute
        bottom
      ></v-progress-linear>
    </v-app-bar>
</template>
<script>
import { store } from "../store.js";

  export default {
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
      searchTag: '',
    }),

    methods: {
      searchForTag: function() {
        if (this.searchTag) {
          // TODO: Strip non-characters
          this.appState.feedView = 'tag';
          this.appState.currentToots = [];
          store.getTagTimeline(this.searchTag.split(' ')[0]);
          this.userState.selectedTrend = '';
        }
      },

      clearTag: function() {
        store.clearTag();
      },

      toggleRefresh: function() {
        this.appState.continuousRefresh = !this.appState.continuousRefresh;
        store.pollData();
        if (this.appState.continuousRefresh) {
          store.updateCurrentFeed();
        }
      },

      resetApp: function() {
        this.userState.selectedTrend = '';
        this.appState.feedView = 'public';
        this.appState.currentToots = [];
        this.userState.currentAccount = null;
        store.getPublicTimeline();
      },
    },
  }
</script>