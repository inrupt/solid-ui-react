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

import { jest, it, describe, expect } from "@jest/globals";
import * as React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorBoundary } from "react-error-boundary";
import SolidFns from "@inrupt/solid-client";
import type * as SolidClient from "@inrupt/solid-client";
import * as helpers from "../../helpers";
import { Text } from ".";
import { DatasetProvider } from "../../context/datasetContext";
import { ThingProvider } from "../../context/thingContext";

const mockDatasetFromWithChangelog = (url: string) =>
  SolidFns.mockSolidDatasetFrom(url) as SolidClient.SolidDataset &
    SolidClient.WithServerResourceInfo &
    // Pretend we have a changelog, even though we don't, as it's irrelevant to these tests.
    SolidClient.WithChangeLog;

jest.mock("@inrupt/solid-client", () => {
  const solidClient = jest.requireActual(
    "@inrupt/solid-client",
  ) as typeof SolidClient;
  return {
    ...solidClient,
    // Set a default mocked value for saveSolidDatasset, that may be overriden at the test scope.
    saveSolidDatasetAt: jest
      .fn<(typeof SolidClient)["saveSolidDatasetAt"]>()
      .mockResolvedValue(
        solidClient.mockSolidDatasetFrom(
          "https://some-interesting-value.com",
        ) as Awaited<ReturnType<typeof solidClient.saveSolidDatasetAt>>,
      ),
    getSolidDataset: jest
      .fn<(typeof SolidClient)["getSolidDataset"]>()
      .mockResolvedValue(
        solidClient.mockSolidDatasetFrom(
          "https://some-interesting-value.com",
        ) as Awaited<ReturnType<typeof solidClient.getSolidDataset>>,
      ),
  };
});

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockNick = "test nick value";

const defaultMockedThing = () =>
  SolidFns.addStringNoLocale(SolidFns.createThing(), mockPredicate, mockNick);

const defaultMockedDataset = () =>
  SolidFns.setThing(
    SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
    defaultMockedThing(),
  );

const defaultmockedDatasetWithResourceInfo = () =>
  SolidFns.setThing(
    SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
    defaultMockedThing(),
  );

const inputOptions = {
  name: "test-name",
  type: "url",
};

