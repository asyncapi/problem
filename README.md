# AsyncAPI Problem

Library that implements the Problem interface. Reference https://www.rfc-editor.org/rfc/rfc7807.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Installation](#installation)
- [Examples](#examples)
  * [Simple example](#simple-example)
  * [Mixin example](#mixin-example)
- [Develop](#develop)
- [Contributing](#contributing)

<!-- tocstop -->

## Installation

```bash
npm install @asyncapi/problem
// OR
yarn add @asyncapi/problem
```

## Examples

### Simple example

```ts
import { Problem } from '@asyncapi/problem';

const problem = new Problem({ type: 'https://example.com/problem', title: 'Example problem' });
console.log(problem.get('type'));

// Output:
// https://example.com/problem
```

### Mixin example

```ts
import { ProblemMixin } from '@asyncapi/problem';

class MyProblem extends ProblemMixin({ typePrefix: 'https://example.com' }) {}

const problem = new MyProblem({ type: 'problem', title: 'Example problem' });
console.log(problem.get('type'));

// Output:
// https://example.com/problem
```

## Develop

1. Write code and tests in the `__tests__` folder.
2. Make sure all tests pass by `npm test` command.
3. Make sure code can be transformed to JS by `npm run build` command.
4. Make sure code is well formatted and secure by `npm run lint:fix` command.

## Contributing

Read [CONTRIBUTING](./CONTRIBUTING.md) guide.
