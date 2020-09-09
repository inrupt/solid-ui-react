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
import { waitFor } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import SessionContext from "../../context/sessionContext";
import useDataset from "./index";

describe("useDataset() hook", () => {
  const mockDatasetIri = "https://mock.url";
  const mockDataset = SolidFns.mockSolidDatasetFrom(mockDatasetIri);
  const mockGetSolidDataset = jest
    .spyOn(SolidFns, "getSolidDataset")
    .mockResolvedValue(mockDataset);
  const mockFetch = jest.fn();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionContext.Provider
      value={{
        fetch: mockFetch,
        sessionRequestInProgress: true,
        session: {} as Session,
      }}
    >
      {children}
    </SessionContext.Provider>
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getSolidDataset with given Iri", async () => {
    const { result } = renderHook(() => useDataset(mockDatasetIri), {
      wrapper,
    });

    expect(mockGetSolidDataset).toHaveBeenCalledTimes(1);
    expect(mockGetSolidDataset).toHaveBeenCalledWith(mockDatasetIri, {
      fetch: mockFetch,
    });
    await waitFor(() => expect(result.current.dataset).toBe(mockDataset));
  });

  it("should call getSolidDataset with given options", async () => {
    const newMockFetch = jest.fn();
    const mockAdditionalOption = "additional option";
    const mockOptions = {
      fetch: newMockFetch,
      additionalOption: mockAdditionalOption,
    };

    const { result } = renderHook(
      () => useDataset(mockDatasetIri, mockOptions),
      {
        wrapper,
      }
    );

    expect(mockGetSolidDataset).toHaveBeenCalledTimes(1);
    expect(mockGetSolidDataset).toHaveBeenCalledWith(mockDatasetIri, {
      fetch: newMockFetch,
      additionalOption: mockAdditionalOption,
    });
    await waitFor(() => expect(result.current.dataset).toBe(mockDataset));
  });

  // it("The hook should return values set in the SessionContext", async () => {
  //   interface IProps {
  //     children: React.ReactNode;
  //   }

  // const wrapper = ({ children }: IProps) => (
  //   <SessionContext.Provider
  //     value={{
  //       fetch: jest.fn(),
  //       sessionRequestInProgress: true,
  //       session: {
  //         info: {
  //           webId: "https://solid.community/",
  //           isLoggedIn: true,
  //           sessionId: "some-session-id",
  //         },
  //       } as Session,
  //     }}
  //   >
  //     {children}
  //   </SessionContext.Provider>
  // );

  //   const { result } = renderHook(() => useDataset(), { wrapper });
  //   expect(result.current.session.info.webId).toEqual(
  //     "https://solid.community/"
  //   );
  //   expect(result.current.sessionRequestInProgress).toEqual(true);
  // });
});
