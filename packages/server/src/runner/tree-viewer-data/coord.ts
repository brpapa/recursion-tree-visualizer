import { Point } from 'src/types'

const TRANSLATED_BY: Point = [50, 50]
const SCALED_BY: Point = [85, 150]

export default function coord(rawCoord: Point, isBottomRight = false): Point {
  return [
    rawCoord[0] * SCALED_BY[0] + (isBottomRight ? 2 : 1) * TRANSLATED_BY[0],
    rawCoord[1] * SCALED_BY[1] + (isBottomRight ? 2 : 1) * TRANSLATED_BY[1],
  ]
}
