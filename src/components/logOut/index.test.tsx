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
import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  logout,
  getDefaultSession,
  handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";

import { SessionProvider } from "../../context/sessionContext";
import { LogoutButton } from ".";

jest.mock("@inrupt/solid-client-authn-browser");

const onLogout = jest.fn();
const onError = jest.fn();

const sessionPromise = new Promise((resolve) => resolve(null));
beforeEach(() => {
  jest.resetAllMocks();

  (getDefaultSession as jest.Mock).mockReturnValue({
    info: { isLoggedIn: false },
    on: jest.fn(),
  });
  (handleIncomingRedirect as jest.Mock).mockReturnValue(sessionPromise);
});

/**
 * Used to render the component and wait for the subsequent SessionProvider
 * async loading flow to finish. Used to prevent `act` warnings from occurring.
 */
const renderLogout = async (
  props: React.ComponentProps<typeof LogoutButton>
) => {
  const wrapper: React.FC = ({ children }) => (
    <SessionProvider sessionId="key">{children}</SessionProvider>
  );

  const testingUtils = render(
    <LogoutButton {...props} />,
    { wrapper }
  );

  await act(async () => { await sessionPromise });

  return testingUtils;
};

describe("<LogoutButton /> component snapshot test", () => {
  it("matches snapshot", async () => {
    const documentBody = await renderLogout({ onLogout, onError });
    const { baseElement } = documentBody;

    expect(baseElement).toMatchSnapshot();
  });
});

describe("<LogoutButton /> component visual testing", () => {
  it("Renders child element", async () => {
    const { getByText } = await renderLogout({
      onLogout,
      onError,
      children: <div>Custom child element</div>,
    });

    expect(getByText("Custom child element")).toBeTruthy();
  });
});

describe("<LogOutButton /> component functional testing", () => {
  it("fires the onClick function and calls onLogout", async () => {
    const user = userEvent.setup();
    const { getByText } = await renderLogout({ onLogout, onError });

    await user.click(getByText("Log Out"));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("fires the onKeyPress function if enter is pressed", async () => {
    const user = userEvent.setup();
    const { getByText } = await renderLogout({ onLogout, onError });

    getByText("Log Out").focus();
    await user.keyboard("{Enter}");

    expect(logout).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("does not fire the onKeyPress function if a non-enter button is pressed", async () => {
    const user = userEvent.setup();
    const { getByText } = await renderLogout({ onLogout, onError });

    getByText("Log Out").focus();
    await user.keyboard("A");

    expect(onLogout).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();
  });

  it("fires on click and doesn't pass onLogout", async () => {
    const user = userEvent.setup();
    const { getByText } = await renderLogout({ onError });

    await user.click(getByText("Log Out"));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(0);
  });

  it("fires the onClick function and calls OnError", async () => {
    (logout as jest.Mock).mockRejectedValue(null);
    const user = userEvent.setup();
    const { getByText } = await renderLogout({ onLogout, onError });

    await user.click(getByText("Log Out"));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("fires the onClick function and doesn't call OnError if it wasn't provided", async () => {
    (logout as jest.Mock).mockRejectedValue(null);
    const user = userEvent.setup();
    const { getByText } = await renderLogout({ onLogout });

    await user.click(getByText("Log Out"));

    expect(onError).toHaveBeenCalledTimes(0);
  });
});
