export const store = {
    state: {
        // TODO: Build out architecture for full app
        userState: {
            activeFilters: ['english',],
            selectedTrend: '',
            savedTags: [],
            currentTag: '',
            currentAccount: null,
        },
        appState: {
            loading: false,
            primaryView: 'feed',
            currentToots: [],
            polling: null,
            navigationDrawer: false,
            currentTrends: [],
            continuousRefresh: false,
            feedView: 'public',
            settingsDialog: false,
            isIntersecting: true,
        },
        settings: {
            BASE_URL: 'https://mastodon.social/api/v1',
            lazyAvatarUrl: 'https://mastodon.social/avatars/original/missing.png',
            pollingFrequency: 20000,
            toastTimeout: 4000,
            requestLimit: 50,
        },
    },

    // TODO: Authentication
    // TODO: Settings with secure storage (PWA) (constant load)
    // TODO: PWA offline stuff?

    async getTagTimeline(tag, limit=this.state.settings.requestLimit) {
        this.state.appState.loading = true;
        this.state.userState.currentTag = tag;
        this.state.appState.feedView = 'tag';
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/tag/${tag}?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots = json_response;
        this.replaceEmoji();
        this.state.appState.loading = false;
    },

    async updateTagTimeline(limit=this.state.settings.requestLimit) {
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

    async getPublicTimeline(limit=this.state.settings.requestLimit) {
        this.state.appState.loading = true;
        this.state.appState.feedView = 'public';
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
    
    async updatePublicTimeline(limit=this.state.settings.requestLimit) {
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

    async getUserTimeline(account_id, limit=this.state.settings.requestLimit) {
        this.state.appState.loading = true;
        this.state.appState.feedView = 'account';
        this.state.userState.currentTag = '';
        this.state.userState.selectedTrend = '';
        // Get the account's toots
        const response = await fetch(`${this.state.settings.BASE_URL}/accounts/${account_id}/statuses?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots = json_response;
        this.replaceEmoji();
        this.state.userState.currentAccount = this.state.appState.currentToots[0].account;
        window.scrollTo(0, 0);
        this.state.appState.loading = false;
    },

    async updateUserTimeline(limit=this.state.settings.requestLimit) {
        this.state.appState.loading = true;
        let last_id = this.state.appState.currentToots[0].id;
        let account_id = this.state.userState.currentAccount.id;
        // Get the account's toots
        const response = await fetch(`${this.state.settings.BASE_URL}/accounts/${account_id}/statuses?limit=${limit}&since_id=${last_id}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots.unshift(...json_response);
        this.replaceEmoji();
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
    updateCurrentFeed() {
        if (this.state.appState.feedView=='public') {
            this.updatePublicTimeline();
        } else if (this.state.appState.feedView=='tag') {
            this.updateTagTimeline();
        } else if (this.state.appState.feedView=='account') {
            this.updateUserTimeline();
        }
    },

    // TODO: Add polling frequency setting
    pollData() {
        if (this.state.appState.continuousRefresh) {
            this.state.appState.polling = setInterval(() => {
                this.updateCurrentFeed();
             }, this.state.settings.pollingFrequency);
        } else {
            clearInterval(this.state.appState.polling);
        }
    },

    clearTag() {
        this.state.userState.currentTag = '';
        this.state.userState.selectedTrend = '';
        this.state.
        this.state.appState.feedView = 'public';
        this.getPublicTimeline();
    },
}