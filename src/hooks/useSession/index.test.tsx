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
import { renderHook } from "@testing-library/react-hooks";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SessionContext } from "../../context/sessionContext";
import useSession from ".";

describe("useSession() hook functional testing", () => {
  it("The hook should return values set in the SessionContext", async () => {
    interface IProps {
      children: React.ReactNode;
    }

    const wrapper = ({ children }: IProps) => (
      <SessionContext.Provider
        value={{
          fetch: jest.fn(),
          sessionRequestInProgress: true,
          session: {
            info: {
              webId: "https://solid.community/",
              isLoggedIn: true,
              sessionId: "some-session-id",
            },
          } as Session,
          login: jest.fn(),
          logout: jest.fn(),
          profile: undefined,
        }}
      >
        {children}
      </SessionContext.Provider>
    );

    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current.session.info.webId).toEqual(
      "https://solid.community/"
    );
    expect(result.current.sessionRequestInProgress).toEqual(true);
  });
});
