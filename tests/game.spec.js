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
})
