<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mastodon Vue-r</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="shrink">
            <v-card width="500px" v-for="toot in sharedState.currentToots" :key="toot.id" class="grey darken-3 pa-2 ma-2">
              <v-card-title class="headline">
                <v-img :src="toot.account.avatar" class="avatar ma-2" max-height="2rem" max-width="2rem"/>
                {{ toot.account.display_name }}
              </v-card-title>
              <v-card-subtitle class="overline pl-7">
                {{ toot.created_at | formatDate }}
              </v-card-subtitle>
              <v-card-text v-if="toot.new_content" v-html="toot.new_content"></v-card-text>
              <v-card-text v-else v-html="toot.content"></v-card-text>
              <v-img v-for="image in toot.media_attachments" :key="image.id" :src="image.preview_url"></v-img>
            </v-card>
          </v-col>
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

  export default {
    props: {
      source: String,
    },

    data: () => ({
      drawer: false,
      sharedState: store.state,
    }),

    created () {
      this.$vuetify.theme.dark = true;
      store.getTagTimeline('cats');
    },
    filters: {
      formatDate: function(date) {
        return new Date(date).toLocaleString('en');
      },
    }
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
