<template>
    <v-card 
        :href="card.url">
        <v-card-title>
            <v-row>
            <!-- TODO: Image still looks small -->
            <v-col cols="2" align-self="center">
                <v-img v-if="card.image" 
                :src="card.image"
                class="ml-2" 
                />
            </v-col>
            <v-col cols="10" class="pl-0">
                {{ card.title }}
            </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle class="text-truncate">
            {{ card.description }}
        </v-card-subtitle>
        </v-card>
</template>

<script>
import { store } from "../store.js";

export default {
    components: {
    },
    props: {
        card: {
            type: Object,
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