describe("<Text /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Text
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
      />,
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with data from context", () => {
    const documentBody = render(
      <DatasetProvider solidDataset={defaultmockedDatasetWithResourceInfo()}>
        <ThingProvider thing={defaultMockedThing()}>
          <Text property={mockPredicate} edit autosave />
        </ThingProvider>
      </DatasetProvider>,
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with edit true and inputOptions", () => {
    const documentBody = render(
      <Text
        edit
        inputProps={inputOptions}
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
      />,
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
      />,
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
      <Text property={mockPredicate} loadingComponent={null} />,
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders default error message if there is an error", () => {
    const emptyThing = SolidFns.createThing();
    const documentBody = render(
      <Text thing={emptyThing} property="https://example.com/bad-url" />,
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
      />,
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<Text /> component functional testing", () => {
  it("Should call getStringNoLocale function if no locale is passed", async () => {
    const mockThing = SolidFns.addStringNoLocale(
      SolidFns.createThing(),
      mockPredicate,
      mockNick,
    );

    const mockDataset = SolidFns.setThing(
      SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
      mockThing,
    );

    jest.spyOn(SolidFns, "getStringNoLocale");

    const { getByText } = render(
      <Text
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
      />,
    );
    expect(SolidFns.getStringNoLocale).toHaveBeenCalled();
    expect(getByText(mockNick)).toBeDefined();
  });

  it("Should call getStringWithLocale function if locale is passed", async () => {
    const mockThing = SolidFns.addStringWithLocale(
      SolidFns.createThing(),
      mockPredicate,
      mockNick,
      "en",
    );

    const mockDataset = SolidFns.setThing(
      SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
      mockThing,
    );

    jest.spyOn(SolidFns, "getStringWithLocale");

    const { getByText } = render(
      <Text
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        autosave
      />,
    );
    expect(SolidFns.getStringWithLocale).toHaveBeenCalled();
    expect(getByText(mockNick)).toBeDefined();
  });

  it("Should call setStringNoLocale onBlur if no locale is set", async () => {
    const mockThing = SolidFns.addStringNoLocale(
      SolidFns.createThing(),
      mockPredicate,
      mockNick,
    );

    const mockDataset = SolidFns.setThing(
      SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
      mockThing,
    );

    jest.spyOn(SolidFns, "setStringNoLocale");

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(SolidFns.setStringNoLocale).toHaveBeenCalled();
  });

  it("Should call setStringWithLocale onBlur if locale is set", async () => {
    const mockThing = SolidFns.addStringWithLocale(
      SolidFns.createThing(),
      mockPredicate,
      mockNick,
      "en",
    );

    const mockDataset = SolidFns.setThing(
      SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
      mockThing,
    );

    jest.spyOn(SolidFns, "setStringWithLocale");

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />,
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(SolidFns.setStringWithLocale).toHaveBeenCalled();
  });

  it("Should not call setString onBlur if the value of the input hasn't changed", async () => {
    const mockThing = SolidFns.addStringWithLocale(
      SolidFns.createThing(),
      mockPredicate,
      mockNick,
      "en",
    );

    const mockDataset = SolidFns.setThing(
      SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
      mockThing,
    );

    jest.spyOn(SolidFns, "setStringWithLocale");

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />,
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "u{Backspace}");
    // blur the input:
    await user.tab();

    expect(SolidFns.setStringWithLocale).not.toHaveBeenCalled();
  });

  it("Should not call saveSolidDatasetAt onBlur if autosave is false", async () => {
    const mockThing = SolidFns.addStringWithLocale(
      SolidFns.createThing(),
      mockPredicate,
      mockNick,
      "en",
    );

    const mockDataset = SolidFns.setThing(
      SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
      mockThing,
    );

    jest.spyOn(SolidFns, "saveSolidDatasetAt");
    const { getByDisplayValue } = render(
      <Text
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        locale="en"
        edit
      />,
    );
    getByDisplayValue(mockNick).focus();
    getByDisplayValue(mockNick).blur();
    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalledTimes(0);
  });

  it("Should call onSave if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();

    const user = userEvent.setup();

    const { getByDisplayValue } = render(
      <Text
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        onSave={onSave}
        onError={onError}
        edit
        autosave
      />,
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

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onSave={onSave}
        onError={onError}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");

    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });

  it("Should call onError if saving fails", async () => {
    const { saveSolidDatasetAt: mockedSaveDataset } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    mockedSaveDataset.mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");

    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });

  it("Should call onError if saving fetched dataset to custom location fails", async () => {
    const { saveSolidDatasetAt: mockedSaveDataset } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    mockedSaveDataset.mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />,
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
          thing={defaultMockedThing()}
          property={mockPredicate}
          edit
          autosave
        />
      </ErrorBoundary>,
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
    const { getSolidDataset: mockedGet } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    const mockedLatestDataset = mockDatasetFromWithChangelog(
      "https://some.irrelevant.url",
    );
    mockedGet.mockResolvedValueOnce(mockedLatestDataset);
    const setDataset = jest.fn();
    const setThing = jest.fn();
    jest.spyOn(helpers, "useProperty").mockReturnValue({
      dataset: defaultMockedDataset(),
      setDataset,
      setThing,
      error: undefined,
      value: mockNick,
      thing: defaultMockedThing(),
      property: mockPredicate,
    });

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <Text
        solidDataset={defaultmockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        locale="en"
        edit
        autosave
      />,
    );
    const input = getByDisplayValue(mockNick);
    input.focus();

    await user.type(input, "updated nick value");
    // blur the input:
    await user.tab();

    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled();
    expect(setDataset).toHaveBeenCalledWith(mockedLatestDataset);
  });
});
