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

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { Value } from "./index";
import { DataType } from "../../helpers";
import { DatasetProvider } from "../../context/datasetContext";
import { ThingProvider } from "../../context/thingContext";

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockNick = "test nick value";

const mockThing = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  mockPredicate,
  mockNick
);

const mockDataset = SolidFns.setThing(SolidFns.createSolidDataset(), mockThing);
const mockDatasetWithResourceInfo = SolidFns.setThing(
  SolidFns.createSolidDataset() as any,
  mockThing
);

// TODO: refactor this once ticket SDK-1157 has been done
mockDatasetWithResourceInfo.internal_resourceInfo = {};
mockDatasetWithResourceInfo.internal_resourceInfo.fetchedFrom =
  "https://some-interesting-value.com";

const inputOptions = {
  name: "test-name",
  type: "url",
};

const savedDataset = SolidFns.createSolidDataset() as any;
jest
  .spyOn(SolidFns, "saveSolidDatasetAt")
  .mockImplementation(() => savedDataset);

describe("<Value /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Value
        dataType="string"
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with data from context", () => {
    const documentBody = render(
      <DatasetProvider solidDataset={mockDatasetWithResourceInfo}>
        <ThingProvider thing={mockThing}>
          <Value dataType="string" property={mockPredicate} edit autosave />
        </ThingProvider>
      </DatasetProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with edit true and inputOptions", () => {
    const documentBody = render(
      <Value
        dataType="string"
        edit
        inputProps={inputOptions}
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<Value /> component functional testing", () => {
  it.each([
    ["string", "getStringNoLocale", "mockString", undefined],
    ["string", "getStringWithLocale", "mockString", "en"],
    ["boolean", "getBoolean", true, undefined],
    ["datetime", "getDatetime", new Date(), undefined],
    ["decimal", "getDecimal", 1.23, undefined],
    ["integer", "getInteger", 100, undefined],
    ["url", "getUrl", "http://mock.url", undefined],
  ])(
    "when dataType is %s, calls %s and sets value",
    (dataType, getter, mockValue, locale) => {
      const mockGetter = jest
        .spyOn(SolidFns, getter as any)
        .mockImplementationOnce(() => mockValue);

      const { getByText } = render(
        <Value
          dataType={dataType as DataType}
          solidDataset={mockDatasetWithResourceInfo}
          thing={mockThing}
          property={mockPredicate}
          locale={locale}
        />
      );

      expect(mockGetter).toHaveBeenCalled();

      const expectedDisplayValue =
        dataType === "datetime"
          ? (mockValue as Date)
              .toISOString()
              .substring(0, (mockValue as Date).toISOString().length - 5)
          : `${mockValue}`;

      expect(getByText(expectedDisplayValue)).toBeDefined();
    }
  );

  it.each([
    [
      "string",
      "getStringNoLocale",
      "setStringNoLocale",
      "mockString",
      undefined,
    ],
    [
      "string",
      "getStringWithLocale",
      "setStringWithLocale",
      "mockString",
      "en",
    ],
    ["boolean", "getBoolean", "setBoolean", true, undefined],
    ["datetime", "getDatetime", "setDatetime", "2020-12-30T12:30", undefined],
    ["decimal", "getDecimal", "setDecimal", 1.23, undefined],
    ["integer", "getInteger", "setInteger", 100, undefined],
    ["url", "getUrl", "setUrl", "http://mock.url", undefined],
  ])(
    "when dataType is %s, should call %s setter on blur",
    (dataType, getter, setter, newValue, locale = "") => {
      jest.spyOn(SolidFns, getter as any).mockImplementationOnce(() => null);

      const mockSetter = jest
        .spyOn(SolidFns, setter as any)
        .mockImplementation(() => mockThing);

      jest
        .spyOn(SolidFns, "saveSolidDatasetAt")
        .mockResolvedValue(savedDataset);

      const { getByTitle } = render(
        <Value
          dataType={dataType as DataType}
          solidDataset={mockDatasetWithResourceInfo}
          thing={mockThing}
          property={mockPredicate}
          locale={locale}
          edit
          autosave
          inputProps={{ title: "test title" }}
        />
      );
      const input = getByTitle("test title");
      input.focus();
      if (dataType === "boolean") {
        fireEvent.click(input);
      } else {
        fireEvent.change(input, { target: { value: newValue } });
      }
      input.blur();
      expect(mockSetter).toHaveBeenCalled();
    }
  );

  it("Should not call setter on blur if the value of the input hasn't changed", async () => {
    jest
      .spyOn(SolidFns, "setStringNoLocale")
      .mockImplementation(() => mockThing);
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    input.blur();
    expect(SolidFns.setStringNoLocale).toHaveBeenCalledTimes(0);
  });

  it("Should not call saveSolidDatasetAt onBlur if autosave is false", async () => {
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
      />
    );
    getByDisplayValue(mockNick).focus();
    getByDisplayValue(mockNick).blur();
    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalledTimes(0);
  });

  it("Should call onSave if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        onSave={onSave}
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it("Should call onSave for fetched dataset with custom location if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onSave={onSave}
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it("Should call onError if saving fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it("Should call onError if saving fetched dataset to custom location fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it("Should call onError if trying to save a non-fetched dataset without saveDatasetTo", async () => {
    const mockUnfetchedDataset = SolidFns.setThing(
      SolidFns.createSolidDataset(),
      mockThing
    );

    const onError = jest.fn();
    const { getByDisplayValue } = render(
      <Value
        dataType="string"
        solidDataset={mockUnfetchedDataset}
        thing={mockThing}
        property={mockPredicate}
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
