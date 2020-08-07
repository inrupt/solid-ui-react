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
import { RenderResult, render } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { ThingContext, ThingProvider } from "./index";
import { DatasetProvider } from "../datasetContext/index";

let documentBody: RenderResult;

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
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

function ExampleComponentWithThing(): React.ReactElement {
  const [property, setProperty] = React.useState<string>(
    "fetching in progress"
  );
  const thingContext = React.useContext(ThingContext);
  const { thing } = thingContext;

  React.useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        thing,
        "http://xmlns.com/foaf/0.1/name"
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [thing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

function ExampleComponentWithThingUrl(): React.ReactElement {
  const examplePredicate = "http://xmlns.com/foaf/0.1/nick";
  const [property, setProperty] = React.useState<string>(
    "fetching in progress"
  );

  const thingContext = React.useContext(ThingContext);
  const { thing } = thingContext;

  React.useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        thing,
        examplePredicate
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [examplePredicate, thing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

describe("Testing ThingContext matches snapshot", () => {
  it("matches snapshot with thing provided", () => {
    const property = "http://xmlns.com/foaf/0.1/name";
    const name = "example value";

    const exampleThing = SolidFns.addStringNoLocale(
      SolidFns.createThing(),
      property,
      name
    );

    documentBody = render(
      <ThingProvider thing={exampleThing}>
        <ExampleComponentWithThing />
      </ThingProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
  it("matches snapshot with thingUrl provided", () => {
    jest.spyOn(SolidFns, "getThingOne").mockImplementation(() => mockThing);

    documentBody = render(
      <DatasetProvider dataset={mockDataSetWithResourceInfo}>
        <ThingProvider thingUrl="https://some-interesting-value.com">
          <ExampleComponentWithThingUrl />
        </ThingProvider>
      </DatasetProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});
