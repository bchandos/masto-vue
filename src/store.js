export const store = {
    state: {
        currentTag: '',
        currentToots: [],
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

    replaceEmoji() {
        for (let toot of this.state.currentToots) {
            if (toot.emojis.length) {
                let content = toot.content;
                for (let emoji of toot.emojis) {
                    content = content.replace(`:${emoji.shortcode}:`, `<img class="emoji" src="${emoji.url}" />`)
                }
                toot.new_content = content;
            }
        }
    },
}