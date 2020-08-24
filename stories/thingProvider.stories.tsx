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
import { DatasetProvider } from "../src/context/datasetContext";
import { ThingProvider, ThingContext } from "../src/context/thingContext";
import config from "./config";

const { host } = config();

export default {
  title: "Providers/Thing Provider",
  decorators: [withKnobs],
};

export function WithLocalThing(): ReactElement {
  const property = "http://xmlns.com/foaf/0.1/name";
  const name = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    name
  );

  return (
    <ThingProvider thing={exampleThing}>
      <ExampleComponentWithThing />
    </ThingProvider>
  );
}

export function WithThingUrl(): ReactElement {
  const [litDataset, setLitDataset] = useState<
    SolidFns.LitDataset & SolidFns.WithResourceInfo
  >();

  const datasetUrl = text("Dataset Url", `${host}/example.ttl`);

  const thingUrl = text("Thing Url", `${host}/example.ttl#me`);

  const setDataset = async (url: string) => {
    await SolidFns.fetchLitDataset(url).then((result) => {
      setLitDataset(result);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void setDataset(datasetUrl);
  }, [datasetUrl]);

  if (litDataset) {
    return (
      <DatasetProvider dataset={litDataset}>
        <ThingProvider thingUrl={thingUrl}>
          <ExampleComponentWithThingUrl />
        </ThingProvider>
      </DatasetProvider>
    );
  }
  return <span>no dataset</span>;
}

function ExampleComponentWithThingUrl(): ReactElement {
  const examplePredicate = text(
    "Property",
    "http://www.w3.org/2006/vcard/ns#note"
  );
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

function ExampleComponentWithThing(): ReactElement {
  const [property, setProperty] = useState<string>("fetching in progress");
  const thingContext = useContext(ThingContext);
  const { thing } = thingContext;

  useEffect(() => {
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
