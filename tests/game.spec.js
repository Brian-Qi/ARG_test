// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import game from '../src/stores/game'

describe('游戏状态 · 支线/结局/重置', () => {
  beforeEach(() => {
    localStorage.clear()
    game.reset()
  })

  it('markBranch 记录四条支线完成态', () => {
    game.markBranch('roads')
    game.markBranch('audio')
    game.markBranch('portrait')
    game.markBranch('zhaiyuan')
    expect(game.state.roadSolved).toBe(true)
    expect(game.state.audioSolved).toBe(true)
    expect(game.state.portraitSolved).toBe(true)
    expect(game.state.zhaiyuanSolved).toBe(true)
  })

  it('setEnding 记录并持久化已解锁结局', () => {
    game.setEnding('grey')
    expect(game.state.ending).toBe('grey')
    expect(game.hasEnding('grey')).toBe(true)
    expect(game.playedBefore()).toBe(true)
  })

  it('reset 清空进度，但保留「已解锁结局」与「来过」标记', () => {
    game.setEnding('grey')
    game.markBranch('zhaiyuan')
    game.collectKey('zhenxiang')
    game.takeShortcut()
    game.reset()
    expect(game.state.zhaiyuanSolved).toBe(false)
    expect(game.state.keys).toEqual({})
    expect(game.state.shortcuts).toBe(0)
    expect(game.hasEnding('grey')).toBe(true)
    expect(game.playedBefore()).toBe(true)
  })

  it('走捷径自增并给出可见提示', () => {
    game.takeShortcut()
    expect(game.state.shortcuts).toBe(1)
    expect(game.state.shortcutToast).toBeTruthy()
  })

  it('强惊吓开关可写读', () => {
    game.setStrongScare(false)
    expect(game.state.strongScare).toBe(false)
    expect(localStorage.getItem('cx_strong')).toBe('off')
    game.setStrongScare(true)
    expect(localStorage.getItem('cx_strong')).toBe('on')
  })

  it('清除记忆：删掉全部游玩记录，只留下画面偏好', () => {
    game.setEnding('grey')
    game.markBranch('zhaiyuan')
    game.collectKey('zhenxiang')
    game.state.namesSolved = true
    localStorage.setItem('cx_seen_hidden', '1')
    localStorage.setItem('cx_family_unlocked', '1')
    game.setStrongScare(false)

    game.clearMemory()

    // 记录清空
    expect(localStorage.getItem('cx_game')).toBeNull()
    expect(localStorage.getItem('cx_seen_hidden')).toBeNull()
    expect(localStorage.getItem('cx_family_unlocked')).toBeNull()
    expect(localStorage.getItem('cx_endings')).toBeNull()
    // 状态回到初始
    expect(game.state.zhaiyuanSolved).toBe(false)
    expect(game.state.namesSolved).toBe(false)
    expect(game.state.ending).toBeNull()
    expect(game.state.keys).toEqual({})
    // 画面偏好保留
    expect(localStorage.getItem('cx_strong')).toBe('off')
  })
})
