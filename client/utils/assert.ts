function assertNonNullable<T>(v: T): asserts v is NonNullable<T> {
    if (v == null) {
        throw new TypeError(`${v} is not NonNullable`);
    }
}

export { assertNonNullable };
