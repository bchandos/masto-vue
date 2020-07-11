<template>
    <!-- TODO: (MVP) card image overflow -->   
    <!-- TODO: (MVP) dynamically determine width below -->
    <!-- TODO: GIF/movie stop after x loops? -->
    <div>
        <div v-for="image in mediaAttachments" :key="image.id">
            <v-img
                v-if="image.type!='gifv'"
                contain
                :src="image.url"
                :lazy-src="image.preview_url"
                :alt="image.description"
                :aspect-ratio="image.aspect"
                class="mt-2 mb-2"
            />
            <video 
                v-if="image.type=='gifv'" 
                autoplay 
                loop 
                muted>
            <source :src="image.url" type="video/mp4"/>
            </video>
        </div>
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
    }),
}
</script>