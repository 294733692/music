<template>
  <transition name="slide">
      <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>



<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { createRecomSong } from "common/js/song";

export default {
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        //回退到singer路由
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code == ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.id && musicData.album.id) {
          ret.push(createRecomSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/styuls">
.slide-enter-avtive, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

