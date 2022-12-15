# Security policy

This library intends supporting the development of Solid applications reading and
writing data in Solid servers. Data should always be considered sensitive and
be processed with care and regards to access restrictions and personal information.

This library builds on top of the other Inrupt SDKs, such as 
[`@inrupt/solid-client`](https://github.com/inrupt/solid-client-js) which handles the underlying data access logic.

For a better separation of concerns, this library does not deal directly with
authentication or the actual fetching of data. In order to make authenticated 
requests, one should inject a `fetch` function compatible with the browser-native
[fetch API](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/fetch#parameters)
dealing with authentication. This may be done using Inrupt's authentication libraries
[for Node](https://www.npmjs.com/package/@inrupt/solid-client-authn-node) or [for
the browser](https://www.npmjs.com/package/@inrupt/solid-client-authn-browser).
The security policy for these libraries is available in the associated [GitHub repository](https://github.com/inrupt/solid-ui-react/blob/main/SECURITY.md).

# Reporting a vulnerability

If you discover a vulnerability in our code, or experience a bug related to security,
please report it following the instructions provided on [Inrupt’s security page](https://inrupt.com/security/).
