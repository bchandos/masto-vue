<template>
  <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="sharedState.navigationDrawer = !sharedState.navigationDrawer"></v-app-bar-nav-icon>
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
        :active="sharedState.loading"
        :indeterminate="sharedState.loading"
        absolute
        bottom
      ></v-progress-linear>
    </v-app-bar>
</template>
<script>
import { store } from "../store.js";

  export default {
    data: () => ({
      sharedState: store.state,
      searchTag: '',
    }),

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