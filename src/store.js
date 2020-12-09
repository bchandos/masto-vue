import { del, get, set } from "idb-keyval";

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
            oldestTootInFeed: '',
            newestTootInFeed: '',
            loggedIn: false,
            galleryDialog: false,
            galleryAttachments: [],
            galleryIndex: 0,
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
    // TODO: (MVP) Settings with secure storage (PWA) (constant load)
    // TODO: (MVP) PWA offline stuff?
    // TODO: (MVP) Capture first/last IDs and optimize requests
    // TODO: Toot buttons should do something...
    // TODO: Use/set local instance only (i.e. no fediverse)
    // TODO: Can filters be done server side?
    // TODO: View toots in context; https://mastodon.example/api/v1/statuses/:id/context ("ancestors", "descendants")
    // TODO: Streaming? https://docs.joinmastodon.org/methods/timelines/streaming/

    async getTagTimeline(tag, limit=this.state.settings.requestLimit) {
        if (this.state.appState.feedView == 'public') {
            this.cacheToots();
        }
        this.state.appState.loading = true;
        this.state.userState.currentTag = tag;
        this.state.appState.feedView = 'tag';
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/tag/${tag}?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots = json_response;
        this.postProcessToot();
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
        this.postProcessToot();
        this.state.appState.loading = false;
    },

    async getPublicTimeline(limit=this.state.settings.requestLimit) {
        const cachedToots = await this.getCachedToots();
        if (cachedToots.length) {
            // We have cached toots, use them instead of requesting new ones
            this.state.appState.currentToots = cachedToots;
            this.clearCachedToots();
            this.state.appState.feedView = 'public';
            this.state.userState.currentTag = '';
            this.state.userState.selectedTrend = '';
        } else {
            this.state.appState.loading = true;
            this.state.appState.feedView = 'public';
            this.state.userState.currentTag = '';
            this.state.userState.selectedTrend = '';
            const response = await fetch(`${this.state.settings.BASE_URL}/timelines/public?limit=${limit}`, {
                method: 'GET',
            });
            const json_response = await response.json();
            this.state.appState.currentToots = json_response;
            this.postProcessToot();
            this.state.appState.loading = false;
            this.firstAndLast();
        }
    },
    
    async updatePublicTimeline(limit=this.state.settings.requestLimit) {
        this.state.appState.loading = true;
        let last_id = this.state.appState.currentToots[0].id;
        const response = await fetch(`${this.state.settings.BASE_URL}/timelines/public?since_id=${last_id}&limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentToots.unshift(...json_response);
        this.postProcessToot();
        this.state.appState.loading = false;
    },

    async getUserTimeline(account_id, limit=this.state.settings.requestLimit) {
        if (this.state.appState.feedView == 'public') {
            this.cacheToots();
        }
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
        this.postProcessToot();
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
        this.postProcessToot();
        this.state.appState.loading = false;
    },

    async getTrends() {
        const response = await fetch(`${this.state.settings.BASE_URL}/trends`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.appState.currentTrends = json_response;
    },

    async postProcessToot() {
        for (let toot of this.state.appState.currentToots) {
            this.replaceEmojis(toot);
            
            // If toot has a reply, fetch it and add it
            if (toot.in_reply_to_id) {
                const response = await fetch(`${this.state.settings.BASE_URL}/statuses/${toot.in_reply_to_id}`, {
                    method: 'GET',
                });
                const json_response = await response.json();
                this.replaceEmojis(json_response);
                toot.in_reply_to = json_response;
            }

        }
    },

    async replaceEmojis(toot) {
        // Replace custom emoji shortcodes with the actual image in the toot contents
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
        return toot;
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
        
        this.state.appState.feedView = 'public';
        this.getPublicTimeline();
        this.setStorage();
    },

    firstAndLast() {
        this.state.appState.oldestTootInFeed = this.state.appState.currentToots.slice(-1)[0].id;
        this.state.appState.newestTootInFeed = this.state.appState.currentToots[0].id;
    },

    setStorage() {
        set('userState', this.state.userState);
        // localStorage.setItem('userState', JSON.stringify(this.state.userState));
    },

    async loadStorage() {
        // let userState = JSON.parse(localStorage.getItem('userState'));
        const userState = await get('userState');
        if (userState != null) {
            this.state.userState = userState;
        }
    },

    cacheToots() {
        set('publicTimeline', this.state.appState.currentToots);
        // localStorage.setItem('publicTimeline', JSON.stringify(this.state.appState.currentToots));
    },

    async getCachedToots() {
        // let cachedToots = JSON.parse(localStorage.getItem('publicTimeline'));
        const cachedToots = await get('publicTimeline');
        return cachedToots || [];
        // if (cachedToots != null) {
        //     return cachedToots;
        // } else {
        //     return [];
        // }
    },

    clearCachedToots() {
        del('publicTimeline');
        // localStorage.removeItem('publicTimeline');
    }
}