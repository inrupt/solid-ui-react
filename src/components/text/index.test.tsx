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
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorBoundary } from "react-error-boundary";
import * as SolidFns from "@inrupt/solid-client";
import * as helpers from "../../helpers";
import { Text } from "./index";
import { DatasetProvider } from "../../context/datasetContext";
import { ThingProvider } from "../../context/thingContext";

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockNick = "test nick value";

const mockThing = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  mockPredicate,
  mockNick
);

const mockDataset = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
  mockThing
);
const mockDatasetWithResourceInfo = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
  mockThing
);

const inputOptions = {
  name: "test-name",
  type: "url",
};

const savedDataset = SolidFns.createSolidDataset() as any;
const latestDataset = SolidFns.createSolidDataset() as any;

jest
  .spyOn(SolidFns, "saveSolidDatasetAt")
  .mockImplementation(() => savedDataset);

describe("<Text /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Text
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
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
  it("matches snapshot while fetching data", () => {
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      thing: undefined,
      error: undefined,
      value: null,
      setDataset: jest.fn(),
      setThing: jest.fn(),
      property: mockPredicate,
    });
    const documentBody = render(<Text property={mockPredicate} />);
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders loading component if passed while fetching data", () => {
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      thing: undefined,
      error: undefined,
      value: null,
      setDataset: jest.fn(),
      setThing: jest.fn(),
      property: mockPredicate,
    });
    const documentBody = render(
      <Text
        property={mockPredicate}
        loadingComponent={() => (
          <span id="custom-loading-component">loading...</span>
        )}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("does not render default loading message if loadingComponent is null", () => {
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      thing: undefined,
      error: undefined,
      value: null,
      setDataset: jest.fn(),
      setThing: jest.fn(),
      property: mockPredicate,
    });
    const documentBody = render(
      <Text property={mockPredicate} loadingComponent={null} />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders default error message if there is an error", () => {
    const emptyThing = SolidFns.createThing();
    const documentBody = render(
      <Text thing={emptyThing} property="https://example.com/bad-url" />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders custom error component if passed and there is an error", () => {
    const emptyThing = SolidFns.createThing();
    const documentBody = render(
      <Text
        thing={emptyThing}
        property="https://example.com/bad-url"
        errorComponent={({ error }) => (
          <span id="custom-error-component">{error.toString()}</span>
        )}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<Text /> component functional testing", () => {
  it("Should call getStringNoLocale function if no locale is passed", async () => {
    jest
      .spyOn(SolidFns, "getStringNoLocale")
      .mockImplementation(() => mockNick);
    const { getByText } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );
    expect(SolidFns.getStringNoLocale).toHaveBeenCalled();
    expect(getByText(mockNick)).toBeDefined();
  });

  it("Should call getStringWithLocale function if locale is passed", async () => {
    jest
      .spyOn(SolidFns, "getStringWithLocale")
      .mockImplementation(() => mockNick);
    const { getByText } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        autosave
      />
    );
    expect(SolidFns.getStringWithLocale).toHaveBeenCalled();
    expect(getByText(mockNick)).toBeDefined();
  });

  it("Should call setStringNoLocale onBlur if no locale is set", async () => {
    jest
      .spyOn(SolidFns, "setStringNoLocale")
      .mockImplementation(() => mockThing);
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(SolidFns.setStringNoLocale).toHaveBeenCalled();
  });

  it("Should call setStringWithLocale onBlur if locale is set", async () => {
    jest
      .spyOn(SolidFns, "setStringWithLocale")
      .mockImplementation(() => mockThing);
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(SolidFns.setStringWithLocale).toHaveBeenCalled();
  });

  it("Should not call setString onBlur if the value of the input hasn't changed", async () => {
    jest
      .spyOn(SolidFns, "setStringWithLocale")
      .mockImplementation(() => mockThing);

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "u{Backspace}");
    // blur the input:
    await user.tab();

    expect(SolidFns.setStringWithLocale).toHaveBeenCalledTimes(0);
  });

  it("Should not call saveSolidDatasetAt onBlur if autosave is false", async () => {
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
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
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    jest.spyOn(SolidFns, "getSolidDataset").mockResolvedValue(latestDataset);

    const user = userEvent.setup();

    const { getByDisplayValue } = render(
      <Text
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

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });

  it("Should call onSave for fetched dataset with custom location if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    jest.spyOn(SolidFns, "getSolidDataset").mockResolvedValue(latestDataset);

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
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

    await user.type(input, "updated nick value");

    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });

  it("Should call onError if saving fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
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

    await user.type(input, "updated nick value");

    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });

  it("Should call onError if saving fetched dataset to custom location fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
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

    await user.type(input, "updated nick value");

    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });

  it("Should throw error if SaveDatasetTo is missing for new data", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const user = userEvent.setup();
    const { getByText, getByDisplayValue } = render(
      <ErrorBoundary
        fallbackRender={({ error }) => <div>{JSON.stringify(error)}</div>}
      >
        <Text
          solidDataset={SolidFns.createSolidDataset()}
          thing={mockThing}
          property={mockPredicate}
          edit
          autosave
        />
      </ErrorBoundary>
    );

    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");

    // blur the input:
    await user.tab();

    expect(getByText("{}")).toBeDefined();
    // eslint-disable-next-line no-console
    (console.error as jest.Mock).mockRestore();
  });
  it("Should update context with latest dataset after saving", async () => {
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    jest.spyOn(SolidFns, "getSolidDataset").mockResolvedValue(latestDataset);
    const setDataset = jest.fn();
    const setThing = jest.fn();
    jest.spyOn(helpers, "useProperty").mockReturnValue({
      dataset: mockDataset,
      setDataset,
      setThing,
      error: undefined,
      value: mockNick,
      thing: mockThing,
      property: mockPredicate,
    });

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled();
    expect(setDataset).toHaveBeenCalledWith(latestDataset);
  });
});
