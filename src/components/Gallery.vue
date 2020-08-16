<template>
    <v-dialog
        v-model="appState.galleryDialog"
        fullscreen
    >
        <v-img
            max-height="100%"
            v-if="appState.galleryAttachments.length"
            :src="appState.galleryAttachments[appState.galleryIndex].url"
            :lazy-src="appState.galleryAttachments[appState.galleryIndex].preview_url"
            :alt="appState.galleryAttachments[appState.galleryIndex].description"
            :aspect-ratio="appState.galleryAttachments[appState.galleryIndex].aspect"
        />
        <v-content class="pa-0 ma-0">
            <v-btn @click="closeGallery" fixed top left rounded small outlined>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn v-if="appState.galleryAttachments.length > 1" @click="navigateGallery(-1)" fixed left outlined style="bottom: 50%;">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn v-if="appState.galleryAttachments.length > 1" @click="navigateGallery(1)" fixed right outlined style="bottom: 50%;">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </v-content>
    </v-dialog>
</template>

<script>
import { store } from "../store.js";

export default {

    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),

    methods: {
        closeGallery: function() {
            this.appState.galleryDialog = false;
            this.appState.galleryAttachments = [];
        },
        navigateGallery: function(increment) {
            let newIndex = this.appState.galleryIndex + increment;
            if (newIndex > this.appState.galleryAttachments.length - 1) {
                this.appState.galleryIndex = 0;
            } else if (newIndex < 0) {
                this.appState.galleryIndex = this.appState.galleryAttachments.length - 1;
            } else {
                this.appState.galleryIndex = newIndex;
            }

        }
    },
}
</script>