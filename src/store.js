export const store = {
    state: {
        // TODO: Build out architecture for full app
        userState: {
            activeFilters: [],
            selectedTrend: '',
            savedTags: [],
            currentTag: '',
            currentAccount: {},
        },
        appState: {
            loading: false,
            primaryView: 'feed',
            currentToots: [],
            polling: null,
            navigationDrawer: false,
            currentTrends: [],
        },
        settings: {
            BASE_URL: 'https://mastodon.social/api/v1',
            lazyAvatarUrl: 'https://mastodon.social/avatars/original/missing.png',
            pollingFrequency: 20000,
            toastTimeout: 4000,
        },
    },

    // TODO: Authentication
    // TODO: Settings with secure storage (PWA) (constant load)
    // TODO: PWA offline stuff?

    async getTagTimeline(tag, limit=15) {
        this.state.appState.loading = true;
        this.state.userState.currentTag = tag;
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/tag/${tag}?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots = json_response;
        this.replaceEmoji();
        this.state.appState.loading = false;
    },

    async updateTagTimeline(limit=15) {
        this.state.appState.loading = true;
        let last_id = this.state.appState.currentToots[0].id;
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/tag/${this.state.userState.currentTag}?since_id=${last_id}&limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots.unshift(...json_response);
        this.replaceEmoji();
        this.state.appState.loading = false;
    },

    async getPublicTimeline(limit=50) {
        this.state.appState.loading = true;
        this.state.userState.currentTag = '';
        this.state.userState.selectedTrend = '';
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/public?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots = json_response;
        this.replaceEmoji();
        this.state.appState.loading = false;
    },
    
    async updatePublicTimeline(limit=50) {
        this.state.appState.loading = true;
        let last_id = this.state.appState.currentToots[0].id;
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/public?since_id=${last_id}&limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots.unshift(...json_response);
        this.replaceEmoji();
        this.state.appState.loading = false;
    },

    async getUserTimeline(account_id) {
        this.state.appState.loading = true;
        // Get the account's toots
        const response = await fetch(`${this.state.settings.BASE_URL}/accounts/${account_id}/statuses`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots = json_response;
        this.replaceEmoji();
        this.state.userState.currentAccount = this.state.appState.currentToots[0].account;
        window.scrollTo(0, 0);
        this.state.appState.loading = false;
    },

    async getTrends() {
        const response = await fetch(`${this.state.settings.BASE_URL}/trends`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentTrends = json_response;
    },

    replaceEmoji() {
        // Replace custom emoji shortcodes with the actual image in the toot contents
        for (let toot of this.state.appState.currentToots) {
            if (toot.emojis.length) {
                let content = toot.content;
                for (let emoji of toot.emojis) {
                    let re = new RegExp(`:${emoji.shortcode}:`, 'g');
                    content = content.replace(re, `<img class="emoji" src="${emoji.url}" />`)
                }
                toot.content = content;
            }
            // Do the same thing for display name
            if (toot.account.emojis.length) {
                let display_name = toot.account.display_name;
                let note = toot.account.note;
                for (let emoji of toot.account.emojis) {
                    let re = new RegExp(`:${emoji.shortcode}:`, 'g');
                    display_name = display_name.replace(re, `<img class="emoji" src="${emoji.url}" />`);
                    note = note.replace(re, `<img class="emoji" src="${emoji.url}" />`);
                }
                toot.account.display_name = display_name;
                toot.account.note = note;
            }
        }
    },
    // TODO: Add polling frequency setting
    pollData() {
        this.state.appState.polling = setInterval(() => {
            if (!this.state.userState.currentTag) {
                this.updatePublicTimeline();
            }
         }, this.state.settings.pollingFrequency);
    }
}