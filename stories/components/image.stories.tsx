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
import {
  addUrl,
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
import { Image } from "../../src/components/image";
import CombinedDataProvider from "../../src/context/combinedDataContext";
import config from "../config";

const { host } = config();

export default {
  title: "Components/Image",
  component: Image,
  argTypes: {
    thing: {
      description: `The [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the image src from. Uses a Thing from context if not supplied.`,
      control: { type: null },
    },
    property: {
      description: `The property of the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the src URL from.`,
    },
    properties: {
      description: `An array of ordered properties that will be used to attempt to read the src from (see \`property\`). If there is no value at the first property, the second is attempted, etc, and used for both reading and writing.`,
    },
    edit: {
      description: `If true, renders an input to allow a new image file to be selected.`,
    },
    autosave: {
      description: `If true, uploads and persists a new image once selected.`,
    },
    maxSize: {
      description: `The maximum permitted file size, in kB`,
    },
    inputProps: {
      description: `Additional attributes to be passed to the file input, if \`edit\` is true`,
      control: { type: null },
    },
    onSave: {
      description: `Function to be called on saving a new image.`,
      control: { type: null },
    },
    onError: {
      description: `Function to be called on error.`,
      control: { type: null },
    },
    errorComponent: {
      description: `Component to be rendered in case of error.`,
      control: { type: null },
    },
    loadingComponent: {
      description: `A loading component to show while fetching the dataset. If \`null\` the default loading message won't be displayed`,
      control: { type: null },
    },
    saveLocation: {
      description: `A URL for a container where a new image is to be saved in case a value for an image property is not found`,
      control: { type: null },
    },
    solidDataset: {
      description: `A Solid Dataset where a new image should be added`,
      control: { type: null },
    },
  },
};
interface IWithBasicData {
  property: string;
  properties: Array<string>;
  edit: boolean;
  allowDelete: boolean;
  maxSize: number;
}
export function BasicExample({
  property,
  properties,
  edit,
  allowDelete,
  maxSize,
}: IWithBasicData): ReactElement {
  const thing = addUrl(createThing(), property, `${host}/example.jpg`);

  return (
    <Image
      thing={thing}
      property={property}
      properties={properties}
      edit={edit}
      maxSize={maxSize}
      allowDelete={allowDelete}
    />
  );
}

BasicExample.args = {
  property: "http://schema.org/contentUrl",
  edit: false,
  allowDelete: false,
  maxSize: 100000000,
};

BasicExample.parameters = {
  actions: { disable: true },
};
export function PropertyArrayExample({
  property,
  properties,
  edit,
  maxSize,
  allowDelete,
}: IWithBasicData): ReactElement {
  const thing = addUrl(createThing(), property, `${host}/example.jpg`);

  return (
    <Image
      thing={thing}
      properties={properties}
      edit={edit}
      maxSize={maxSize}
      allowDelete={allowDelete}
    />
  );
}

PropertyArrayExample.args = {
  property: "http://schema.org/contentUrl",
  properties: [
    "http://schema.org/iri-not-on-the-thing",
    "http://schema.org/contentUrl",
  ],
  edit: false,
  maxSize: 100000000,
};

PropertyArrayExample.parameters = {
  actions: { disable: true },
};
interface IWithDatasetProvider {
  datasetUrl: string;
  thingUrl: string;
  property: string;
  edit: boolean;
  maxSize: number;
}
export function WithDatasetProvider({
  thingUrl,
  datasetUrl,
  property,
  edit,
  maxSize,
}: IWithDatasetProvider): ReactElement {
  return (
    <CombinedDataProvider datasetUrl={datasetUrl} thingUrl={thingUrl}>
      <Image property={property} edit={edit} maxSize={maxSize} />
    </CombinedDataProvider>
  );
}

WithDatasetProvider.args = {
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#exampleImage`,
  property: "http://schema.org/contentUrl",
  edit: false,
  maxSize: 100000000,
};

WithDatasetProvider.parameters = {
  actions: { disable: true },
};

export function ErrorComponent(): ReactElement {
  const property = "http://schema.org/contentUrl";
  const thing = addUrl(createThing(), property, `${host}/example.jpg`);

  return (
    <Image
      thing={thing}
      property="https://example.com/bad-url"
      errorComponent={({ error }) => <span>{error.toString()}</span>}
    />
  );
}

ErrorComponent.parameters = {
  actions: { disable: true },
};

export function DeleteComponent(): ReactElement {
  const property = "http://schema.org/contentUrl";
  const thing = addUrl(createThing(), property, `${host}/example.jpg`);
  const dataset = setThing(createSolidDataset(), thing);

  return (
    <Image
      thing={thing}
      solidDataset={dataset}
      edit
      autosave
      saveLocation={`${host}/`}
      property={property}
      allowDelete
      deleteComponent={({ onClick }) => (
        <button type="button" onClick={onClick}>
          Custom Delete Component
        </button>
      )}
    />
  );
}

DeleteComponent.parameters = {
  actions: { disable: true },
};
