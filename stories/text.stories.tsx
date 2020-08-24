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

import React, { ReactElement } from "react";
import * as SolidFns from "@inrupt/solid-client";
import { withKnobs, text, boolean, object } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Text from "../src/components/text";
import { DatasetProvider } from "../src/context/datasetContext";
import { ThingProvider } from "../src/context/thingContext";
import config from "./config";

const { host } = config();

export default {
  title: "Components/Text component",
  component: Text,
  decorators: [withKnobs],
};

const inputOptions = {
  type: "text",
  name: "test-name",
  className: "test-class",
};

export function BasicExample(): ReactElement {
  const examplePredicate = `http://xmlns.com/foaf/0.1/name`;
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
    <Text
      dataSet={exampleDataSet}
      thing={exampleThing}
      property={examplePredicate}
      autosave={boolean("Autosave", false)}
      edit={boolean("Edit", false)}
      inputProps={object("Input options", inputOptions)}
      onError={action("OnError")}
      onSave={action("onSave")}
    />
  );
}

export function WithLocalData(): ReactElement {
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
    <Text
      dataSet={exampleDataSet}
      thing={exampleThing}
      property={examplePredicate}
      edit={boolean("Edit", false)}
      autosave={boolean("Autosave", false)}
      saveDatasetTo={text("Save Dataset to URL", `${host}/example.ttl`)}
      inputProps={object("Input options", inputOptions)}
      onError={action("OnError")}
      onSave={action("onSave")}
    />
  );
}

export function WithFetchedData(): ReactElement {
  return (
    <DatasetProvider datasetUrl={text("Dataset Url", `${host}/example.ttl`)}>
      <ThingProvider thingUrl={text("Thing Url", `${host}/example.ttl#me`)}>
        <Text
          property={text("property", "http://xmlns.com/foaf/0.1/name")}
          edit={boolean("Edit", true)}
          autosave={boolean("Autosave", true)}
          saveDatasetTo="https://docs-example.inrupt.net/profile/card#me"
          onError={action("OnError")}
          onSave={action("onSave")}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}
