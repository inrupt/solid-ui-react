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

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from "react";
import SolidFns from "@inrupt/solid-client";
import { DataType } from "../../src/helpers";
import { Value } from "../../src/components/value";
import { DatasetProvider } from "../../src/context/datasetContext";
import { ThingProvider } from "../../src/context/thingContext";
import config from "../config";

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
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
    },
    onSave: {
      description: `Function to be called on saving a value.`,
      action: "onSave",
    },
    dataType: {
      type: { required: true },
      description: "The type of value to be retrieved",
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
    thing: {
      description: `The [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the value from. Uses a Thing from context if not supplied.`,
    },
    dataset: {
      description: `The [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) to retrieve the value from. Uses a Dataset from context if not supplied.`,
    },
    property: {
      type: { required: true },
      description: `The property of the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the value from.`,
    },
    saveDatasetTo: {
      description: `The location to persist the updated dataset, for example when the dataset has been created locally.`,
    },
    locale: {
      description: `If \`dataType\` is \`string\`, determines the locale of the string.`,
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
    datasetUrl: {
      description: `**Not passed to Value**. Used to customise values of the wrapping [DatasetProvider](/?path=/docs/providers-dataset-provider) in the storybook examples.`,
    },
    thingUrl: {
      description: `**Not passed to Value**. Used to customise values of the wrapping [ThingProvider](/?path=/docs/providers-thing-provider) in the storybook examples`,
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
  inputProps: inputOptions,
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
  props: IValue & { saveDatasetTo: string },
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
    exampleNick,
  );

  const exampleDataset = SolidFns.setThing(
    SolidFns.createSolidDataset(),
    exampleThing,
  );

  return (
    <Value
      dataType="string"
      solidDataset={exampleDataset}
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
  props: IValue & { saveDatasetTo: string; dataType: any },
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

export function ErrorComponent(): ReactElement {
  const exampleName = "Example Name";
  const exampleProperty = "http://xmlns.com/foaf/0.1/name";
  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    exampleProperty,
    exampleName,
  );

  return (
    <Value
      dataType="string"
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
