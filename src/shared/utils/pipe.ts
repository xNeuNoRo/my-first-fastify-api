/**
 * @description Un pipe que permite encadenar funciones de manera legible y fácil de entender.
 * @example
 * const addOne = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const result = pipe(5, addOne, double); // el resultado será 12 ((5 + 1) * 2)
 * @param value El valor inicial que se pasará a la primera función.
 * @param fns Una lista de funciones que se aplicarán al valor inicial de manera secuencial. Cada función recibirá el resultado de la función anterior como argumento.
 * @returns El resultado final después de aplicar todas las funciones al valor inicial.
 */
export function pipe<T>(value: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}
