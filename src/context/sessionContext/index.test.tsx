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
import { render, waitFor } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import SessionContext, { SessionProvider } from ".";

function ChildComponent(): React.ReactElement {
  const { session, sessionRequestInProgress } = React.useContext(
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
    </div>
  );
}

describe("Testing SessionContext matches snapshot", () => {
  it("matches snapshot", async () => {
    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockResolvedValue(null),
      on: jest.fn(),
      fetch: jest.fn(),
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

  it("throws an error if handling incoming redirect fails", async () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const error = "Failed to handle";

    const session = {
      info: {
        isLoggedIn: true,
        webId: "https://fakeurl.com/me",
      },
      handleIncomingRedirect: jest.fn().mockRejectedValue(error),
      on: jest.fn(),
      fetch: jest.fn(),
    } as any;

    const { getByText } = render(
      <ErrorBoundary fallbackRender={({ error: e }) => <div>{e}</div>}>
        <SessionProvider session={session} sessionId="key">
          <ChildComponent />
        </SessionProvider>
      </ErrorBoundary>
    );

    await waitFor(() => expect(getByText(error)).toBeDefined());
    // eslint-disable-next-line no-console
    (console.error as jest.Mock).mockRestore();
  });
});
