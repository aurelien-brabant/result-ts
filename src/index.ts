type SplitResult<T, E> = [T, null] | [null, E]

type ResultCore<T, E> = {
    unwrap: () => T
    unwrap_or_default: <D>(dflt: D) => T | D
    split: () => SplitResult<T, E>
}

export type Result<T = unknown, E = Error> = (
    | { err: null; val: T }
    | { err: E }
) &
    ResultCore<T, E>

export const Ok = <T = void>(val: T): Result<T> => {
    return {
        val,
        err: null,
        unwrap: () => val,
        unwrap_or_default: () => val,
        split: () => [val, null],
    }
}

export const Err = <T = unknown, E = Error>(e: E): Result<T, E> => {
    return {
        err: e,
        unwrap: () => {
            throw e
        },
        unwrap_or_default: (dflt) => dflt,
        split: () => [null, e],
    }
}

export const resultify = <T extends (...args: unknown[]) => unknown>(
    fn: T
): ((
    ...args: Parameters<T>
) => ReturnType<T> extends Promise<infer U>
    ? Promise<Result<U, Error>>
    : Result<ReturnType<T>, Error>) => {
    return (...args: Parameters<T>) => {
        try {
            const r = fn(...args)

            if (!(r instanceof Promise)) {
                return Ok(r) as ReturnType<T> extends Promise<infer U>
                    ? Promise<Result<U, Error>>
                    : Result<ReturnType<T>, Error>
            }

            return new Promise<Result<ReturnType<T>, Error>>((resolve) => {
                ;(r as Promise<ReturnType<T>>)
                    .then((val) => resolve(Ok(val)))
                    .catch((err) => resolve(Err(err)))
            }) as ReturnType<T> extends Promise<infer U>
                ? Promise<Result<U, Error>>
                : Result<ReturnType<T>, Error>
        } catch (e: unknown) {
            return Err(new Error(`${e}`)) as ReturnType<T> extends Promise<
                infer U
            >
                ? Promise<Result<U, Error>>
                : Result<ReturnType<T>, Error>
        }
    }
}
