<template>
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicTopList } from "api/rank";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";

export default {
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  created() {
    this._getMusicTopList();
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return "";
    },
    ...mapGetters(["topList"])
  },
  methods: {
    _getMusicTopList() {
      if (!this.topList.id) {
        this.$router.push("/rank/");
        return;
      }
      getMusicTopList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs(list) {
      const ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>


<style lang="stylus" scoped rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
