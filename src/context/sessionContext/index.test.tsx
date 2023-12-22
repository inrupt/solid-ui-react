//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  login,
  logout,
  handleIncomingRedirect,
  getDefaultSession,
  EVENTS,
} from "@inrupt/solid-client-authn-browser";

import { getProfileAll } from "@inrupt/solid-client";

import { SessionContext, SessionProvider } from ".";

jest.mock("@inrupt/solid-client-authn-browser", () => {
  const authnModule = jest.requireActual("@inrupt/solid-client-authn-browser");
  return {
    EVENTS: authnModule.EVENTS,
    getDefaultSession: jest.fn().mockReturnValue({
      events: { on: jest.fn() },
    }),
    handleIncomingRedirect: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };
});
jest.mock("@inrupt/solid-client");

function ChildComponent(): React.ReactElement {
  const {
    session,
    sessionRequestInProgress,
    login: sessionLogin,
    logout: sessionLogout,
    profile,
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
      <button
        type="button"
        onClick={() => sessionLogout()}
        data-testid="logout"
      >
        Logout
      </button>
      <p data-testid="profile">
        {profile
          ? `${profile.altProfileAll.length} alt profiles found`
          : "No profile found"}
      </p>
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
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const documentBody = render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>,
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
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const documentBody = render(
      <SessionProvider>
        <ChildComponent />
      </SessionProvider>,
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
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const onError = jest.fn();

    render(
      <SessionProvider sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>,
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
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });
  });

  it("fetches the user's profile if logging in succeeds", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce({
      webId: "https://some.webid",
    });

    const mockedClientModule = jest.requireMock("@inrupt/solid-client");
    const actualClientModule = jest.requireActual("@inrupt/solid-client");
    mockedClientModule.getProfileAll = jest.fn().mockResolvedValue({
      webIdProfile:
        actualClientModule.mockSolidDatasetFrom("https://some.webid"),
      altProfileAll: [
        actualClientModule.mockSolidDatasetFrom("https://some.profile"),
      ],
    });

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const user = userEvent.setup();
    const screen = render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>,
    );
    await waitFor(async () => {
      expect(screen.getByTestId("profile").textContent).toBe(
        "1 alt profiles found",
      );
    });
    await user.click(screen.getByTestId("logout"));

    expect(screen.getByTestId("profile").textContent).toBe("No profile found");
    expect(mockedClientModule.getProfileAll).toHaveBeenCalled();
  });

  it("allows skipping fetching the user's profile if logging in succeeds", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce({
      webId: "https://some.webid",
    });

    (getProfileAll as jest.Mock).mockResolvedValue({
      webIdProfile: null,
      altProfileAll: [],
    });

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const screen = render(
      <SessionProvider skipLoadingProfile>
        <ChildComponent />
      </SessionProvider>,
    );
    await waitFor(async () => {
      expect(screen.getByTestId("profile").textContent).toBe(
        "No profile found",
      );
    });

    expect(screen.getByTestId("profile").textContent).toBe("No profile found");
    expect(getProfileAll).not.toHaveBeenCalled();
    expect(handleIncomingRedirect).toHaveBeenCalled();
  });

  it("uses the login and logout functions from session", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const user = userEvent.setup();
    const { getByText } = render(
      <SessionProvider sessionId="key">
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    expect(login).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();

    await user.click(getByText("Login"));

    expect(login).toHaveBeenCalledTimes(1);

    await user.click(getByText("Logout"));

    expect(logout).toHaveBeenCalledTimes(1);
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
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const user = userEvent.setup();
    const { getByText } = render(
      <SessionProvider sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    await user.click(getByText("Login"));

    expect(onError).toHaveBeenCalledTimes(1);
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
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const user = userEvent.setup();
    const { getByText } = render(
      <SessionProvider sessionId="key" onError={onError}>
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    await user.click(getByText("Logout"));

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("registers a session restore callback if one is provided", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const sessionRestoreCallback = jest.fn();
    render(
      <SessionProvider
        sessionId="key"
        onSessionRestore={sessionRestoreCallback}
      >
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    expect(session.events.on).toHaveBeenCalledWith(
      EVENTS.SESSION_RESTORED,
      sessionRestoreCallback,
    );
  });

  it("does not register a session restore callback on every render unless it changes", async () => {
    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      events: { on: jest.fn() },
    };

    (getDefaultSession as jest.Mock).mockReturnValue(session);

    const sessionRestoreCallback = jest.fn();
    const differentSessionRestoreCallback = jest.fn();

    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    const { rerender } = render(
      <SessionProvider
        sessionId="key"
        onSessionRestore={sessionRestoreCallback}
      >
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);

    rerender(
      <SessionProvider
        sessionId="key"
        onSessionRestore={sessionRestoreCallback}
      >
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    rerender(
      <SessionProvider
        sessionId="key"
        onSessionRestore={differentSessionRestoreCallback}
      >
        <ChildComponent />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(handleIncomingRedirect).toHaveBeenCalled();
    });

    expect(session.events.on).toHaveBeenCalledTimes(3);
    expect(session.events.on).toHaveBeenCalledWith(
      EVENTS.SESSION_RESTORED,
      sessionRestoreCallback,
    );
    expect(session.events.on).toHaveBeenCalledWith(
      EVENTS.SESSION_RESTORED,
      differentSessionRestoreCallback,
    );
  });
});
