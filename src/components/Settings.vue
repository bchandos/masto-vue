<template>
    <v-dialog
        v-model=appState.settingsDialog
        width="500px">
        <v-card>
            <v-card-title>
                Settings
            </v-card-title>
            <v-form>

            </v-form>
            <v-card-actions>
                <v-spacer/>
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
}
</script>