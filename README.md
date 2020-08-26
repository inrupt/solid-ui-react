# solid-ui-react
React SDK using solid-core.

STATUS: DEVELOPER PREVIEW. Interfaces subject to change. Not for production use.

Documentation forthcoming. For now, [view and play with the live examples on Storybook](https://solid-ui-react.vercel.app/).

## Installation

To install into your project, run `npm install -S @inrupt/solid-ui-react`.

Import components from this package, such as:

`import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";`

## Development

All development should follow the [Inrupt Coding Guidelines](https://github.com/inrupt/public-documentation/tree/master/coding-conventions). The existing linting and testing tools should automate most of this.

1. Clone the repository
2. From the directory you cloned to, run `npm install` to install dependencies
3. Run `npm run storybook` to run a live-reloading Storybook server
4. Run `npm run lint` and `npm run test` (or `npm run ci` to run everything) after making changes
