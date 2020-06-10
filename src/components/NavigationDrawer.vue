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
        <v-subheader v-if="sharedState.currentTag">
          CURRENT TAG
        </v-subheader>
        <v-list-item v-if="sharedState.currentTag">
          <v-list-item-action>
            <v-icon>mdi-pound</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ sharedState.currentTag }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="clearTag">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon>
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <!-- TODO: Saved tags & tag history -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              TRENDS
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
      <v-spacer />
      <v-list dense>
        <v-list-item-group multiple v-model="sharedState.activeFilters">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                FILTERS
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="english">
            <v-list-item-action>
              <v-icon>mdi-filter</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                English
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="sensitive">
            <v-list-item-action>
              <v-icon>mdi-filter</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Sensitive
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item value="bots">
            <v-list-item-action>
              <v-icon>mdi-filter</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Bots
              </v-list-item-title>
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
      // TODO: implement some scrolling
      // this.$vuetify.goTo(0);
      // or ... window.scrollTo(0, 0);
        loadTrends: function() {
          if (this.sharedState.selectedTrend) {
            store.getTagTimeline(this.sharedState.selectedTrend);
          } else {
            store.getPublicTimeline();
          }
        },

        refreshCurrentFeed: function() {
          if (this.sharedState.selectedTrend || this.sharedState.currentTag) {
            store.updateTagTimeline();
          } else {
            store.updatePublicTimeline();
          }
        },

        clearTag: function() {
          this.sharedState.currentTag = '';
          this.sharedState.selectedTrend = '';
          store.getPublicTimeline();
        },
    },
}
</script>    