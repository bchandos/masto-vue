<template>
    <v-navigation-drawer
      v-model="appState.navigationDrawer"
      app
      clipped
      class="hidden"
    >
      <v-list dense>
        <v-list-item link @click="refreshAndScroll">
          <v-list-item-action>
            <v-icon>mdi-refresh</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Refresh</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="appState.settingsDialog=!appState.settingsDialog">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <v-subheader v-if="userState.currentTag && !userState.selectedTrend">
          CURRENT TAG
        </v-subheader>
        <v-list-item v-if="userState.currentTag && !userState.selectedTrend">
          <v-list-item-action>
            <v-icon>mdi-pound</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ userState.currentTag }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="clearTag">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action v-if="!userState.savedTags.includes(userState.currentTag)">
            <v-btn icon @click="saveTag">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <!-- TODO: Hide-able saved tags -->
        <v-list-item v-if="userState.savedTags.length">
          <v-list-item-content>
            <v-list-item-title>
              SAVED TAGS
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
          v-for="savedTag in userState.savedTags" 
          :key="savedTag" 
          :value="savedTag" 
          link @click="activateSavedTag(savedTag)">
          <v-list-item-action>
            <v-icon>mdi-pound</v-icon>
          </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ savedTag }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
            <v-btn icon @click="deleteSavedTag(savedTag)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              TRENDS
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- TODO: Have an overflow state for this menu? -->
        <v-list-item-group v-model="userState.selectedTrend">
            <v-list-item key="cats-debug" value="cats" @click.native="loadTrends">
              <v-list-item-action>
                <v-icon>mdi-pound</v-icon>
              </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>cats</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item 
              v-for="trend in appState.currentTrends" 
              :key="trend.name" 
              :value="trend.name"
              @click.native="loadTrends"
            >
                <v-list-item-action>
                  <v-icon>mdi-pound</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ trend.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action
                  class="mt-0 mb-0"
                  v-if="trend.name == userState.selectedTrend && !userState.savedTags.includes(trend.name)"
                >
                  <v-btn icon @click.stop="saveTag">
                    <v-icon dense>mdi-content-save</v-icon>
                  </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-spacer />
      <FilterVue />
    </v-navigation-drawer>
</template>
<script>
import { store } from "../store.js";
import FilterVue from '../components/FilterList.vue';

export default {
    components: {
      FilterVue,
    },
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),
    methods: {

        closeOnSm: function() {
          if (this.$vuetify.breakpoint.smAndDown) {
            this.appState.navigationDrawer = false;
          }
        },

        goToTop: function() {
          window.scrollTo(0, 0);
        },

        loadTrends: function() {
          if (this.userState.selectedTrend) {
            store.getTagTimeline(this.userState.selectedTrend);
          } else {
            store.getPublicTimeline();
          }
          this.closeOnSm();
        },

        refreshAndScroll: function() {
          store.updateCurrentFeed();
          store.getTrends();
          this.closeOnSm();
          this.goToTop();
        },

        saveTag: function() {
          this.userState.savedTags.push(this.userState.currentTag);
          store.setStorage();
        },

        deleteSavedTag: function(tag) {
          const index = this.userState.savedTags.indexOf(tag);
          if (index > -1) {
            this.userState.savedTags.splice(index, 1);
            store.setStorage();
          }
        },

        clearTag: function() {
          store.clearTag();
        },

        activateSavedTag: function(tag) {
          this.userState.currentTag = tag;
          this.userState.selectedTrend = '';
          store.getTagTimeline(tag);
          this.closeOnSm();
        },
    },
}
</script>    