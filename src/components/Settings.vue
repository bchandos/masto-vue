<template>
    <v-dialog
        v-model=appState.settingsDialog
        width="500px">
        <v-card>
            <v-card-title>
                Settings
            </v-card-title>
            <v-card-text>
                <v-text-field
                    label="Mastodon Instance"
                    v-model="settings.mastodonInstance"
                >
                </v-text-field>
                <v-checkbox
                    v-model="settings.queryFediverse"
                    label="Include Public Timeline"
                >
                </v-checkbox>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="resetApp">Save</v-btn>
                <v-btn @click="appState.settingsDialog=false">Close</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
import { store } from "../store.js";

export default {
    components: {

    },
    props: {

    },
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),
    methods: {
        resetApp: function() {
            store.getPublicTimeline();
            this.appState.settingsDialog = false;
        },
    }
}
</script>