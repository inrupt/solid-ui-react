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

import React, { ReactElement, useContext, useState, useEffect } from "react";
import { withKnobs, text } from "@storybook/addon-knobs";
import * as SolidFns from "@inrupt/solid-client";
import { ThingContext } from "../src/context/thingContext";
import CombinedDataProvider from "../src/context/combinedDataContext";

export default {
  title: "Combined Provider (name TBC)",
  decorators: [withKnobs],
};

export function CombinedDataProviderExample(): ReactElement {
  const property = "http://xmlns.com/foaf/0.1/name";
  const name = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    name
  );
  const dataSet = SolidFns.setThing(SolidFns.createLitDataset(), exampleThing);

  return (
    <CombinedDataProvider dataset={dataSet} thing={exampleThing}>
      <ExampleComponent />
    </CombinedDataProvider>
  );
}

function ExampleComponent(): ReactElement {
  const examplePredicate = "http://xmlns.com/foaf/0.1/name";
  const [property, setProperty] = useState<string>("fetching in progress");

  const thingContext = useContext(ThingContext);
  const { thing } = thingContext;

  useEffect(() => {
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
