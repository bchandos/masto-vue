<template>
    <!-- TODO: reimagine images - perhaps photo gallery? -->   
    <!-- TODO: GIF/movie stop after x loops? -->
    <v-container>
        <template v-if="numOfImages==1">
            <v-row class="mt-2 mb-2">
                <v-col>
                    <v-img
                        v-if="mediaAttachments[0].type!='gifv'"
                        :src="mediaAttachments[0].url"
                        :lazy-src="mediaAttachments[0].preview_url"
                        :alt="mediaAttachments[0].description"
                        :aspect-ratio="mediaAttachments[0].aspect"
                        height="400px"
                        class="all-round"
                        @click="openGallery(0)"
                    />
                    <video 
                        v-if="mediaAttachments[0].type=='gifv' || mediaAttachments[0].type=='mp4'" 
                        controls
                        loop 
                        muted
                        width="100%"
                        height="auto"
                    >
                        <source :src="mediaAttachments[0].url" type="video/mp4"/>
                    </video>
                </v-col>
            </v-row>
        </template>
        <template v-if="numOfImages==2">
            <v-row class="mt-2 mb-2">
                <v-col cols=6 class="pa-0">
                    <v-img
                        v-if="mediaAttachments[0].type!='gifv'"
                        :src="mediaAttachments[0].url"
                        :lazy-src="mediaAttachments[0].preview_url"
                        :alt="mediaAttachments[0].description"
                        :aspect-ratio="mediaAttachments[0].aspect"
                        height="400px"
                        class="top-left-round bottom-left-round"
                        @click="openGallery(0)"
                    />
                </v-col>
                <v-col cols=6 class="pa-0">
                    <v-img
                        v-if="mediaAttachments[1].type!='gifv'"
                        :src="mediaAttachments[1].url"
                        :lazy-src="mediaAttachments[1].preview_url"
                        :alt="mediaAttachments[1].description"
                        :aspect-ratio="mediaAttachments[1].aspect"
                        height="400px"
                        class="top-right-round bottom-right-round"
                        @click="openGallery(1)"
                    />
                </v-col>
            </v-row>
        </template>
        <template v-if="numOfImages==3">
            <v-row class="mt-2 mb-2">
                <v-col cols=6 class="pa-0">
                    <v-img
                        v-if="mediaAttachments[0].type!='gifv'"
                        :src="mediaAttachments[0].url"
                        :lazy-src="mediaAttachments[0].preview_url"
                        :alt="mediaAttachments[0].description"
                        :aspect-ratio="mediaAttachments[0].aspect"
                        height="400px"
                        class="top-left-round bottom-left-round"
                        @click="openGallery(0)"
                    />
                </v-col>
                <v-col cols=6 class="pa-0">
                    <v-row>
                        <v-col class="pa-0">
                            <v-img
                                v-if="mediaAttachments[1].type!='gifv'"
                                :src="mediaAttachments[1].url"
                                :lazy-src="mediaAttachments[1].preview_url"
                                :alt="mediaAttachments[1].description"
                                :aspect-ratio="mediaAttachments[1].aspect"
                                height="200px"
                                class="top-right-round"
                                @click="openGallery(1)"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-0">
                            <v-img
                                v-if="mediaAttachments[2].type!='gifv'"
                                :src="mediaAttachments[2].url"
                                :lazy-src="mediaAttachments[2].preview_url"
                                :alt="mediaAttachments[2].description"
                                :aspect-ratio="mediaAttachments[2].aspect"
                                height="200px"
                                class="bottom-right-round"
                                @click="openGallery(2)"
                            />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </template>
        <template v-if="numOfImages==4">
            <v-row class="mt-2 mb-2">
                <v-col cols=6 class="pa-0">
                    <v-row>
                        <v-col class="pa-0">
                            <v-img
                                v-if="mediaAttachments[0].type!='gifv'"
                                :src="mediaAttachments[0].url"
                                :lazy-src="mediaAttachments[0].preview_url"
                                :alt="mediaAttachments[0].description"
                                :aspect-ratio="mediaAttachments[0].aspect"
                                height="200px"
                                class="top-left-round"
                                @click="openGallery(0)"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-0">
                            <v-img
                                v-if="mediaAttachments[1].type!='gifv'"
                                :src="mediaAttachments[1].url"
                                :lazy-src="mediaAttachments[1].preview_url"
                                :alt="mediaAttachments[1].description"
                                :aspect-ratio="mediaAttachments[1].aspect"
                                height="200px"
                                class="bottom-left-round"
                                @click="openGallery(1)"
                            />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols=6 class="pa-0">
                    <v-row>
                        <v-col class="pa-0">
                            <v-img
                                v-if="mediaAttachments[2].type!='gifv'"
                                :src="mediaAttachments[2].url"
                                :lazy-src="mediaAttachments[2].preview_url"
                                :alt="mediaAttachments[2].description"
                                :aspect-ratio="mediaAttachments[2].aspect"
                                height="200px"
                                class="top-right-round"
                                @click="openGallery(2)"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-0">
                            <v-img
                                v-if="mediaAttachments[3].type!='gifv'"
                                :src="mediaAttachments[3].url"
                                :lazy-src="mediaAttachments[3].preview_url"
                                :alt="mediaAttachments[3].description"
                                :aspect-ratio="mediaAttachments[3].aspect"
                                height="200px"
                                class="bottom-right-round"
                                @click="openGallery(3)"
                            />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
import { store } from "../store.js";


export default {
    components: {

    },
    props: {
        mediaAttachments: {
            type: Array,
            required: true,
        }
    },
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
      expanded: false,
    }),
    methods: {
        expandOrHide: function() {
            this.expanded = !this.expanded;
        },
        openGallery: function(idx) {
            this.appState.galleryDialog = true;
            this.appState.galleryAttachments = this.mediaAttachments;
            this.appState.galleryIndex = idx;
        }
    },

    computed: {
        numOfImages: function() {
            return this.mediaAttachments.length;
        }
    },
}
</script>

<style>
    .container {
        overflow: hidden; 
        position: relative;
        transition-property: max-height;
        transition-duration: 300ms;
        transition-timing-function: linear;
        transition-delay: 0s;
    }
    .all-round {
        border-radius: 12px;
    }
    .top-left-round {
        border-top-left-radius: 12px;
    }
    .top-right-round {
        border-top-right-radius: 12px;
    }
    .bottom-left-round {
        border-bottom-left-radius: 12px;
    }
    .bottom-right-round {
        border-bottom-right-radius: 12px;
    }


</style>