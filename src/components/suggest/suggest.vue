<template>
  <scroll class="suggest" 
          :data="result" 
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore" 
          @beforeScroll="listScroll"
          ref="suggest"
  >
      <ul class="suggest-list">
          <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
              <div class="icon">
                  <i :class="getIconClass(item)"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getDisplayName(item)"></p>
              </div>
          </li>
          <loading v-show="hasMore" title=""></loading>
      </ul>
      <div v-show="!hasMore && !result.length" class="no-result-wrapper">
          <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
  </scroll>
</template>
<script>
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import Singer from "common/js/Singer";
import { mapMutations, mapActions } from "vuex";
import NoResult from "base/no-result/no-result";

const TYPE_SINGER = "singer";
const perpage = 20;

export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    };
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh();
    },
    // 请求服务端发送axios请求，检索数据
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data);
          this._checkMore(res.data);
          // console.log(this.result);
        }
      });
    },
    
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data));
          this._checkMore(res.data);
          console.log(this.result);
        }
      });
    },
    // 检查是否有数据
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} - ${item.singer}`;
      }
    },
    // 处理data数据,判断搜索的是歌曲还是歌手
    _getResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          // 扩展运算符，将data.zhida添加进ret里面
          ...data.zhida,
          //   添加一个对象属性，type用于判断是歌曲还是歌手
          ...{
            type: TYPE_SINGER
          }
        });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },

    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select");
    },

    // 派发listScroll事件
    listScroll() {
      this.$emit("listScroll");
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  watch: {
    //监听query变化,执行search()函数
    query() {
      this.search();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>