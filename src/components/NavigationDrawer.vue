<template>
    <v-navigation-drawer
      v-model="sharedState.navigationDrawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <!-- TODO: Add a refresh button -->
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
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
        <v-list-item-group v-model="sharedState.selectedTrend">
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
        }
    },
}
</script>    