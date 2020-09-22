/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import LoginButton from "./index";
import { SessionProvider } from "../../context/sessionContext";

const onError = jest.fn().mockResolvedValue(null);
const setSessionRequestInProgress = jest.fn().mockResolvedValue(null);

describe("<LoginButton /> component snapshot test", () => {
  it("matches snapshot", () => {
    const session = {
      info: { isLoggedIn: false },
      login: jest.fn().mockResolvedValue(null),
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
    } as any;

    const documentBody = render(
      <SessionProvider session={session} sessionId="key">
        <LoginButton
          oidcIssuer="https://test.url"
          redirectUrl="https://test.url/redirect"
          onError={onError}
        />
      </SessionProvider>
    );

    const { baseElement } = documentBody;

    expect(baseElement).toMatchSnapshot();
  });
});

describe("<LoginButton /> component visual testing", () => {
  it("Renders child element", () => {
    const session = {
      info: { isLoggedIn: false },
      login: jest.fn().mockResolvedValue(null),
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
    } as any;

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key">
        <LoginButton
          oidcIssuer="https://test.url"
          redirectUrl="https://test.url/redirect"
          onError={onError}
        >
          <div>Custom child element</div>
        </LoginButton>
      </SessionProvider>
    );

    expect(getByText("Custom child element")).toBeTruthy();
  });
});

describe("<LoginButton /> component functional testing", () => {
  it("fires the onClick function", async () => {
    const session = {
      info: { isLoggedIn: false },
      login: jest.fn().mockResolvedValue(null),
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
    } as any;

    const oidcIssuer = "https://test.url";
    const redirectUrl = "https://local.url/redirect";

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key">
        <LoginButton
          oidcIssuer={oidcIssuer}
          redirectUrl={redirectUrl}
          onError={onError}
        />
      </SessionProvider>
    );

    fireEvent.click(getByText("Log In"));
    expect(session.login).toHaveBeenCalledWith({ oidcIssuer, redirectUrl });
  });

  it("fires the onClick function and calls OnError", async () => {
    const session = {
      info: { isLoggedIn: false },
      login: jest.fn().mockRejectedValue(null),
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
    } as any;

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key">
        <LoginButton
          oidcIssuer="https://test.url"
          redirectUrl="https://test.url/redirect"
          onError={onError}
        />
      </SessionProvider>
    );
    fireEvent.click(getByText("Log In"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it("fires the onClick function and doesn't call OnError if it wasn't provided", async () => {
    const session = {
      info: { isLoggedIn: false },
      login: jest.fn().mockRejectedValue(null),
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
    } as any;

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key">
        <LoginButton
          oidcIssuer="https://test.url"
          redirectUrl="https://test.url/redirect"
        />
      </SessionProvider>
    );
    fireEvent.click(getByText("Log In"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(0));
  });
});
