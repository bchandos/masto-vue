<template>
    <v-list dense>
        <v-list-item-group multiple v-model="userState.activeFilters">
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
</template>

<script>
import { store } from "../store.js";

export default {
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),
}
</script>