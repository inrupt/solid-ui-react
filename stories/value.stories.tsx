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
import {
  withKnobs,
  text,
  boolean,
  object,
  select,
} from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Value, { DataType } from "../src/components/value";
import { DatasetProvider } from "../src/context/datasetContext";
import { ThingProvider } from "../src/context/thingContext";

export default {
  title: "Components/Value component",
  component: Value,
  decorators: [withKnobs],
};

const inputOptions = {
  name: "test-name",
  className: "test-class",
};

const dataTypeOptions: Array<DataType> = [
  "string",
  "boolean",
  "datetime",
  "decimal",
  "integer",
  "url",
];

export function BasicExample(): ReactElement {
  const examplePredicate = `http://xmlns.com/foaf/0.1/name`;
  const exampleNick = true;

  const exampleThing = SolidFns.setBoolean(
    SolidFns.createThing(),
    examplePredicate,
    exampleNick
  );

  const exampleDataSet = SolidFns.setThing(
    SolidFns.createLitDataset(),
    exampleThing
  );

  return (
    <Value
      dataType="string"
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

export function WithUnsavedData(): ReactElement {
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
    <Value
      dataType="string"
      dataSet={exampleDataSet}
      thing={exampleThing}
      property={examplePredicate}
      edit={boolean("Edit", false)}
      autosave={boolean("Autosave", false)}
      saveDatasetTo={text(
        "Save Dataset to URL",
        "https://docs-example.inrupt.net/profile/card"
      )}
      inputProps={object("Input options", inputOptions)}
      onError={action("OnError")}
      onSave={action("onSave")}
    />
  );
}

export function WithFetchedData(): ReactElement {
  return (
    <DatasetProvider
      datasetUrl={text(
        "Dataset Url",
        "https://docs-example.inrupt.net/profile/card"
      )}
    >
      <ThingProvider
        thingUrl={text(
          "Thing Url",
          "https://docs-example.inrupt.net/profile/card#me"
        )}
      >
        <Value
          dataType={select("dataType", dataTypeOptions, "string")}
          property={text("property", "http://xmlns.com/foaf/0.1/name")}
          edit={boolean("Edit", true)}
          autosave={boolean("Autosave", true)}
          saveDatasetTo={text(
            "Save Dataset to URL",
            "https://docs-example.inrupt.net/profile/card"
          )}
          onError={action("OnError")}
          onSave={action("onSave")}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}
