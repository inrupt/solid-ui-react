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
import { DataType } from "../src/helpers";
import { Value } from "../src/components/value";
import { DatasetProvider } from "../src/context/datasetContext";
import { ThingProvider } from "../src/context/thingContext";
import config from "./config";

const { host } = config();

const dataTypeOptions: Array<DataType> = [
  "string",
  "boolean",
  "datetime",
  "decimal",
  "integer",
  "url",
];

export default {
  title: "Components/Value",
  component: Value,
  argTypes: {
    onError: { action: "onError" },
    onSave: { action: "onSave" },
    dataType: {
      control: {
        type: "select",
        options: {
          string: "string",
          boolean: "boolean",
          datetime: "datetime",
          decimal: "decimal",
          integer: "integer",
          url: "url",
        },
      },
    },
  },
};

const inputOptions = {
  name: "test-name",
  className: "test-class",
};

// No idea why this is complaining.
/* eslint react/no-unused-prop-types: 0 */
interface IValue {
  datasetUrl: string;
  thingUrl: string;
  property: string;
  autosave: boolean;
  edit: boolean;
  inputProps: any;
  onError: (error: any) => void;
  onSave: () => void;
}

const defaultArgs = {
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#me`,
  property: "http://xmlns.com/foaf/0.1/name",
  autosave: false,
  edit: false,
  dataType: dataTypeOptions[1],
  inputOptions,
};

export function StringValue(props: IValue): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    inputProps,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType="string"
          property={property}
          autosave={autosave}
          edit={edit}
          inputProps={inputProps}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

StringValue.args = {
  ...defaultArgs,
};

export function BooleanValue(props: IValue): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    inputProps,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType="boolean"
          property={property}
          autosave={autosave}
          edit={edit}
          inputProps={inputProps}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

BooleanValue.args = {
  ...defaultArgs,
  thingUrl: `${host}/example.ttl#exampleImage`,
};

export function DatetimeValue(props: IValue): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    inputProps,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType="datetime"
          property={property}
          autosave={autosave}
          edit={edit}
          inputProps={inputProps}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

DatetimeValue.args = {
  ...defaultArgs,
  thingUrl: `${host}/example.ttl#exampleImage`,
  property: `http://schema.org/datePublished`,
};

export function DecimalValue(props: IValue): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    inputProps,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType="decimal"
          property={property}
          autosave={autosave}
          edit={edit}
          inputProps={inputProps}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

DecimalValue.args = {
  ...defaultArgs,
  property: "http://schema.org/version",
  thingUrl: `${host}/example.ttl#exampleImage`,
};

export function IntegerValue(props: IValue): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    inputProps,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType="integer"
          property={property}
          autosave={autosave}
          edit={edit}
          inputProps={inputProps}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

IntegerValue.args = {
  ...defaultArgs,
  property: "http://schema.org/copyrightYear",
  thingUrl: `${host}/example.ttl#exampleImage`,
};

export function UrlValue(props: IValue): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    inputProps,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType="url"
          property={property}
          autosave={autosave}
          edit={edit}
          inputProps={inputProps}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

UrlValue.args = {
  ...defaultArgs,
  property: "http://schema.org/url",
  thingUrl: `${host}/example.ttl#exampleImage`,
};

export function WithUnsavedData(
  props: IValue & { saveDatasetTo: string }
): ReactElement {
  const {
    property,
    autosave,
    edit,
    inputProps,
    saveDatasetTo,
    onError,
    onSave,
  } = props;
  const exampleNick = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
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
      property={property}
      edit={edit}
      autosave={autosave}
      saveDatasetTo={saveDatasetTo}
      inputProps={inputProps}
      onError={onError}
      onSave={onSave}
    />
  );
}

WithUnsavedData.args = {
  ...defaultArgs,
  saveDatasetTo: `${host}/example.ttl`,
};

export function WithFetchedData(
  props: IValue & { saveDatasetTo: string; dataType: any }
): ReactElement {
  const {
    datasetUrl,
    thingUrl,
    property,
    autosave,
    edit,
    dataType,
    saveDatasetTo,
    onError,
    onSave,
  } = props;

  return (
    <DatasetProvider datasetUrl={datasetUrl}>
      <ThingProvider thingUrl={thingUrl}>
        <Value
          dataType={dataType}
          property={property}
          edit={edit}
          autosave={autosave}
          saveDatasetTo={saveDatasetTo}
          onError={onError}
          onSave={onSave}
        />
      </ThingProvider>
    </DatasetProvider>
  );
}

WithFetchedData.args = {
  ...defaultArgs,
};
