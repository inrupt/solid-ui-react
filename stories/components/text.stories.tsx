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
import { Text } from "../../src/components/text";
import { DatasetProvider } from "../../src/context/datasetContext";
import { ThingProvider } from "../../src/context/thingContext";
import config from "../config";

const { host } = config();

export default {
  title: "Components/Text",
  component: Text,
  argTypes: {
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
    },
    onSave: {
      description: `Function to be called on saving a value.`,
      action: "onSave",
    },
    thing: {
      description: `The [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the text from. Uses a Thing from context if not supplied.`,
    },
    dataset: {
      description: `The [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) to retrieve the text from. Uses a Dataset from context if not supplied.`,
    },
    property: {
      type: { required: true },
      description: `The property of the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the text from.`,
    },
    saveDatasetTo: {
      description: `The location to persist the updated dataset, for example when the dataset has been created locally.`,
    },
    locale: {
      description: `The locale of the string value.`,
    },
    edit: {
      description: `If true, renders an input to allow a new value to be entered.`,
    },
    autosave: {
      description: `If true, persists a new value once entered.`,
    },
    inputProps: {
      description: `Additional attributes to be passed to the file input, if \`edit\` is true`,
    },
    errorComponent: {
      description: `Component to be rendered in case of error.`,
      control: { type: null },
    },
    loadingComponent: {
      description: `A loading component to show while fetching the dataset. If \`null\` the default loading message won't be displayed`,
      control: { type: null },
    },
  },
};

const defaultInputOptions = {
  type: "text",
  name: "test-name",
  className: "test-class",
};

// Not sure why this is complaining.
/* eslint react/require-default-props: 0, react/no-unused-prop-types: 0 */
interface IText {
  property: string;
  autosave: boolean;
  edit: boolean;
  inputProps: any;
  datasetUrl?: string;
  thingUrl?: string;
  onError: (error: any) => void;
  onSave: () => void;
}

export function BasicExample({
  autosave,
  edit,
  inputProps,
  property,
  onError,
  onSave,
}: IText): ReactElement {
  const exampleNick = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    exampleNick
  );

  const exampleDataset = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing
  );

  return (
    <Text
      solidDataset={exampleDataset}
      thing={exampleThing}
      property={property}
      autosave={autosave}
      edit={edit}
      inputProps={inputProps}
      onError={onError}
      onSave={onSave}
    />
  );
}

BasicExample.args = {
  autosave: false,
  edit: false,
  inputProps: { ...defaultInputOptions },
  property: "http://xmlns.com/foaf/0.1/name",
};

export function WithLocalData({
  autosave,
  edit,
  inputProps,
  onError,
  onSave,
}: IText): ReactElement {
  const examplePredicate = `http://xmlns.com/foaf/0.1/nick`;
  const exampleNick = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    examplePredicate,
    exampleNick
  );

  const exampleDataset = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing
  );

  return (
    <Text
      solidDataset={exampleDataset}
      thing={exampleThing}
      property={examplePredicate}
      edit={edit}
      autosave={autosave}
      saveDatasetTo={`${host}/example.ttl`}
      inputProps={inputProps}
      onError={onError}
      onSave={onSave}
    />
  );
}

WithLocalData.args = {
  autosave: false,
  edit: false,
  inputProps: { ...defaultInputOptions },
  property: "http://xmlns.com/foaf/0.1/name",
};

export function WithFetchedData({
  autosave,
  edit,
  property,
  inputProps,
  datasetUrl,
  thingUrl,
  onError,
  onSave,
}: IText): ReactElement {
  return (
    <DatasetProvider datasetUrl={datasetUrl as string}>
      <ThingProvider thingUrl={thingUrl as string}>
        <Text
          property={property}
          edit={edit}
          autosave={autosave}
          saveDatasetTo={`${host}/example.ttl#me`}
          onError={onError}
          onSave={onSave}
          inputProps={inputProps}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

WithFetchedData.args = {
  autosave: true,
  edit: true,
  inputProps: { ...defaultInputOptions },
  property: "http://xmlns.com/foaf/0.1/name",
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#me`,
};

export function ErrorComponent(): ReactElement {
  const exampleName = "Example Name";
  const exampleProperty = "http://xmlns.com/foaf/0.1/name";
  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    exampleProperty,
    exampleName
  );

  return (
    <Text
      thing={exampleThing}
      property="https://example.com/bad-url"
      errorComponent={({ error }) => <span>{error.toString()}</span>}
    />
  );
}

ErrorComponent.parameters = {
  actions: { disable: true },
  controls: { disable: true },
};
