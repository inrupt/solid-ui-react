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
import { fireEvent, render, waitFor } from "@testing-library/react";
import { SessionContext, SessionProvider } from ".";

function ChildComponent(): React.ReactElement {
  const { session, sessionRequestInProgress, login, logout } = React.useContext(
    SessionContext
  );

  return (
    <div>
      {sessionRequestInProgress && (
        <div data-testid="sessionRequestInProgress">
          sessionRequestInProgress
        </div>
      )}
      <div data-testid="session">{JSON.stringify(session)}</div>
      <button type="button" onClick={() => login({})}>
        Login
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe("Testing SessionContext", () => {
  it("matches snapshot", async () => {
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    } as any;

    const documentBody = render(
      <SessionProvider session={session} sessionId="key">
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(session.handleIncomingRedirect).toHaveBeenCalled();
    });

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot without optional sessionId", async () => {
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    } as any;

    const documentBody = render(
      <SessionProvider session={session}>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(session.handleIncomingRedirect).toHaveBeenCalled();
    });

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("SessionContext functionality", () => {
  it("attempts to handle an incoming redirect", async () => {
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    } as any;

    render(
      <SessionProvider session={session} sessionId="key">
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(session.handleIncomingRedirect).toHaveBeenCalled();
    });
  });

  it("passes the login and logout functions from session", async () => {
    const login = jest.fn();
    const logout = jest.fn();
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
      login,
      logout,
    } as any;

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key">
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(session.handleIncomingRedirect).toHaveBeenCalled();
    });

    expect(login).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();

    fireEvent.click(getByText("Login"));
    expect(login).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText("Logout"));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("calls onError if there is an error logging in", async () => {
    const login = jest.fn().mockRejectedValue(null);
    const logout = jest.fn();
    const onError = jest.fn();
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
      login,
      logout,
    } as any;

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(session.handleIncomingRedirect).toHaveBeenCalled();
    });

    fireEvent.click(getByText("Login"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it("calls onError if there is an error logging out", async () => {
    const login = jest.fn();
    const logout = jest.fn().mockRejectedValue(null);
    const onError = jest.fn();
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
      login,
      logout,
    } as any;

    const { getByText } = render(
      <SessionProvider session={session} sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(session.handleIncomingRedirect).toHaveBeenCalled();
    });

    fireEvent.click(getByText("Logout"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });
});
