<template>
    <v-navigation-drawer
      v-model="sharedState.navigationDrawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link @click="refreshCurrentFeed">
          <v-list-item-action>
            <v-icon>mdi-refresh</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Refresh</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <!-- TODO: Saved tags & tag history -->
        <v-list-item-group v-model="sharedState.selectedTrend">
            <v-list-item key="cats-debug" value="cats" @click.native="loadTrends">
              <v-list-item-action>
                <v-icon>mdi-pound</v-icon>
              </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>cats</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item 
              v-for="trend in sharedState.currentTrends" 
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
            </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
import { store } from "../store.js";

export default {
    data: () => ({
      sharedState: store.state,
    }),
    methods: {
        loadTrends: function() {
          if (this.sharedState.selectedTrend) {
            store.getTagTimeline(this.sharedState.selectedTrend);
          } else {
            store.getPublicTimeline();
          }
        },

        refreshCurrentFeed: function() {
          if (this.sharedState.selectedTrend) {
            store.updateTagTimeline();
          } else {
            store.updatePublicTimeline();
          }
        },
    },
}
</script>    