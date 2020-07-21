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
import LogoutButton from "./index";

jest.mock("solid-auth-client");
let documentBody: RenderResult;
const onLogout = jest.fn();
const onError = jest.fn();

describe("<LogoutButton /> component snapshot test", () => {
  beforeEach(() => {
    documentBody = render(
      <LogoutButton onLogout={onLogout} onError={onError} />
    );
  });
  it("matches snapshot", () => {
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<LogoutButton /> component visual testing", () => {
  it("Renders child element", () => {
    const { getByText } = render(
      <LogoutButton onLogout={onLogout} onError={onError}>
        <div>Custom child element</div>
      </LogoutButton>
    );

    expect(getByText("Custom child element")).toBeTruthy();
  });
});

describe("<LoginButton /> component functional testing", () => {
  it("fires the onClick function and calls OnLogout", async () => {
    (auth.logout as jest.Mock).mockImplementationOnce(() => Promise.resolve());
    const { getByText } = render(
      <LogoutButton onLogout={onLogout} onError={onError} />
    );

    fireEvent.click(getByText("Log Out"));
    expect(auth.logout).toHaveBeenCalled();
    await waitFor(() => expect(onLogout).toHaveBeenCalledTimes(1));
  });

  it("fires the onClick function and calls OnError", async () => {
    (auth.logout as jest.Mock).mockImplementationOnce(() => Promise.reject());
    const { getByText } = render(
      <LogoutButton onLogout={onLogout} onError={onError} />
    );

    fireEvent.click(getByText("Log Out"));
    expect(auth.logout).toHaveBeenCalled();
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });
});
