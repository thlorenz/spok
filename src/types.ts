export type MatchingSpecs<P> = Partial<
  {
    [K in keyof P]: P[K] extends unknown[]
      ?
          | Specification<P[K][number][]>
          | (
              | P[K][number]
              | Specification<P[K][number]>
              | MatchingSpecs<P[K][number]>
            )[]
      : P[K] extends object
      ? MatchingSpecs<P[K]>
      : P[K] | Specification<P[K]>
  }
>

export type Assert = {
  equal(actual: any, expected: any, msg?: string): void
  deepEqual(actual: any, expected: any, msg?: string): void
}

type Annotations = {
  $topic?: string
  $spec?: string
  $description?: string
}

export type Specifications<P> = Annotations & MatchingSpecs<P>

export type Specification<T> = Annotations & {
  (val: T): boolean
}

export type SpokFunction = <P>(
  t: Assert,
  obj: P,
  specifications: Specifications<P>,
  prefix?: string | null
) => void

export type SpokConfig = {
  printSpec: boolean
  printDescription: boolean
  sound: boolean
  color: boolean
}

export type SpokAssertions = {
  gtz: Specification<number>
  gez: Specification<number>
  ltz: Specification<number>
  lez: Specification<number>
  array: Specification<unknown[]>
  number: Specification<unknown>
  string: Specification<unknown>
  function: Specification<unknown>
  definedObject: Specification<unknown>
  defined: Specification<unknown>
  notDefined: Specification<unknown>

  range(min: number, max: number): Specification<number>

  gt(x: number): Specification<number>

  ge(x: number): Specification<number>

  lt(x: number): Specification<number>

  le(x: number): Specification<number>

  ne(x: unknown): Specification<unknown>

  type(x: string): Specification<unknown>

  arrayElements(n: number): Specification<unknown[]>

  arrayElementsRange(min: number, max: number): Specification<unknown[]>

  startsWith(what: string): Specification<string>

  endsWith(what: string): Specification<string>

  test(regex: RegExp): Specification<string>
}

export type Spok = SpokFunction & SpokAssertions & SpokConfig
