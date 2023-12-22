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
import { renderHook, waitFor } from "@testing-library/react";
import SolidFns from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SessionContext } from "../../context/sessionContext";
import useFile from ".";

describe("useFile() hook", () => {
  const mockUrl = "https://mock.url";
  const mockFile = SolidFns.mockFileFrom(mockUrl);
  const mockGetFile = jest.spyOn(SolidFns, "getFile");
  const mockFetch = jest.fn();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionContext.Provider
      value={{
        fetch: mockFetch,
        sessionRequestInProgress: true,
        session: {} as Session,
        logout: async () => {},
        login: async () => {},
        profile: undefined,
      }}
    >
      {children}
    </SessionContext.Provider>
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getFile with given url", async () => {
    mockGetFile.mockResolvedValue(mockFile);
    const { result } = renderHook(() => useFile(mockUrl), {
      wrapper,
    });

    expect(mockGetFile).toHaveBeenCalledTimes(1);
    expect(mockGetFile).toHaveBeenCalledWith(mockUrl, { fetch: mockFetch });
    await waitFor(() => expect(result.current.data).toBe(mockFile));
  });

  it("if fetching fails it should return error", async () => {
    const mockError = new Error("Error fetching file");
    mockGetFile.mockRejectedValue(mockError);
    const { result } = renderHook(() => useFile(mockUrl), {
      wrapper,
    });

    expect(mockGetFile).toHaveBeenCalledTimes(1);
    expect(mockGetFile).toHaveBeenCalledWith(mockUrl, { fetch: mockFetch });
    await waitFor(() => expect(result.current.error).toBe(mockError));
  });
  it("should return inProgress true while fetching", async () => {
    const { result } = renderHook(() => useFile(mockUrl), {
      wrapper,
    });

    expect(mockGetFile).toHaveBeenCalledTimes(1);
    expect(mockGetFile).toHaveBeenCalledWith(mockUrl, { fetch: mockFetch });
    expect(result.current.inProgress).toBe(true);
  });
  it("should exit if url is undefined", async () => {
    const { result } = renderHook(() => useFile(undefined), {
      wrapper,
    });

    expect(mockGetFile).not.toHaveBeenCalled();
    expect(result.current.inProgress).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });
});
