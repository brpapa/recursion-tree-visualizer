import { Point } from '../../../../types'

// retorna o ponto em relação à origem que representa o vetor PQ
function vector(P: Point, Q: Point): Point {
  return [Q[0] - P[0], Q[1] - P[1]]
}

// retorna a norma do vetor PQ
function norm(P: Point, Q: Point) {
  const dx = vector(P, Q)[0]
  const dy = vector(P, Q)[1]
  return Math.sqrt(dx * dx + dy * dy)
}

// retorna o ponto P translatado ao longo do vetor V
function translate(P: Point, V: Point): Point {
  return [V[0] + P[0], V[1] + P[1]]
}

// retorna um ponto que representa o vetor V*k
function scale(V: Point, k: number): Point {
  return [V[0] * k, V[1] * k]
}

// retorna o ponto na reta definida por P e Q que está há uma distância d de Q
export function pointOnLine(P: Point, Q: Point, d: number): Point {
  return translate(Q, scale(vector(Q, P), d / norm(P, Q)))
}

// retorna o ponto central entre P e Q
export function centralPoint(P: Point, Q: Point): Point {
  return [(P[0]+Q[0])/2, (P[1]+Q[1])/2]
}

