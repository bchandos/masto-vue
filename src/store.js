export const store = {
    state: {
        currentTag: '',
        currentToots: [],
        selectedTrend: '',
        navigationDrawer: false,
        currentTrends: [],
    },
    BASE_URL: 'https://mastodon.social/api/v1',

    async getTagTimeline(tag, limit=15) {
        this.state.currentTag = tag;
        const response = await fetch(`${this.BASE_URL}/timelines/tag/${tag}?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentToots = json_response;
        this.replaceEmoji();
    },

    async getPublicTimeline(limit=15) {
        this.state.currentTag = '';
        const response = await fetch(`${this.BASE_URL}/timelines/public?limit=${limit}`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentToots = json_response;
        this.replaceEmoji();
    },

    async getTrends() {
        const response = await fetch(`${this.BASE_URL}/trends`, {
            method: 'GET',
        });
        const json_response = await response.json();
        this.state.currentTrends = json_response;
    },

    replaceEmoji() {
        // TODO: Replace emoji in display_name, they are under account object
        for (let toot of this.state.currentToots) {
            if (toot.emojis.length) {
                let content = toot.content;
                for (let emoji of toot.emojis) {
                    // TODO: Change this to regex so it replaces all occurrences
                    content = content.replace(`:${emoji.shortcode}:`, `<img class="emoji" src="${emoji.url}" />`)
                }
                // TODO: Just replace the existing content
                toot.new_content = content;
            }
        }
    },
}