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
import { fireEvent, render, waitFor } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import * as helpers from "../../../helpers";
import DatetimeValue from "./index";

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

const savedDataset = SolidFns.createSolidDataset() as any;
jest
  .spyOn(SolidFns, "saveSolidDatasetAt")
  .mockImplementation(() => savedDataset);

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
  it("should call setDatetime on blur", () => {
    jest
      .spyOn(SolidFns, "setDatetime" as any)
      .mockImplementationOnce(() => null);

    const mockSetter = jest
      .spyOn(SolidFns, "setDatetime" as any)
      .mockImplementation(() => mockThing);

    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalledTimes(0);
  });

  it("Should call saveSolidDatasetAt onBlur if autosave is true", async () => {
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    await waitFor(() => expect(SolidFns.saveSolidDatasetAt).toHaveBeenCalled());
  });

  it("Should call onSave if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });
  it("Should call onSave for fetched dataset with custom location if it is passed", async () => {
    const onSave = jest.fn();
    const onError = jest.fn();
    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });
  it("Should call onError if saving fails", async () => {
    (SolidFns.saveSolidDatasetAt as jest.Mock).mockRejectedValueOnce(null);
    const onError = jest.fn();
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    await waitFor(() => expect(onError).toHaveBeenCalled());
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
  it("Should call onError if trying to save a non-fetched dataset without saveDatasetTo", async () => {
    const mockUnfetchedDataset = SolidFns.setThing(
      SolidFns.createSolidDataset(),
      mockThing
    );

    const onError = jest.fn();
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
    fireEvent.change(input, { target: { value: testBday } });
    input.blur();
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
  it("when datetime-local is unsupported, it calls setDatetime with the correct value", () => {
    jest.spyOn(helpers, "useDatetimeBrowserSupport").mockReturnValue(false);

    jest.spyOn(SolidFns, "getDatetime").mockImplementationOnce(() => null);

    const mockSetter = jest.spyOn(SolidFns, "setDatetime");

    jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

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
    fireEvent.change(dateInput, { target: { value: "2020-03-03" } });
    dateInput.blur();
    const timeInput = getByLabelText("Time");
    timeInput.focus();
    fireEvent.change(timeInput, { target: { value: "05:45" } });
    timeInput.blur();
    const expectedDate = new Date(Date.UTC(2020, 2, 3, 0, 0, 0));
    const expectedDateAndTime = new Date(Date.UTC(2020, 2, 3, 5, 45, 0));
    expect(mockSetter.mock.calls).toEqual([
      [mockThing, mockPredicate, expectedDate],
      [mockThing, mockPredicate, expectedDateAndTime],
    ]);
  });
});
