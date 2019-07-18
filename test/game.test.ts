import { createRandom, zeroPadding } from '../src/util/util'

test('zeroPadding', () => {
  expect(zeroPadding(123, 5)).toEqual('00123')
  expect(zeroPadding(2, 2)).toEqual('02')
})

test('createRandom', () => {
  const random = createRandom(5, 10)
  expect(random).toBeLessThan(11)
  expect(random).toBeGreaterThan(4)
})