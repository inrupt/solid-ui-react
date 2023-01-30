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

import SolidFns from "@inrupt/solid-client";
import * as helpers from "../../../helpers";
import DatetimeValue from ".";

const mockPredicate = "http://www.w3.org/2006/vcard/ns#bday";
const mockBday = new Date("2021-05-04T06:00:00.000Z");
const testBday = new Date("2007-08-14T11:20:00.000Z");

const mockThing = SolidFns.addDatetime(
  SolidFns.createThing(),
  mockPredicate,
  mockBday
);

const mockDataset = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
  mockThing
);
const mockDatasetWithResourceInfo = SolidFns.setThing(
  SolidFns.mockContainerFrom("https://some-interesting-value.com/"),
  mockThing
);

const savedDataset = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://example.pod/resource"),
  SolidFns.createThing()
);
const latestDataset = SolidFns.setThing(savedDataset, SolidFns.createThing());

jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
jest.spyOn(SolidFns, "getSolidDataset").mockResolvedValue(latestDataset);

describe("<DatetimeValue /> component functional testing", () => {
  beforeEach(() => {
    jest.spyOn(helpers, "useDatetimeBrowserSupport").mockReturnValue(true);
  });
  it("calls getDatetime and sets value", () => {
    const mockGetter = jest
      .spyOn(SolidFns, "getDatetime" as any)
      .mockImplementationOnce(() => mockBday);

    const { getByText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
      />
    );

    expect(mockGetter).toHaveBeenCalled();

    expect(getByText("2021-05-04T06:00:00")).toBeDefined();
  });

  it("should call setDatetime on blur", async () => {
    jest
      .spyOn(SolidFns, "setDatetime" as any)
      .mockImplementationOnce(() => null);

    const mockSetter = jest
      .spyOn(SolidFns, "setDatetime" as any)
      .mockImplementation(() => mockThing);

    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

    const user = userEvent.setup();
    const { getByTitle } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
        inputProps={{ title: "test title" }}
      />
    );

    const input = getByTitle("test title");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(mockSetter).toHaveBeenCalled();
  });
  it("Should not call setter on blur if the value of the input hasn't changed", async () => {
    jest.spyOn(SolidFns, "setDatetime").mockImplementation(() => mockThing);
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );
    const input = getByLabelText("Date and Time");
    input.focus();
    input.blur();
    expect(SolidFns.setDatetime).toHaveBeenCalledTimes(0);
  });
  it("Should not call saveSolidDatasetAt onBlur if autosave is false", async () => {
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
      />
    );

    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalledTimes(0);
  });

  it("Should call saveSolidDatasetAt onBlur if autosave is true", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );

    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled();
  });

  it("Should call onSave if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        onSave={onSave}
        onError={onError}
        edit
        autosave
      />
    );

    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });
  it("Should call onSave for fetched dataset with custom location if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
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

    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(onSave).toHaveBeenCalled();
  });
  it("Should call onError if saving fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDataset}
        thing={mockThing}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });
  it("Should call onError if Thing not found", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();
    render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={undefined}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
      />
    );
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
  it("Should call onError if saving fetched dataset to custom location fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        saveDatasetTo="https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
        onError={onError}
        edit
        autosave
      />
    );

    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });
  it("Should call onError if trying to save a non-fetched dataset without saveDatasetTo", async () => {
    const mockUnfetchedDataset = SolidFns.setThing(
      SolidFns.createSolidDataset(),
      mockThing
    );

    const onError = jest.fn();

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockUnfetchedDataset}
        thing={mockThing}
        property={mockPredicate}
        onError={onError}
        edit
        autosave
      />
    );
    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, testBday.toISOString());
    // blur the input:
    await user.tab();

    expect(onError).toHaveBeenCalled();
  });
  it("when datetime-local is unsupported, it calls setDatetime with the correct value", async () => {
    const expectedDate = new Date(Date.UTC(2020, 2, 3, 0, 0, 0));
    const expectedDateAndTime = new Date(Date.UTC(2020, 2, 3, 5, 45, 0));

    jest.spyOn(helpers, "useDatetimeBrowserSupport").mockReturnValue(false);
    jest.spyOn(SolidFns, "getDatetime").mockImplementationOnce(() => null);
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
    jest.spyOn(SolidFns, "getSolidDataset").mockResolvedValue(latestDataset);

    const mockSetter = jest.spyOn(SolidFns, "setDatetime");

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );

    const dateInput = getByLabelText("Date");
    dateInput.focus();

    await user.type(dateInput, "2020-03-03");

    dateInput.blur();

    const timeInput = getByLabelText("Time");
    timeInput.focus();

    await user.type(timeInput, "05:45");

    timeInput.blur();

    expect(mockSetter.mock.calls).toEqual([
      [mockThing, mockPredicate, expectedDate],
      [mockThing, mockPredicate, expectedDateAndTime],
    ]);
  });
  it("Should update context with latest dataset after saving", async () => {
    const setDataset = jest.fn();
    const setThing = jest.fn();
    jest.spyOn(helpers, "useProperty").mockReturnValue({
      dataset: mockDatasetWithResourceInfo,
      setDataset,
      setThing,
      error: undefined,
      value: mockBday,
      thing: mockThing,
      property: mockPredicate,
    });

    const user = userEvent.setup();
    const { getByLabelText } = render(
      <DatetimeValue
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
        property={mockPredicate}
        edit
        autosave
      />
    );
    const input = getByLabelText("Date and Time");
    input.focus();

    await user.type(input, "2007-08-14T11:20:00");
    // blur the input:
    await user.tab();

    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled();
    expect(setDataset).toHaveBeenCalledWith(latestDataset);
  });
});
