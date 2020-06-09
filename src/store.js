export const store = {
    state: {
        currentTag: '',
        currentToots: [],
        selectedTrend: '',
        navigationDrawer: false,
        currentTrends: [],
        loading: false,
        activeFilters: [],
    },
    BASE_URL: 'https://mastodon.social/api/v1',

    async getTagTimeline(tag, limit=15) {
        this.state.loading = true;
        this.state.currentTag = tag;
        const response = await fetch(`${this.BASE_URL}/timelines/tag/${tag}?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentToots = json_response;
        this.replaceEmoji();
        this.state.loading = false;
    },

    async updateTagTimeline(limit=15) {
        this.state.loading = true;
        let last_id = this.state.currentToots[0].id;
        const response = await fetch(`${this.BASE_URL}/timelines/tag/${this.state.currentTag}?since_id=${last_id}&limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentToots.unshift(...json_response);
        this.replaceEmoji();
        this.state.loading = false;
    },

    async getPublicTimeline(limit=50) {
        this.state.loading = true;
        this.state.currentTag = '';
        this.state.selectedTrend = '';
        const response = await fetch(`${this.BASE_URL}/timelines/public?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentToots = json_response;
        this.replaceEmoji();
        this.state.loading = false;
    },
    
    async updatePublicTimeline(limit=50) {
        this.state.loading = true;
        let last_id = this.state.currentToots[0].id;
        const response = await fetch(`${this.BASE_URL}/timelines/public?since_id=${last_id}&limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentToots.unshift(...json_response);
        this.replaceEmoji();
        this.state.loading = false;
    },

    async getTrends() {
        const response = await fetch(`${this.BASE_URL}/trends`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentTrends = json_response;
    },

    replaceEmoji() {
        // Replace custom emoji shortcodes with the actual image in the toot contents
        for (let toot of this.state.currentToots) {
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
                for (let emoji of toot.account.emojis) {
                    let re = new RegExp(`:${emoji.shortcode}:`, 'g');
                    display_name = display_name.replace(re, `<img class="emoji" src="${emoji.url}" />`)
                }
                toot.account.display_name = display_name;
            }
        }
    },
}