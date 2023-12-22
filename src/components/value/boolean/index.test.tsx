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

import { jest, it, describe, expect, beforeEach } from "@jest/globals";

import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SolidFns from "@inrupt/solid-client";
import * as SolidClient from "@inrupt/solid-client";

import * as helpers from "../../../helpers";
import BooleanValue from ".";

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

const mockDatasetFromWithChangelog = (url: string) =>
  SolidFns.mockSolidDatasetFrom(url) as SolidClient.SolidDataset &
    SolidClient.WithServerResourceInfo &
    // Pretend we have a changelog, even though we don't, as it's irrelevant to these tests.
    SolidClient.WithChangeLog;

const mockPredicate = `http://some.vocabulary/isTrue`;
const mockBoolean = '"true"^^xsd:boolean';

const defaultMockedThing = () =>
  SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    mockPredicate,
    mockBoolean,
  );

const defaultMockDataset = () =>
  SolidFns.setThing(
    SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
    defaultMockedThing(),
  );
const defaultMockedDatasetWithResourceInfo = () =>
  SolidFns.setThing(
    SolidFns.mockContainerFrom("https://some-interesting-value.com/"),
    defaultMockedThing(),
  );

const savedDataset = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://example.pod/resource"),
  SolidFns.createThing(),
);

const mockValue = true;

describe("<BooleanValue /> component functional testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("calls getBoolean and sets value", () => {
    const mockedThing = SolidClient.setBoolean(
      SolidClient.createThing(),
      mockPredicate,
      true,
    );

    const mockedDataset = SolidClient.setThing(
      SolidClient.createSolidDataset(),
      mockedThing,
    );

    jest.spyOn(SolidFns, "getBoolean");

    const { getByText } = render(
      <BooleanValue
        solidDataset={mockedDataset}
        thing={mockedThing}
        property={mockPredicate}
      />,
    );

    expect(SolidFns.getBoolean).toHaveBeenCalled();

    expect(getByText(mockValue.toString())).toBeDefined();
  });

  it("should call setBoolean on blur", async () => {
    const mockedThing = SolidClient.setBoolean(
      SolidClient.createThing(),
      mockPredicate,
      true,
    );

    const mockedDataset = SolidClient.setThing(
      SolidClient.createSolidDataset(),
      mockedThing,
    );

    // Be careful to call spyOn after the setup is done.
    jest.spyOn(SolidFns, "setBoolean");

    const user = userEvent.setup();
    const { getByTitle } = render(
      <BooleanValue
        solidDataset={mockedDataset}
        thing={mockedThing}
        property={mockPredicate}
        edit
        autosave
        inputProps={{ title: "test title" }}
      />,
    );
    const input = getByTitle("test title");
    input.focus();

    await user.click(input);

    input.blur();
    expect(SolidFns.setBoolean).toHaveBeenCalled();
  });

  it("Should not call setter on blur if the value of the input hasn't changed", async () => {
    const mockedThing = SolidClient.setBoolean(
      SolidClient.createThing(),
      mockPredicate,
      false,
    );

    const mockedDataset = SolidClient.setThing(
      SolidClient.createSolidDataset(),
      mockedThing,
    );

    // Be careful to call spyOn after the setup is done.
    jest.clearAllMocks();

    jest.spyOn(SolidFns, "setBoolean");

    expect(SolidFns.setBoolean).not.toHaveBeenCalled();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={mockedDataset}
        thing={mockedThing}
        property={mockPredicate}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue("false");
    input.focus();
    input.blur();
    expect(SolidFns.setBoolean).not.toHaveBeenCalled();
  });

  it("Should call saveSolidDatasetAt onBlur if autosave is true", async () => {
    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);

    await user.tab();
    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled();
  });

  it("Should not call saveSolidDatasetAt onBlur if autosave is false", async () => {
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        edit
      />,
    );
    getByDisplayValue("false").focus();
    getByDisplayValue("false").blur();
    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalledTimes(0);
  });

  it("Should call onSave if it is passed", async () => {
    const onSave = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        onSave={onSave}
        onError={jest.fn()}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);
    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });

  it("Should call onSave for fetched dataset with custom location if it is passed", async () => {
    const onSave = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onSave={onSave}
        onError={jest.fn()}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);
    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });
  it("Should update context with latest dataset after saving", async () => {
    const setDataset = jest.fn();
    jest.spyOn(helpers, "useProperty").mockReturnValue({
      dataset: defaultMockedDatasetWithResourceInfo(),
      setDataset,
      setThing: jest.fn(),
      error: undefined,
      value: false,
      thing: defaultMockedThing(),
      property: mockPredicate,
    });
    const { getSolidDataset: mockedGet } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    const mockedLatestDataset = mockDatasetFromWithChangelog(
      "https://some.irrelevant.url",
    );
    mockedGet.mockResolvedValueOnce(mockedLatestDataset);

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        edit
        autosave
      />,
    );
    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);
    // blur the input:
    await user.tab();

    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled();
    expect(setDataset).toHaveBeenCalledWith(mockedLatestDataset);
  });
  it("Should call onError if saving fails", async () => {
    const { saveSolidDatasetAt: mockedSaveDataset } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    mockedSaveDataset.mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockDataset()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />,
    );

    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);
    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });

  it("Should call onError if Thing not found", async () => {
    const { saveSolidDatasetAt: mockedSaveDataset } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    mockedSaveDataset.mockRejectedValueOnce(null);
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      dataset: defaultMockedDatasetWithResourceInfo(),
      setDataset: jest.fn(),
      setThing: jest.fn(),
      error: new Error("Thing not found"),
      value: null,
      thing: undefined,
      property: mockPredicate,
    });
    const onError = jest.fn();

    render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={undefined}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
      />,
    );

    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it("Should call onError if saving fetched dataset to custom location fails", async () => {
    const { saveSolidDatasetAt: mockedSaveDataset } = jest.requireMock(
      "@inrupt/solid-client",
    ) as jest.Mocked<typeof SolidClient>;
    mockedSaveDataset.mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={defaultMockedDatasetWithResourceInfo()}
        thing={defaultMockedThing()}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />,
    );

    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);
    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });

  it("Should call onError if trying to save a non-fetched dataset without saveDatasetTo", async () => {
    const mockUnfetchedDataset = SolidFns.setThing(
      SolidFns.createSolidDataset(),
      defaultMockedThing(),
    );

    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByDisplayValue } = render(
      <BooleanValue
        solidDataset={mockUnfetchedDataset}
        thing={defaultMockedThing()}
        property={mockPredicate}
        onError={onError}
        edit
        autosave
      />,
    );

    const input = getByDisplayValue("false");
    input.focus();

    await user.click(input);
    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });
});
