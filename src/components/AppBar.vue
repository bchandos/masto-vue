<template>
  <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="appState.navigationDrawer = !appState.navigationDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mastodon Vuer</v-toolbar-title>
      <v-toolbar-items>
        <v-form @submit.prevent="searchForTag">
          <v-text-field 
            append-icon="mdi-magnify" 
            prepend-inner-icon="mdi-pound"
            class="mt-4 ml-4" 
            clearable
            @click:append="searchForTag"
            @keyup.space="searchForTag"
            v-model="searchTag" />
        </v-form>
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
          // TDOD: Clear toots on search?
          store.getTagTimeline(this.searchTag.split(' ')[0]);
          this.userState.selectedTrend = '';
        }
        this.searchTag = '';
      }
    },
  }
</script>