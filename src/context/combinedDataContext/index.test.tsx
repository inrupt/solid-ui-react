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
import { RenderResult, render } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import ThingContext from "../thingContext";
import CombinedProvider from ".";

let documentBody: RenderResult;

const mockPredicate = "http://xmlns.com/foaf/0.1/nick";
const mockNick = "test nick value";

const mockThing = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  mockPredicate,
  mockNick
);

// const mockDataset = SolidFns.setThing(SolidFns.createSolidDataset(), mockThing);
const mockDatasetWithResourceInfo = SolidFns.setThing(
  SolidFns.mockSolidDatasetFrom("https://some-interesting-value.com"),
  mockThing
);

function ExampleComponentWithDataset(): React.ReactElement {
  const [property, setProperty] = React.useState<string>(
    "fetching in progress"
  );

  const thingContext = React.useContext(ThingContext);
  const { thing } = thingContext;

  React.useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringNoLocale(thing, mockPredicate);
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

describe("CombinedProvider", () => {
  it("matches snapshot with dataset and thing provided", () => {
    documentBody = render(
      <CombinedProvider
        solidDataset={mockDatasetWithResourceInfo}
        thing={mockThing}
      >
        <ExampleComponentWithDataset />
      </CombinedProvider>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});
