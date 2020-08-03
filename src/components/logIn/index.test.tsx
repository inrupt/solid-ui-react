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
import {
  render,
  RenderResult,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import auth from "solid-auth-client";
import LoginButton from "./index";
import { SessionContext } from "../../context/sessionContext";

jest.mock("solid-auth-client");
let documentBody: RenderResult;
const onLogin = jest.fn();
const onError = jest.fn();
const setSessionRequestInProgress = jest.fn();

describe("<LoginButton /> component snapshot test", () => {
  beforeEach(() => {
    documentBody = render(
      <SessionContext.Provider value={{ setSessionRequestInProgress }}>
        <LoginButton
          popupUrl="./popup.html"
          onLogin={onLogin}
          onError={onError}
        />
      </SessionContext.Provider>
    );
  });
  it("matches snapshot", () => {
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<LoginButton /> component visual testing", () => {
  it("Renders child element", () => {
    const { getByText } = render(
      <SessionContext.Provider value={{ setSessionRequestInProgress }}>
        <LoginButton
          popupUrl="./popup.html"
          onLogin={onLogin}
          onError={onError}
        >
          <div>Custom child element</div>
        </LoginButton>
      </SessionContext.Provider>
    );

    expect(getByText("Custom child element")).toBeTruthy();
  });
});

describe("<LoginButton /> component functional testing", () => {
  it("fires the onClick function and calls OnLogin", async () => {
    (auth.popupLogin as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve()
    );

    const { getByText } = render(
      <SessionContext.Provider value={{ setSessionRequestInProgress }}>
        <LoginButton
          popupUrl="./popup.html"
          onLogin={onLogin}
          onError={onError}
        />
      </SessionContext.Provider>
    );

    fireEvent.click(getByText("Log In"));
    expect(setSessionRequestInProgress).toHaveBeenCalledTimes(1);
    expect(auth.popupLogin).toHaveBeenCalled();

    await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1));
  });

  it("fires the onClick function and doesn't call OnLogin if it wasn't provided", async () => {
    (auth.popupLogin as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve()
    );

    const { getByText } = render(
      <SessionContext.Provider value={{ setSessionRequestInProgress }}>
        <LoginButton popupUrl="./popup.html" onError={onError} />
      </SessionContext.Provider>
    );

    fireEvent.click(getByText("Log In"));
    await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(0));
  });

  it("fires the onClick function and calls OnError", async () => {
    (auth.popupLogin as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );
    const { getByText } = render(
      <SessionContext.Provider value={{ setSessionRequestInProgress }}>
        <LoginButton
          popupUrl="./popup.html"
          onLogin={onLogin}
          onError={onError}
        />
      </SessionContext.Provider>
    );
    fireEvent.click(getByText("Log In"));
    expect(auth.popupLogin).toHaveBeenCalled();
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it("fires the onClick function and doesn't call OnError if it wasn't provided", async () => {
    (auth.popupLogin as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );
    const { getByText } = render(
      <SessionContext.Provider value={{ setSessionRequestInProgress }}>
        <LoginButton popupUrl="./popup.html" onLogin={onLogin} />
      </SessionContext.Provider>
    );
    fireEvent.click(getByText("Log In"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(0));
  });
});
