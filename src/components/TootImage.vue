<template>
    <!-- TODO: reimagine images - perhaps photo gallery? -->   
    <!-- TODO: GIF/movie stop after x loops? -->
    <div class="container" :style="{ maxHeight : [expanded ? combinedMaxHeight.toString() + 'px' : '350px']}">
        <div v-for="image in mediaAttachments" :key="image.id" >
            <v-img
                ref="tootImages"
                v-if="image.type!='gifv'"
                contain
                :src="image.url"
                :lazy-src="image.preview_url"
                :alt="image.description"
                :aspect-ratio="image.aspect"
                class="mt-2 mb-2"
            />
            <video 
                v-if="image.type=='gifv' || image.type=='mp4'" 
                autoplay 
                loop 
                muted
            >
                <source :src="image.url" type="video/mp4"/>
            </video>
        </div>
        <v-btn
            absolute 
            text 
            block 
            tile 
            style="bottom: 0;" 
            @click="expandOrHide"> 
            <span v-show="!expanded">
                Show {{ mediaAttachments.length > 1 ? mediaAttachments.length - 1 : '' }} More
                <v-icon>mdi-chevron-down</v-icon>
            </span>
            <span v-show="expanded">
                Show Less
                <v-icon>mdi-chevron-up</v-icon>
            </span>
        </v-btn>
    </div>
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
    },

    computed: {
        combinedMaxHeight: function() {
            // Calculate the correct height for the images as they appear on the page, 
            // so that the max-height style can be set and the CSS animation of max-height looks correct
            let mh = 0;
            for (let att of this.$refs.tootImages) {
                mh += att.$el.clientHeight;
            }
            return mh;
        },
        
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
</style>