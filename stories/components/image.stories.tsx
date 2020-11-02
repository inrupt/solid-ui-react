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
import { addUrl, createThing } from "@inrupt/solid-client";
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
      type: { required: true },
      description: `The property of the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the src URL from.`,
      control: { type: null },
    },
    edit: {
      description: `If true, renders an input to allow a new image file to be selected.`,
      control: { type: null },
    },
    autosave: {
      description: `If true, uploads and persists a new image once selected.`,
      control: { type: null },
    },
    maxSize: {
      description: `The maximum permitted file size, in kB`,
      control: { type: null },
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
  },
};

export function BasicExample(): ReactElement {
  const property = "http://schema.org/contentUrl";
  const thing = addUrl(createThing(), property, `${host}/example.jpg`);

  return <Image thing={thing} property={property} />;
}

BasicExample.parameters = {
  actions: { disable: true },
  controls: { disable: true },
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
  controls: { disable: true },
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
  controls: { disable: true },
};
