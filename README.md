# Solid React SDK v2 - solid-ui-react
solid-ui-react is a library of React components made to make development with [Solid](https://solidproject.org/) simple.

The goal of this library is to provide highly flexible, simple components that you can use in any browser-based Solid project and customize to match the UI of your application. It uses the [Inrupt Javascript Client Libraries](https://github.com/inrupt/solid-client-js) for authentication and data manipulation. It is built with typescript and exports its types.

In this library, you will find:

- **Authentication components**, which can help you log in and log out of an identiy provider
- **Data components**, which can help you view and edit individual properties or view a sortable and filterable table of many things
- **Context providers and hooks** to help simplify development when using functional programming

This project is currently in Beta. Interfaces subject to change. Not for production use.

**Note:** this project supersedes [Solid React SDK v1 by Inrupt](https://github.com/inrupt/solid-react-sdk)

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

# Solid JavaScript Client - solid-client
[@inrupt/solid-client](https://github.com/inrupt/solid-client-js) is a JavaScript library for accessing data and managing permissions on data stored in Solid Pods. It provides an abstraction layer on top of both Solid and Resource Description Framework (RDF) principles and is compatible with the RDF/JS specification. You can use solid-client in Node.js using CommonJS modules and in the browser with a bundler like Webpack, Rollup, or Parcel.

[@inrupt/solid-client](https://github.com/inrupt/solid-client-js) is part of a family open source JavaScript libraries designed to support developers building Solid applications.

# Issues & Help

## Solid Community Forum

If you have questions about working with Solid or just want to share what you’re working on, visit the [Solid forum](https://forum.solidproject.org/). The Solid forum is a good place to meet the rest of the community.

## Bugs and Feature Requests

- For public feedback, bug reports, and feature requests please file an issue via [GitHub](https://github.com/inrupt/solid-ui-react/issues/).
- For non-public feedback or support inquiries please use the [Inrupt Service Desk](https://inrupt.atlassian.net/servicedesk).

## Documentation

- [Inrupt Solid Javascript React SDK](https://docs.inrupt.com/developer-tools/javascript/react-sdk/)
- [View and play with the live examples on Storybook](https://solid-ui-react.docs.inrupt.com).
- [Homepage](https://docs.inrupt.com/)

# Changelog

See [the release notes](https://github.com/inrupt/solid-ui-react/blob/master/CHANGELOG.md).

# License

MIT © [Inrupt](https://inrupt.com)
