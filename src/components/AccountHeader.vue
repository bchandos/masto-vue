<template>
    <!-- TODO: Make this card float at the top... -->
    <v-card v-if="userState.currentAccount">
        <v-card-title class="headline">
            <v-img 
                :src="userState.currentAccount.avatar" 
                :lazy-src="settings.lazyAvatarUrl"
                class="avatar ma-2"
                max-height="5rem" 
                max-width="5rem"
                />
            <span v-html="userState.currentAccount.display_name || userState.currentAccount.username"/>
            <!-- TODO: ...except for this part -->
            <v-card-text>
                <AccountInfo :account="userState.currentAccount" />
            </v-card-text>
        </v-card-title>
    </v-card>
</template>

<script>
import { store } from '../store';
import AccountInfo from './AccountInfo';


export default {
    components: {
        AccountInfo,
    },
    data: () => ({
      userState: store.state.userState,
      appState: store.state.appState,
      settings: store.state.settings,
    }),
}
</script>