export type Assert = {
  equal(actual: any, expected: any, msg?: string): void
  deepEqual(actual: any, expected: any, msg?: string): void
}

// -----------------
// Node.js Core Types
// -----------------

// Not exposed for some reason.
// The actual context as more properties, diagnostics is all we need.
export type TestContext = {
  /**
   * This function is used to write TAP diagnostics to the output. Any diagnostic information is
   * included at the end of the test's results. This function does not return a value.
   * @param message Message to be displayed as a TAP diagnostic.
   * @since v16.17.0
   */
  diagnostic(message: string): void
}

export function isTestContext(t: Assert | TestContext): t is TestContext {
  return typeof (t as TestContext).diagnostic === 'function'
}
