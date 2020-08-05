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

import * as React from "react";
import { RenderResult, render, waitFor } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { DatasetProvider, DatasetContext } from "./index";

let documentBody: RenderResult;

const mockUrl = "https://some-interesting-value.com";
const mockPredicate = "http://xmlns.com/foaf/0.1/nick";
const mockNick = "test nick value";

const mockThing = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  mockPredicate,
  mockNick
);

// const mockDataSet = SolidFns.setThing(SolidFns.createLitDataset(), mockThing);
const mockDataSetWithResourceInfo = SolidFns.setThing(
  SolidFns.createLitDataset() as any,
  mockThing
);

// TODO: refactor this once ticket SDK-1157 has been done
mockDataSetWithResourceInfo.internal_resourceInfo = {};
mockDataSetWithResourceInfo.internal_resourceInfo.fetchedFrom =
  "https://some-interesting-value.com";

function ExampleComponentWithDataset(): React.ReactElement {
  const [exampleThing, setExampleThing] = React.useState<SolidFns.Thing>();
  const [property, setProperty] = React.useState<string>(
    "fetching in progress"
  );

  const datasetContext = React.useContext(DatasetContext);
  const { dataset } = datasetContext;

  React.useEffect(() => {
    if (dataset) {
      const things = SolidFns.getThingAll(dataset);
      setExampleThing(things[0]);
    }
  }, [dataset]);

  React.useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
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
  const [exampleThing, setExampleThing] = React.useState<SolidFns.Thing>();
  const [property, setProperty] = React.useState<string>(
    "fetching in progress"
  );

  const datasetContext = React.useContext(DatasetContext);
  const { dataset } = datasetContext;

  React.useEffect(() => {
    if (dataset) {
      const thing = SolidFns.getThingOne(dataset, mockUrl);
      setExampleThing(thing);
    }
  }, [dataset]);

  React.useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
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

describe("Testing ThingContext matches snapshot", () => {
  it("matches snapshot with thing provided", () => {
    documentBody = render(
      <DatasetProvider dataset={mockDataSetWithResourceInfo}>
        <ExampleComponentWithDataset />
      </DatasetProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("Functional testing", () => {
  it("Should call fetchLitDataset", async () => {
    jest
      .spyOn(SolidFns, "fetchLitDataset")
      .mockResolvedValue(mockDataSetWithResourceInfo);

    render(
      <DatasetProvider datasetUrl={mockUrl}>
        <ExampleComponentWithDatasetUrl />
      </DatasetProvider>
    );
    expect(SolidFns.fetchLitDataset).toHaveBeenCalled();
  });
});
