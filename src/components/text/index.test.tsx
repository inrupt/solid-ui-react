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
import { ErrorBoundary } from "react-error-boundary";
import * as SolidFns from "@inrupt/solid-client";
import Text from "./index";
import { DatasetProvider } from "../../context/datasetContext";
import { ThingProvider } from "../../context/thingContext";

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockNick = "test nick value";

const mockThing = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  mockPredicate,
  mockNick
);

const mockDataSet = SolidFns.setThing(SolidFns.createLitDataset(), mockThing);
const mockDataSetWithResourceInfo = SolidFns.setThing(
  SolidFns.createLitDataset() as any,
  mockThing
);

// TODO: refactor this once ticket SDK-1157 has been done
mockDataSetWithResourceInfo.internal_resourceInfo = {};
mockDataSetWithResourceInfo.internal_resourceInfo.fetchedFrom =
  "https://some-interesting-value.com";

const inputOptions = {
  name: "test-name",
  type: "url",
};

const savedDataSet = SolidFns.createLitDataset() as any;
jest
  .spyOn(SolidFns, "saveSolidDatasetAt")
  .mockImplementation(() => savedDataSet);

describe("<Text /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with data from context", () => {
    const documentBody = render(
      <DatasetProvider dataset={mockDataSetWithResourceInfo}>
        <ThingProvider thing={mockThing}>
          <Text property={mockPredicate} edit autosave />
        </ThingProvider>
      </DatasetProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with edit true and inputOptions", () => {
    const documentBody = render(
      <Text
        edit
        inputProps={inputOptions}
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<Text /> component functional testing", () => {
  it("Should call getStringUnlocalizedOne function if no locale is passed", async () => {
    jest
      .spyOn(SolidFns, "getStringUnlocalizedOne")
      .mockImplementation(() => mockNick);
    const { getByText } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    expect(SolidFns.getStringUnlocalizedOne).toHaveBeenCalled();
    expect(getByText(mockNick)).toBeDefined();
  });

  it("Should call getStringInLocaleOne function if locale is passed", async () => {
    jest
      .spyOn(SolidFns, "getStringInLocaleOne")
      .mockImplementation(() => mockNick);
    const { getByText } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        autosave
      />
    );
    expect(SolidFns.getStringInLocaleOne).toHaveBeenCalled();
    expect(getByText(mockNick)).toBeDefined();
  });

  it("Should call setStringUnlocalized onBlur if no locale is set", async () => {
    jest
      .spyOn(SolidFns, "setStringUnlocalized")
      .mockImplementation(() => mockThing);
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataSet);
    const { getByDisplayValue } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    expect(SolidFns.setStringUnlocalized).toHaveBeenCalled();
  });

  it("Should call setStringInLocale onBlur if locale is set", async () => {
    jest
      .spyOn(SolidFns, "setStringInLocale")
      .mockImplementation(() => mockThing);
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataSet);
    const { getByDisplayValue } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    expect(SolidFns.setStringInLocale).toHaveBeenCalled();
  });

  it("Should not call setString onBlur if the value of the input hasn't changed", async () => {
    jest
      .spyOn(SolidFns, "setStringInLocale")
      .mockImplementation(() => mockThing);
    const { getByDisplayValue } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();
    input.blur();
    expect(SolidFns.setStringInLocale).toHaveBeenCalledTimes(0);
  });

  it("Should not call saveSolidDatasetAt onBlur if autosave is false", async () => {
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataSet);
    const { getByDisplayValue } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
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
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataSet);
    const { getByDisplayValue } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
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
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataSet);
    const { getByDisplayValue } = render(
      <Text
        dataSet={mockDataSetWithResourceInfo}
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
      <Text
        dataSet={mockDataSet}
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
      <Text
        dataSet={mockDataSetWithResourceInfo}
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

  it("Should throw error if saving data fails and on OnError is passed", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(
      "Saving data failed"
    );
    const { getByText, getByDisplayValue } = render(
      <ErrorBoundary fallbackRender={({ error }) => <div>{error}</div>}>
        <Text
          dataSet={mockDataSetWithResourceInfo}
          thing={mockThing}
          property={mockPredicate}
          edit
          autosave
        />
      </ErrorBoundary>
    );

    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(getByText("Saving data failed")).toBeDefined());
    // eslint-disable-next-line no-console
    (console.error as jest.Mock).mockRestore();
  });

  it("Should throw error if SaveDatasetTo is missing for new data", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { getByText, getByDisplayValue } = render(
      <ErrorBoundary
        fallbackRender={({ error }) => <div>{JSON.stringify(error)}</div>}
      >
        <Text
          dataSet={mockDataSet}
          thing={mockThing}
          property={mockPredicate}
          edit
          autosave
        />
      </ErrorBoundary>
    );

    const input = getByDisplayValue(mockNick);
    input.focus();
    fireEvent.change(input, { target: { value: "updated nick value" } });
    input.blur();
    await waitFor(() => expect(getByText("{}")).toBeDefined());
    // eslint-disable-next-line no-console
    (console.error as jest.Mock).mockRestore();
  });
});
