//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import type { ReactElement } from "react";
import React, { useContext, useState, useEffect } from "react";
import SolidFns from "@inrupt/solid-client";
import ThingContext from "../../src/context/thingContext";
import CombinedDataProvider from "../../src/context/combinedDataContext";
import config from "../config";

const { host } = config();

export default {
  title: "Providers/Combined Data Provider",
  component: CombinedDataProvider,
  parameters: {
    docs: {
      description: {
        component: `Used to provide both a [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) and [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to child components through context, as used by various provided components and the [useDataset](/?path=/docs/hooks-usething) and [useThing](/?path=/docs/hooks-usedataset) hooks.`,
      },
    },
  },
  argTypes: {
    dataset: {
      description: `A [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) to be used by the provider`,
      control: { type: null },
    },
    datasetUrl: {
      description: `A url to fetch the [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) from, if \`Dataset\` is not provided.`,
      control: { type: null },
    },
    thing: {
      description: `A [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to be used by the provider`,
      control: { type: null },
    },
    thingUrl: {
      description: `A url to retrieve the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) from, if \`Thing\` is not provided. Uses the Dataset from context.`,
      control: { type: null },
    },
    loadingComponent: {
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

function ExampleComponent({
  propertyUrl,
}: {
  propertyUrl: string;
}): ReactElement {
  const [property, setProperty] = useState<string>("fetching in progress");

  const thingContext = useContext(ThingContext);
  const { thing } = thingContext;

  useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringNoLocale(thing, propertyUrl);

      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [thing, propertyUrl]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

function ExampleComponentFetchedData({
  propertyUrl,
}: {
  propertyUrl: string;
}): ReactElement {
  const [property, setProperty] = useState<string>("fetching in progress");

  const thingContext = useContext(ThingContext);
  const { thing } = thingContext;

  useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringNoLocale(thing, propertyUrl);
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [propertyUrl, thing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

export function WithLocalData(): ReactElement {
  const property = "http://xmlns.com/foaf/0.1/name";
  const name = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    name,
  );
  const dataset = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing,
  );

  return (
    <CombinedDataProvider solidDataset={dataset} thing={exampleThing}>
      <ExampleComponent propertyUrl={property} />
    </CombinedDataProvider>
  );
}

WithLocalData.parameters = {
  actions: { disable: true },
  controls: { disable: true },
};

export function WithDataUrls({
  datasetUrl,
  thingUrl,
  propertyUrl,
}: {
  datasetUrl: string;
  thingUrl: string;
  propertyUrl: string;
}): ReactElement {
  return (
    <CombinedDataProvider datasetUrl={datasetUrl} thingUrl={thingUrl}>
      <ExampleComponentFetchedData propertyUrl={propertyUrl} />
    </CombinedDataProvider>
  );
}

WithDataUrls.parameters = {
  actions: { disable: true },
};

WithDataUrls.args = {
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#me`,
  propertyUrl: "http://xmlns.com/foaf/0.1/name",
};
