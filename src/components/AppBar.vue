<template>
  <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="appState.navigationDrawer = !appState.navigationDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-img 
          src="../assets/logo.png" 
          max-width="1.5em" 
          class="d-inline-flex mr-2 mt-2"/>
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
            @click:clear="store.clearTag"
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
          this.appState.currentToots = [];
          store.getTagTimeline(this.searchTag.split(' ')[0]);
          this.userState.selectedTrend = '';
        }
      },

      toggleRefresh: function() {
        this.appState.continuousRefresh = !this.appState.continuousRefresh;
        store.updateCurrentFeed();
        store.pollData();
      },
    },
  }
</script>