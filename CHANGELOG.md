# Changelog

This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

- The following components now take an optional `loadingComponent` to be rendered while fetching data:
  - `Value`
  - `Text`
  - `Link`
  - `Image`
  - `Video`
- When these are not passed, the components render a default message instead. 

- The following components now take an optional `errorComponent` to be rendered in case of error:
  - `Value`
  - `Text`
  - `Link`
- When these are not passed, the components render a default message instead. 

The following sections document changes that have been released already:

## 2.3.1 ( June 9, 2021 )

### Bugs fixed

- The `Value` component now handles the case where `datetime-local` is unsupported by the browser and renders two inputs with type `date` and `time` instead. 
- Updated @inrupt/solid-client-authn-browser, which was causing an issue where `SessionContext`'s `sessionRequestInProgress` property would not be set to `false` properly in some cases.

## 2.3.0 ( May 31, 2021 )

### Changed

- The `SessionProvider` component now accepts additional variables to enable
logging back in on refresh. 

## 2.2.0 ( May 19, 2021 )

### Changed

- Updated all dependencies, including @inrupt/solid-client from 1.3.0 to 1.6.1, and @inrupt/solid-client-authn-browser from 1.5.1 to 1.8.0

## 2.1.0 ( January 14, 2021 )

### Changed

- If no `onError` is passed to a SessionContext, an error will be thrown
- `login` from `useSession` will now throw errors if an error occurs
- Only `Enter` keyboard events will trigger login and logout on the default
  LoginButton and LogoutButton
- Packages have been upgraded - notably, `@inrupt/solid-client-authn-browser` which allows
  refreshing without losing the current session

## 2.0.0 ( November 6, 2020 )

### BREAKING

- `dataset` property replaced by `solidDataset` in components so that the property would not
  conflict with intrisic HTML element attributes.
- Components such as `text` and `value` no longer throw errors if something goes wrong during
  reading or saving, and instead always call `onError` if provided.

### Added

- All components which previously took a `property` prop now can optionally accept a
  `properties` prop instead, which will be an ordered list of properties to attempt to read and
  write from. If none of the properties have values, the first will be used if editing data.

## 1.7.0 ( November 6, 2020 )

### Changed

- Upgraded dependencies, especially solid-client-* to v1.0

## 1.6.1 ( November 3, 2020 )

### Changed

- `sessionId` is now optional for `SessionProvider`

## 1.6.0 ( October 27, 2020 )

### Added

- Add login and logout functions to SessionContext/SessionProvider

## 1.5.1 ( October 26, 2020 )

### Changed

- Updated solid-client-auth to 0.2.2, and solid-client to 0.6.1

## 1.4.0 ( October 16, 2020 )

### Added

- Added `errorComponent` to `<Image>` and `<Video>`, allowing a placeholder component to be
  rendered in the place of either in case a thing or value is not found.

### Changed

- Updated package dependencies

## 1.3.0 ( September 30, 2020 )

### Added

- Added `getRowProps` to `<Table>`, allowing a function to be provided to generate attributes for
  each `<tr>`, based on row data.

## 1.2.1 ( September 24, 2020 )

### Changed

- ThingProvider correctly updates its stored Thing in state in response to changes in `thing` prop

## 1.2.0 ( September 23, 2020 )

### Changed

- Pass saved dataset and thing to onSave in Text and Value

## 1.1.0 ( September 22, 2020 )

### Changed

- Exported `setDataset` and `setThing` from DatasetProvider and ThingProvider, respectively.
  This allows components which save data to reset the dataset to what the server returns.
- Allow non- `URL` values to be set for the LoginButton. This prevents some errors from
  occuring, such as if the value is updated as the user types.
- Added additional storybook documentation and cleaned up examples.

## 1.0.0 ( September 21, 2020 )

### Changed

- Breaking change to Table - `things` prop now takes an array of objects `{ dataset, thing }`

## 0.11.3 ( September 17, 2020 )

### Changed

- Added type for `useSession` return value
- Updated decimal and datetime `<Value>` types to add "step="any" by default
- Reduced bundle size (making react-table and swr external imports)
- Upgraded to storybook 6

## 0.11.2 ( September 15, 2020 )

### Changed

- @inrupt/solid-client version to 0.4.0

## 0.11.0 ( September 14, 2020 )

### Added

- Add useThing and useDataset hooks

## 0.9.8 ( September 9, 2020 )

### Added

- Added sortable/filterable `<Table>` and `<TableColumn>`, to display rows of Things and columns of properties
- Tidied logs when testing intentionally thrown errors

## 0.9.7 ( August 28, 2020 )

### Changed

- Improve handling of unloaded datasets with `<Image>`, `<Text>`, and `<Value>` components.

## 0.9.6 ( August 28, 2020 )

### Added

- Allow `<DatasetProvider>` to render a `loading` property or component instead of its children

## 0.9.4 ( August 28, 2020 )

### Added

- Allow `<Image>` and `<Video>` to read data from ThingContext

## 0.9.2 ( August 28, 2020 )

### Added

- Generate TypeScript definition files
- Simplify NPM package structure and files

## 0.9.1 ( August 26, 2020 )

### Added

- Exported all components, contexts, and providers from src/index.js.

## 0.9.0 ( August 26, 2020 )

### Changed

- Switched from `solid-auth-client` to `@inrupt/solid-client-authn-browser` for
  authentication, which allows for dynamic registration and DPoP OIDC flow

## 0.8.2 ( August 12, 2020 )

### Changed

- Added sub-folders for storybook Authentication Providers Components

- Added storybook knobs to image video and link components

- Added storybook knobs to Dataset Thing and Combined providers

## 0.8.1 ( August 12, 2020 )

### Changed

- Added context support for the <Text /> component

## 0.8.0 ( August 10, 2020 )

### Added

- Added Video component

## 0.7.1 ( August 10, 2020 )

### Changed

- @inrupt/solid-client version to 0.1.1

## 0.7.0 ( August 7, 2020 )

### Added

- Dataset Provider Context
- Thing Provider Context
- Combined Dataset and Thing Provider wrapper

## 0.6.0 ( August 5, 2020 )

### Added

- Image component

## 0.3.0 ( July 23, 2020 )

### Added

- Session Provider Context
- useSession hook

## 0.2.0 ( July 21, 2020 )

### Added

- Log In Component:
- Log Out Component
