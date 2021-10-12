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

import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import * as SolidFns from "@inrupt/solid-client";
import { it, expect, describe, jest } from "@jest/globals";
import useDataset from "../useDataset";
import ThingContext from "../../context/thingContext";
import useThing from ".";

const mockDatasetIri = "https://mock.url";
const mockThingIri = "https://mock.url#thing";
const mockDataset = SolidFns.mockSolidDatasetFrom(mockDatasetIri);
const mockThing = SolidFns.mockThingFrom(mockThingIri);
const mockContextThing = SolidFns.mockThingFrom(mockThingIri);
const mockGetThing = jest
  .spyOn(SolidFns, "getThing")
  .mockReturnValue(mockThing);

jest.mock("../useDataset");

describe("useThing() hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call useDataset with given dataset iri and options", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      dataset: mockDataset,
      error: undefined,
    });
    const mockOptions = {
      additionalOption: "additional option",
    };
    renderHook(() => useThing(mockDatasetIri, mockThingIri, mockOptions));

    expect(useDataset).toHaveBeenCalledTimes(1);
    expect(useDataset).toHaveBeenCalledWith(mockDatasetIri, mockOptions);
  });

  it("should call getThing with given thing iri, and return retrieved Thing", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      dataset: mockDataset,
      error: undefined,
    });
    const { result, waitFor } = renderHook(() =>
      useThing(mockDatasetIri, mockThingIri)
    );

    expect(mockGetThing).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.thing).toBe(mockThing));
  });

  it("when dataset is undefined, should not call getThing, and return thing: undefined", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      dataset: undefined,
      error: undefined,
    });
    const { result, waitFor } = renderHook(() =>
      useThing(mockDatasetIri, mockThingIri)
    );

    expect(mockGetThing).toHaveBeenCalledTimes(0);
    await waitFor(() => expect(result.current.thing).toBeNull());
  });

  it("should return any error returned by useDataset", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      dataset: mockDataset,
      error: new Error("useDataset error"),
    });
    const { result, waitFor } = renderHook(() =>
      useThing(mockDatasetIri, mockThingIri)
    );

    await waitFor(() =>
      expect(result.current.error.message).toBe("useDataset error")
    );
  });

  it("should attempt to return thing from context if thing uri is not defined", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThingContext.Provider
        value={{
          thing: mockContextThing,
          setThing: () => {},
        }}
      >
        {children}
      </ThingContext.Provider>
    );
    (useDataset as jest.Mock).mockReturnValue({
      dataset: mockDataset,
      error: undefined,
    });
    const { result, waitFor } = renderHook(
      () => useThing(mockDatasetIri, undefined),
      { wrapper }
    );

    expect(mockGetThing).not.toHaveBeenCalled();
    await waitFor(() => expect(result.current.thing).toBe(mockContextThing));
  });
});
