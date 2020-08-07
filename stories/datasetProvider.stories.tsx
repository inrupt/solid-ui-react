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
import { DatasetProvider, DatasetContext } from "../src/context/datasetContext";

export default {
  title: "Dataset Provider",
  decorators: [withKnobs],
};

export function ProviderWithDatasetUrl(): ReactElement {
  const datasetUrl = text(
    "datasetUrl",
    "https://docs-example.inrupt.net/profile/card#me"
  );
  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ExampleComponentWithDatasetUrl />
    </DatasetProvider>
  );
}

export function ProviderWithDataset(): ReactElement {
  const property = "http://xmlns.com/foaf/0.1/name";
  const name = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    name
  );
  const dataSet = SolidFns.setThing(SolidFns.createLitDataset(), exampleThing);

  return (
    <DatasetProvider dataset={dataSet}>
      <ExampleComponentWithDataset />
    </DatasetProvider>
  );
}

function ExampleComponentWithDatasetUrl(): ReactElement {
  const datasetUrl = text(
    "datasetUrl",
    "https://docs-example.inrupt.net/profile/card#me"
  );

  const examplePredicate = text("property", "http://xmlns.com/foaf/0.1/name");

  const [exampleThing, setExampleThing] = useState<SolidFns.Thing>();
  const [property, setProperty] = useState<string>("fetching in progress");

  const datasetContext = useContext(DatasetContext);
  const { dataset } = datasetContext;

  useEffect(() => {
    if (dataset) {
      const thing = SolidFns.getThingOne(dataset, datasetUrl);
      setExampleThing(thing);
    }
  }, [dataset, datasetUrl]);

  useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        exampleThing,
        examplePredicate
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [examplePredicate, exampleThing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

function ExampleComponentWithDataset(): ReactElement {
  const [exampleThing, setExampleThing] = useState<SolidFns.Thing>();
  const [property, setProperty] = useState<string>("fetching in progress");

  const datasetContext = useContext(DatasetContext);
  const { dataset } = datasetContext;

  useEffect(() => {
    if (dataset) {
      const things = SolidFns.getThingAll(dataset);
      setExampleThing(things[0]);
    }
  }, [dataset]);

  useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        exampleThing,
        "http://xmlns.com/foaf/0.1/name"
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
