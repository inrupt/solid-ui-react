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
import * as SolidFns from "@inrupt/solid-client";
import {
  DatasetProvider,
  DatasetContext,
} from "../src/context/datasetContext";

export default {
  title: "Dataset Provider",
};

export function ProviderWithDatasetUrl(): ReactElement {
  return (
    <DatasetProvider datasetUrl="https://ldp.demo-ess.inrupt.com/norbertand/profile/card#me">
      <ExampleComponentWithDatasetUrl />
    </DatasetProvider>
  );
}

export function ProviderWithDataset(): ReactElement {
  const examplePredicate = `http://xmlns.com/foaf/0.1/nick`;
  const exampleNick = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    examplePredicate,
    exampleNick
  );

  const exampleDataSet = SolidFns.setThing(
    SolidFns.createLitDataset(),
    exampleThing
  );

  return (
    <DatasetProvider dataset={exampleDataSet}>
      <ExampleComponentWithDataset />
    </DatasetProvider>
  );
}

function ExampleComponentWithDatasetUrl(): ReactElement {
  const [exampleThing, setExampleThing] = useState<SolidFns.Thing>();
  const [property, setProperty] = useState<string>("fetching in progress");

  const datasetContext = useContext(DatasetContext);
  const { dataset } = datasetContext;

  const examplePredicate = `http://xmlns.com/foaf/0.1/name`;

  useEffect(() => {
    if (dataset) {
      const thing = SolidFns.getThingOne(
        dataset,
        "https://ldp.demo-ess.inrupt.com/norbertand/profile/card#me"
      );
      setExampleThing(thing);
    }
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        exampleThing,
        examplePredicate
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [dataset, examplePredicate, exampleThing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

function ExampleComponentWithDataset(): ReactElement {
  const datasetContext = useContext(DatasetContext);
  const { dataset } = datasetContext;

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}
