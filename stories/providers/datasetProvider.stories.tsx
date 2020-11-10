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
import DatasetContext, {
  DatasetProvider,
} from "../../src/context/datasetContext";
import config from "../config";

const { host } = config();

export default {
  title: "Providers/Dataset Provider",
  component: DatasetProvider,
  argTypes: {
    dataset: {
      description: `A [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) to be used by the provider`,
      control: { type: null },
    },
    datasetUrl: {
      description: `A url to fetch the [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) from, if \`Dataset\` is not provided.`,
      control: { type: null },
    },
    loading: {
      description: `A loading component to show while fetching the dataset.`,
      control: { type: null },
    },
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
      control: { type: null },
    },
  },
};

export function WithLocalDataset(): ReactElement {
  const property = "http://xmlns.com/foaf/0.1/name";
  const name = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    name
  );
  const dataset = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing
  );

  return (
    <DatasetProvider solidDataset={dataset}>
      <ExampleComponentWithDataset />
    </DatasetProvider>
  );
}

WithLocalDataset.parameters = {
  actions: { disable: true },
  controls: { disable: true },
};

interface IWithDatasetUrl {
  datasetUrl: string;
  thingUrl: string;
  property: string;
}

export function WithDatasetUrl(props: IWithDatasetUrl): ReactElement {
  const { datasetUrl, thingUrl, property } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ExampleComponentWithDatasetUrl thingUrl={thingUrl} property={property} />
    </DatasetProvider>
  );
}

WithDatasetUrl.parameters = {
  actions: { disable: true },
};

WithDatasetUrl.args = {
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#me`,
  property: "http://www.w3.org/2006/vcard/ns#role",
};

interface IExampleComponentWithDatasetUrl {
  thingUrl: string;
  property: string;
}

function ExampleComponentWithDatasetUrl(
  props: IExampleComponentWithDatasetUrl
): ReactElement {
  const { thingUrl, property: propertyUrl } = props;

  const [exampleThing, setExampleThing] = useState<SolidFns.Thing>();
  const [property, setProperty] = useState<string>("fetching in progress");

  const datasetContext = useContext(DatasetContext);
  const { solidDataset } = datasetContext;

  useEffect(() => {
    if (solidDataset) {
      const thing = SolidFns.getThing(solidDataset, thingUrl);
      setExampleThing(thing || undefined);
    }
  }, [solidDataset, thingUrl]);

  useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringNoLocale(
        exampleThing,
        propertyUrl
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [propertyUrl, exampleThing]);

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
  const { solidDataset } = datasetContext;

  useEffect(() => {
    if (solidDataset) {
      const things = SolidFns.getThingAll(solidDataset);
      setExampleThing(things[0]);
    }
  }, [solidDataset]);

  useEffect(() => {
    if (exampleThing) {
      const fetchedProperty = SolidFns.getStringNoLocale(
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
