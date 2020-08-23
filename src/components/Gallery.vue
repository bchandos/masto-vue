<template>
<!-- TODO: Fix button placement or figure out width -->
    <v-dialog
        v-model="appState.galleryDialog"
        @click:outside="closeGallery"
        @keydown.esc="closeGallery"
        @keydown.arrow-left="navigateGallery(-1)"
        @keydown.arrow-right="navigateGallery(1)"
    >
        <v-img
            contain
            max-height="90vh"
            v-if="appState.galleryAttachments.length"
            :src="appState.galleryAttachments[appState.galleryIndex].url"
            :lazy-src="appState.galleryAttachments[appState.galleryIndex].preview_url"
            :alt="appState.galleryAttachments[appState.galleryIndex].description"
            :aspect-ratio="appState.galleryAttachments[appState.galleryIndex].aspect"
        >
            <v-row v-if="appState.galleryAttachments.length > 1" align="end" class="lightbox white--text pa-2 fill-height">
                <v-col class="text-center">
                    {{ appState.galleryIndex + 1 }} of {{ appState.galleryAttachments.length }}
                </v-col>
            </v-row>
        </v-img>
        <v-content class="pa-0 ma-0">
            <v-btn 
                @click="closeGallery" 
                fixed 
                top 
                left 
                rounded 
                small 
                outlined
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn 
                v-if="appState.galleryAttachments.length > 1" 
                @click="navigateGallery(-1)" 
                fixed 
                left 
                outlined
            >
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn 
                v-if="appState.galleryAttachments.length > 1" 
                @click="navigateGallery(1)" 
                fixed 
                right 
                outlined
            >
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
            this.appState.galleryIndex = 0;
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
        },
    },
}
</script>