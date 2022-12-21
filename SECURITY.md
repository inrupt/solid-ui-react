# Security policy

This library intends supporting the development of Solid applications reading and
writing data in Solid servers. Data should always be considered sensitive and
be processed with care and regards to access restrictions and personal information.

This library builds on top of the other Inrupt SDKs, such as 
[`@inrupt/solid-client`](https://github.com/inrupt/solid-client-js) which handles the underlying data access logic. For a better separation of concerns, this library does not deal directly with
authentication or the actual fetching of data. 

The security policy for these libraries is available in the associated [GitHub repository](https://github.com/inrupt/solid-ui-react/blob/main/SECURITY.md).

# Reporting a vulnerability

If you discover a vulnerability in our code, or experience a bug related to security,
please report it following the instructions provided on [Inrupt’s security page](https://inrupt.com/security/).
