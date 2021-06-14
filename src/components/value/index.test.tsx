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
import { render } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { Value } from "./index";
import * as helpers from "../../helpers";
import { DatasetProvider } from "../../context/datasetContext";
import { ThingProvider } from "../../context/thingContext";

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockNick = "test nick value";

const mockBdayPredicate = "http://www.w3.org/2006/vcard/ns#bday";
const mockBday = new Date("2021-05-04T06:00:00.000Z");

const mockThing = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  mockPredicate,
  mockNick
);

const mockThingWithBday = SolidFns.addDatetime(
  mockThing,
  mockBdayPredicate,
  mockBday
);

const mockDataset = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
  mockThing
);
const mockDatasetWithResourceInfo = SolidFns.setThing(
  SolidFns.createSolidDataset() as any,
  mockThing
);

const inputOptions = {
  name: "test-name",
  type: "url",
};

const mockDatasetWithBdayResourceInfo = SolidFns.setThing(
  SolidFns.createSolidDataset(),
  mockThingWithBday
);

const savedDataset = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://example.pod/resource"),
  SolidFns.createThing()
);
jest.spyOn(SolidFns, "saveSolidDatasetAt").mockResolvedValue(savedDataset);

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

  it("matches snapshot while fetching data", () => {
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      thing: undefined,
      error: undefined,
      value: null,
      setDataset: jest.fn(),
      setThing: jest.fn(),
      property: mockPredicate,
    });
    const documentBody = render(
      <Value dataType="string" property={mockPredicate} />
    );
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
      <Value
        dataType="string"
        property={mockPredicate}
        loadingComponent={() => (
          <span id="custom-loading-component">loading...</span>
        )}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders default error message if there is an error", () => {
    const emptyThing = SolidFns.createThing();
    const documentBody = render(
      <Value
        thing={emptyThing}
        dataType="string"
        property="https://example.com/bad-url"
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders custom error component if passed and there is an error", () => {
    const emptyThing = SolidFns.createThing();
    const documentBody = render(
      <Value
        thing={emptyThing}
        dataType="string"
        property="https://example.com/bad-url"
        errorComponent={({ error }) => (
          <span id="custom-error-component">{error.toString()}</span>
        )}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders 'false' if dataType is boolean instead of error if property not found", () => {
    const emptyThing = SolidFns.createThing();
    const documentBody = render(
      <DatasetProvider solidDataset={mockDatasetWithResourceInfo}>
        <ThingProvider thing={mockThing}>
          <Value
            thing={emptyThing}
            dataType="boolean"
            property="http://xmlns.com/foaf/0.1/name"
          />
        </ThingProvider>
      </DatasetProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders error if dataType is boolean and there is an error fetching the thing", () => {
    const documentBody = render(
      <Value
        thing={undefined}
        dataType="boolean"
        property="http://xmlns.com/foaf/0.1/name"
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

  it("matches snapshot with dataType datetime when browser supports datetime-local", () => {
    const { asFragment } = render(
      <Value
        dataType="datetime"
        edit
        solidDataset={mockDatasetWithBdayResourceInfo}
        thing={mockThingWithBday}
        property={mockBdayPredicate}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it.each([["string"], ["boolean"], ["decimal"], ["integer"], ["url"]])(
    "matches snapshot with dataType %i",
    (dataType) => {
      const { asFragment } = render(
        <Value
          dataType={dataType as helpers.DataType}
          edit
          solidDataset={mockDataset}
          thing={mockThing}
          property={mockPredicate}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    }
  );

  it("matches snapshot with dataType datetime when browser does not support datetime-local", () => {
    jest.spyOn(helpers, "useDatetimeBrowserSupport").mockReturnValueOnce(false);
    const { asFragment } = render(
      <Value
        dataType="datetime"
        edit
        solidDataset={mockDatasetWithBdayResourceInfo}
        thing={mockThingWithBday}
        property={mockBdayPredicate}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
