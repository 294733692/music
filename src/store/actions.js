//异步操作||对mutation封装(需要多个mutations的复杂操作)

import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util';
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'


// 寻找歌曲index
function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

// 选择歌曲当播放
export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


// 随机播放模式
export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


// 插入当前歌曲到当前歌曲列表
export const insertSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice(),
        sequenceList = state.sequenceList.slice(),
        currentIndex = state.currentIndex;

    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 查找当前歌曲是否在当前歌单列表，并返回其索引
    let fpIndex = findIndex(playlist, song)
    // 插入歌曲，所有加一
    currentIndex++;
    // 插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song);
    // 如果包含这首歌
    if (fpIndex > -1) {
        // 如果当前插入的序号，大于当前列表中的序号
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex--;
        } else {
            playlist.splice(fpIndex + 1, 1)
        }
    }
    // 获取插入位置
    let currentSIndex = findIndex(sequenceList, currentSong) + 1;
    // 找到之前有没有这首歌
    let fsIndex = findIndex(sequenceList, song);
    // song插入到seq里面
    sequenceList.splice(currentSIndex, 0, song);

    if (fsIndex > -1) {
        if (currentIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }
    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 保存结果，保存到localStorage中
export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除
export const deleteSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

// 清楚搜索结果
export const clearSearchHistory = function ({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch());
}

export const deleteSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    const playingState = playlist.length > 0;
    commit(types.SET_PLAYING_STATE, playingState)

}

export const deleteSongList = function ({ commit }) {
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAYING_STATE, false)
}


export const savePlayHistory = function ({ commit }, song) {
    commit(types.SET_PLAY_HISTORY,savePlay(song));
}


export const saveFavoriteList = function({commit}, song){
    commit(types.SET_FAVRORITE_LIST, saveFavorite(song));
}

export const deleteFavoriteList = function({commit}, song){
    commit(types.SET_FAVRORITE_LIST, deleteFavorite(song));
}