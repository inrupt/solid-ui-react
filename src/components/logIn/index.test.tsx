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
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  login,
  getDefaultSession,
  handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";

import { LoginButton } from "./index";
import { SessionProvider } from "../../context/sessionContext";

jest.mock("@inrupt/solid-client-authn-browser");

const onError = jest.fn().mockResolvedValue(null);

const session = {
  info: { isLoggedIn: false },
  on: jest.fn(),
} as any;

beforeEach(() => {
  jest.resetAllMocks();

  (getDefaultSession as jest.Mock).mockReturnValue(session);
  (handleIncomingRedirect as jest.Mock).mockResolvedValueOnce(null);
});

describe("<LoginButton /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <SessionProvider sessionId="key">
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
    const { getByText } = render(
      <SessionProvider sessionId="key">
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
  it("fires the onClick function when clicked", async () => {
    const oidcIssuer = "https://test.url";
    const redirectUrl = "https://local.url/redirect";

    const user = userEvent.setup();

    const { getByText } = render(
      <SessionProvider sessionId="key">
        <LoginButton
          oidcIssuer={oidcIssuer}
          redirectUrl={redirectUrl}
          onError={onError}
        />
      </SessionProvider>
    );

    await user.click(getByText("Log In"));

    expect(login).toHaveBeenCalledWith({
      oidcIssuer,
      redirectUrl,
    });
  });

  it("fires the onKeyPress function if enter is pressed", async () => {
    const oidcIssuer = "https://test.url";
    const redirectUrl = "https://local.url/redirect";

    const user = userEvent.setup();

    const { getByText } = render(
      <SessionProvider sessionId="key">
        <LoginButton
          oidcIssuer={oidcIssuer}
          redirectUrl={redirectUrl}
          onError={onError}
        />
      </SessionProvider>
    );

    getByText("Log In").focus();

    await user.keyboard("{Enter}");

    expect(login).toHaveBeenCalledWith({
      oidcIssuer,
      redirectUrl,
    });
  });

  it("does not fire the onKeyPress function if a non-enter button is pressed", async () => {
    const oidcIssuer = "https://test.url";
    const redirectUrl = "https://local.url/redirect";

    const user = userEvent.setup();

    const { getByText } = render(
      <SessionProvider sessionId="key">
        <LoginButton
          oidcIssuer={oidcIssuer}
          redirectUrl={redirectUrl}
          onError={onError}
        />
      </SessionProvider>
    );

    getByText("Log In").focus();

    await user.keyboard("A");

    expect(login).not.toHaveBeenCalled();
  });

  it("fires the onClick function and calls OnError", async () => {
    (login as jest.Mock).mockRejectedValue(null);

    const user = userEvent.setup();

    const { getByText } = render(
      <SessionProvider sessionId="key">
        <LoginButton
          oidcIssuer="https://test.url"
          redirectUrl="https://test.url/redirect"
          onError={onError}
        />
      </SessionProvider>
    );

    await user.click(getByText("Log In"));

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("fires the onClick function and doesn't call OnError if it wasn't provided", async () => {
    (login as jest.Mock).mockRejectedValue(null);

    const user = userEvent.setup();

    const { getByText } = render(
      <SessionProvider sessionId="key">
        <LoginButton
          oidcIssuer="https://test.url"
          redirectUrl="https://test.url/redirect"
        />
      </SessionProvider>
    );

    await user.click(getByText("Log In"));

    expect(onError).toHaveBeenCalledTimes(0);
  });
});
