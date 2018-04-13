import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";

// 混入
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() {
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}

// 播放器混入
export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence
                ? "icon-sequence"
                : this.mode === playMode.loop ? "icon-loop" : "icon-random";
        },
        ...mapGetters(["sequenceList", "currentSong", "playlist", "mode", "favoriteList"])
    },
    methods: {
        // 改变播放模式
        changeMode() {
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;

            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            this.setPlaylist(list);
        },

        resetCurrentIndex(list) {
            let index = list.findIndex(item => {
                return item.id === this.currentSong.id;
            });
            this.setCurrentIndex(index);
        },
        getFavoriteIcon(song) {
            if(this.isFavorite(song)){
                return 'icon-favorite'
            }else{
                return 'icon-not-favorite'
            }
        },
        toogleFavorite(song) {
            if(this.isFavorite(song)){
                this.deleteFavoriteList(song);
            }else{
                this.saveFavoriteList(song);
            }
        },
        isFavorite(song) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === song.id
            })
            return index > -1
        },
        ...mapMutations({
            setPlayingState: "SET_PLAYING_STATE",
            setCurrentIndex: "SET_CURRENT_INDEX",
            setPlayMode: "SET_PLAY_MODE",
            setPlaylist: "SET_SEQUENCE_LIST"
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
}

// 搜索混入
export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters(["searchHistory"])
    },
    methods: {
        addQuery(query) {
            this.$refs.searchBox.setQuery(query);
        },
        // 改变search-box里面的内容
        onQueryChange(query) {
            this.query = query;
        },
        // 改变search里面Input的blur状态
        blurInput() {
            this.$refs.searchBox.blur();
        },
        // 保存搜索结果
        saveSearch() {
            this.saveSearchHistory(this.query);
        },
        ...mapActions([
            "saveSearchHistory",
            "deleteSearchHistory",
        ])
    }
}