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
    onError: { action: "onError" },
    onSave: { action: "onSave" },
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

  const exampleDataSet = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing
  );

  return (
    <Text
      dataSet={exampleDataSet}
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

  const exampleDataSet = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing
  );

  return (
    <Text
      dataSet={exampleDataSet}
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
