declare type Assert = {
    equal(actual: any, expected: any, msg?: string): void;
    deepEqual(actual: any, expected: any, msg?: string): void;
};
interface Specifications extends Object {
    $topic?: string;
    $spec?: string;
    $description?: string;
}
interface Specification<T> extends Specifications {
    (val: T): boolean;
}
interface Spok {
    (t: Assert, obj: object, specifications: Specifications, prefix?: string | null): void;
    printSpec: boolean;
    printDescription: boolean;
    sound: boolean;
    color: boolean;
    gtz: Specification<number>;
    gez: Specification<number>;
    ltz: Specification<number>;
    lez: Specification<number>;
    array: Specification<[]>;
    number: Specification<any>;
    string: Specification<any>;
    function: Specification<any>;
    definedObject: Specification<object | null>;
    defined: Specification<object | null>;
    notDefined: Specification<object | null>;
    range(min: number, max: number): Specification<number>;
    gt(x: number): Specification<number>;
    ge(x: number): Specification<number>;
    lt(x: number): Specification<number>;
    le(x: number): Specification<number>;
    ne(x: number): Specification<number>;
    type(x: string): Specification<any>;
    arrayElements(n: number): Specification<[]>;
    arrayElementsRange(min: number, max: number): Specification<[]>;
    startsWith(what: string): Specification<string>;
    endsWith(what: string): Specification<string>;
    test(regex: RegExp): Specification<string>;
}
/**
 * Checks the given specifications against the object.
 *
 * When the tests are run the **actual** values are printed
 * to verify visually while each provided specification is validated
 * and a test failure caused if one of them fails.
 *
 * @function
 *
 * @param {Object} t which has assertion functions `equal` and
 * `deepEqual` (to compare objects) - use * **tap**, **tape**,
 * **assert** or any other library that has those and thus is compatible
 *
 * @param {Object} obj the object to verify the specifications against
 * @param {Specifications} specifications the specifications to verify
 * @param {String } prefix added to messages
 */
declare const spok: Spok;
export default spok;
