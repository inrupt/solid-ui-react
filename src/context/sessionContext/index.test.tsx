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

import {
  login,
  logout,
  handleIncomingRedirect,
  getDefaultSession,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";

import { SessionContext, SessionProvider } from "./index";

jest.mock("@inrupt/solid-client-authn-browser");

function ChildComponent(): React.ReactElement {
  const {
    session,
    sessionRequestInProgress,
    login: sessionLogin,
    logout: sessionLogout,
  } = React.useContext(SessionContext);

  return (
    <div>
      {sessionRequestInProgress && (
        <div data-testid="sessionRequestInProgress">
          sessionRequestInProgress
        </div>
      )}
      <div data-testid="session">{JSON.stringify(session)}</div>
      <button type="button" onClick={() => sessionLogin({})}>
        Login
      </button>
      <button type="button" onClick={sessionLogout}>
        Logout
      </button>
    </div>
  );
}

describe("Testing SessionContext", () => {
  it("matches snapshot", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const documentBody = render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot without optional sessionId", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const documentBody = render(
      <SessionProvider>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("calls onError if handleIncomingRedirect fails", async () => {
    (handleIncomingRedirect as jest.Mock).mockRejectedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const onError = jest.fn();

    render(
      <SessionProvider sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });
});

describe("SessionContext functionality", () => {
  it("attempts to handle an incoming redirect", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });
  });

  it("uses the login and logout functions from session", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const { getByText } = render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    expect(login).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();

    fireEvent.click(getByText("Login"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(getByText("Logout"));

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });
  });

  it("calls onError if there is an error logging in", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);
    (login as jest.Mock).mockRejectedValueOnce(null);

    const onError = jest.fn();
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const { getByText } = render(
      <SessionProvider sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    fireEvent.click(getByText("Login"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it("calls onError if there is an error logging out", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);
    (logout as jest.Mock).mockRejectedValueOnce(null);

    const onError = jest.fn();
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const { getByText } = render(
      <SessionProvider sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    fireEvent.click(getByText("Logout"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it("registers a session restore callback if one is provided", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      on: jest.fn(),
    } as any;

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const sessionRestoreCallback = jest.fn();
    render(
      <SessionProvider
        sessionId="key"
        onSessionRestore={sessionRestoreCallback}
      >
        <ChildComponent />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    expect(onSessionRestore).toHaveBeenCalledWith(sessionRestoreCallback);
  });
});
