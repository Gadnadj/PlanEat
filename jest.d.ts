/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R> {
    toMatchObject(expected: object): R;
  }
}
