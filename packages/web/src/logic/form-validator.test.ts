import { describe, expect, it } from '@jest/globals'
import { fnCallFormValidator, fnCodeFormValidator } from './form-validators'

describe('fnCodeFormValidator', () => {
  describe('when lang is `node`', () => {
    itt('function fn() {\n\n}', true)
    itt('function fn() {\nabc,.{[()]}cba\n}', true)
    itt('function fn(abc,.{[()]}cba) {\n\n}', true)

    itt('function fn( {}', false)
    itt('function fn) {}', false)
    itt('function fn() {', false)
    itt('function fn() }', false)
    itt('function fn() {}', false)
    itt('function fn() {\n}', false)
    itt('function fn() {\nabc,.{[()]}cba}', false)
    itt('function fn() {abc,.{[()]}cba\n}', false)

    function itt(arg: string, expected: boolean) {
      it(`given ${JSON.stringify(arg)} should return ${expected}`, () => {
        const actual = fnCodeFormValidator('node')(arg)
        expect(actual).toEqual(expected)
      })
    }
  })
  
  describe('when lang is `python`', () => {
    itt('def fn():\n', true)
    itt('def fn():\nabc,.{[()]}cba', true)
    itt('def fn(abc,.{[()]}cba):\n', true)

    itt('def fn():', false)
    itt('def fn(): \n', false)
    itt('def fn(:\n', false)
    itt('def fn):\n', false)

    function itt(arg: string, expected: boolean) {
      it(`given ${JSON.stringify(arg)} should return ${expected}`, () => {
        const actual = fnCodeFormValidator('python')(arg)
        expect(actual).toEqual(expected)
      })
    }
  })

  describe('when lang is `golang`', () => {
    itt('func fn() abc {\n\n}', true)
    itt('func fn() {\n\n}', true)
    itt('func fn() abc {\nabc,.{[()]}cba\n}', true)
    itt('func fn(abc,.{[()]}cba) abc {\n\n}', true)

    itt('func fn( {}', false)
    itt('func fn) {}', false)
    itt('func fn() {', false)
    itt('func fn() }', false)
    itt('func fn() {}', false)
    itt('func fn() {\n}', false)
    itt('func fn() {\nabc,.{[()]}cba}', false)
    itt('func fn() {abc,.{[()]}cba\n}', false)

    function itt(arg: string, expected: boolean) {
      it(`given ${JSON.stringify(arg)} should return ${expected}`, () => {
        const actual = fnCodeFormValidator('golang')(arg)
        expect(actual).toEqual(expected)
      })
    }
  })
})

describe('fnCallFormValidator', () => {
  itt('fn()', true)    
  itt('fn(abc,.{[()]}cba)', true)

  itt('f()', false)
  itt('n()', false)
  itt('fn)', false)
  itt('fn(', false)
  itt('', false)

  function itt(arg: string, expected: boolean) {
    it(`given ${JSON.stringify(arg)} should return ${expected}`, () => {
      const actual = fnCallFormValidator()(arg)
      expect(actual).toEqual(expected)
    })
  }
})
