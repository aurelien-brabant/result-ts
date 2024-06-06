A Typescript error handling library inspired by Rust's Result type.

There is a lot of those already, but this one aims to be simple and doesn't attempt to turn Typescript into a functional programming language.

I originally wrote this because I find error handling in Typescript absolutely terrible. Wrapping everything in try/catch blocks really isn't my thing.

If you plan to use this, I recommend you simply copy `src/index.ts` into your project instead of installing this package, given how small it is.

## Usage

### Writing a function that returns a Result

```typescript
import { Result, Ok, Err } from '@aurelle/result';

const divide = (a: number, b: number): Result<number, Error> {
    if (b === 0) {
        return Err(new Error('Division by zero'));
    }

    return Ok(a / b);
}
```

### Using a Result

#### Checking for error on the result

```typescript
const result = divide(10, 2);

if (result.err) {
    // handle error
    return ;
}

// work with result
console.log(result.val);
```

#### Using a tuple

```typescript
const [divided, divisionErr] = divide(10, 2).split();

if (divisionErr) {
    // handle error
    return ;
}

// work with result
console.log(divided);
```

#### Ignoring the error

```typescript
// throws if there is an error
const divided = divide(10, 2).unwrap();

console.log(divided);
```

### Working with existing functions

It is possible to turn any existing function into a function that returns a `Result` by using the `resultify` utility:

```typescript
import { readFileSync } from 'fs';
import { resultify } from '@aurelle/result';

const rfs = resultify(readFileSync);
const file = rfs('file.txt', 'utf8'); // Result<string, Error>
```

Note that `resultify` also works with async functions. It will return a function that returns a `Promise<Result<T, E>>`.
