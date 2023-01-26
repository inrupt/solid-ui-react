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
import { RenderResult, render, waitFor } from "@testing-library/react";
import SolidFns from "@inrupt/solid-client";
import useDataset from "../../hooks/useDataset";
import DatasetContext, { DatasetProvider } from ".";

jest.mock("../../hooks/useDataset");

let documentBody: RenderResult;

const mockUrl = "https://some-interesting-value.com";
const mockThingUrl = "https://some-interesting-value.com#thing";
const mockPredicate = "http://xmlns.com/foaf/0.1/nick";
const mockNick = "test nick value";

let mockDatasetWithResourceInfo = SolidFns.mockSolidDatasetFrom(mockUrl);
let mockThing = SolidFns.mockThingFrom(mockThingUrl);
mockThing = SolidFns.addStringNoLocale(mockThing, mockPredicate, mockNick);
mockDatasetWithResourceInfo = SolidFns.setThing(
  mockDatasetWithResourceInfo,
  mockThing
);

function ExampleComponentWithDataset(): React.ReactElement {
  const [exampleThing, setExampleThing] = React.useState<SolidFns.Thing>();
  const [property, setProperty] = React.useState<string>(
    "fetching in progress"
  );

  const datasetContext = React.useContext(DatasetContext);
  const { solidDataset } = datasetContext;

  React.useEffect(() => {
    if (solidDataset) {
      const things = SolidFns.getThingAll(solidDataset);
      setExampleThing(things[0]);
    }
  }, [solidDataset]);

  React.useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringNoLocale(
        exampleThing,
        mockPredicate
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [exampleThing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

function ExampleComponentWithDatasetUrl(): React.ReactElement {
  const [exampleThing, setExampleThing] =
    React.useState<SolidFns.Thing | null>();

  const [property, setProperty] = React.useState<string>();

  const datasetContext = React.useContext(DatasetContext);
  const { solidDataset } = datasetContext;

  React.useEffect(() => {
    if (solidDataset) {
      const thing = SolidFns.getThing(solidDataset, mockUrl);
      setExampleThing(thing);
    }
  }, [solidDataset]);

  React.useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringNoLocale(
        exampleThing,
        mockPredicate
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [exampleThing]);

  return (
    <div>
      {property && <h2>{property}</h2>}
      {!property && <h2>Failed to fetch property</h2>}
    </div>
  );
}

describe("Testing DatasetContext", () => {
  it("matches snapshot with Dataset provided", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: undefined,
    });

    const { baseElement, getByText } = render(
      <DatasetProvider solidDataset={mockDatasetWithResourceInfo}>
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );

    await waitFor(() => expect(getByText("test nick value")).toBeDefined());

    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot when fetching fails", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: "Error",
    });

    documentBody = render(
      <DatasetProvider datasetUrl="https://some-broken-resource.com">
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot when fetching", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: undefined,
    });
    documentBody = render(
      <DatasetProvider datasetUrl="https://some-broken-resource.com">
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot when fetching and loadingComponent is passed", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: undefined,
    });
    documentBody = render(
      <DatasetProvider
        datasetUrl="https://some-broken-resource.com"
        loadingComponent={() => <span>loading component</span>}
      >
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot when fetching and loading is passed", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: undefined,
    });
    documentBody = render(
      <DatasetProvider
        datasetUrl="https://some-broken-resource.com"
        loading={<span>loading</span>}
      >
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
  it("matches snapshot when loadingComponent is null", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: undefined,
    });
    documentBody = render(
      <DatasetProvider
        datasetUrl="https://some-broken-resource.com"
        loadingComponent={null}
      >
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );

    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("Functional testing", () => {
  it("Should call useDataset", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: mockDatasetWithResourceInfo,
      error: undefined,
    });

    render(
      <DatasetProvider datasetUrl={mockUrl}>
        <ExampleComponentWithDatasetUrl />
      </DatasetProvider>
    );
    expect(useDataset).toHaveBeenCalled();
  });
  it("When useDataset return an error, should call onError if passed", async () => {
    (useDataset as jest.Mock).mockReturnValue({
      solidDataset: undefined,
      error: "Error",
    });
    const onError = jest.fn();
    render(
      <DatasetProvider
        onError={onError}
        datasetUrl="https://some-broken-value.com"
      >
        <ExampleComponentWithDatasetUrl />
      </DatasetProvider>
    );
    await waitFor(() => expect(onError).toHaveBeenCalledWith("Error"));
  });
});
