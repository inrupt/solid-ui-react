//
// Copyright 2022 Inrupt Inc.
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

import React, { ReactElement, useState } from "react";
import { Url, UrlString } from "@inrupt/solid-client";

import { DataType, CommonProperties, useProperty } from "../../helpers";
import DatetimeValue from "./datetime";
import StringValue from "./string";
import BooleanValue from "./boolean";
import UrlValue from "./url";
import IntegerValue from "./integer";
import DecimalValue from "./decimal";

export type Props = {
  dataType: DataType;
  saveDatasetTo?: Url | UrlString;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  locale?: string;
  loadingComponent?: React.ComponentType | null;
  errorComponent?: React.ComponentType<{ error: Error }>;
} & CommonProperties;

/**
 * Retrieves and displays a value of one of a range of types from a given [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset)/[Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing)/property. Can also be used to set/update and persist a value.
 */
export function Value(props: Props): ReactElement | null {
  const { dataType, ...otherProps } = props as Props;
  const {
    thing: propThing,
    solidDataset: propDataset,
    property: propProperty,
    properties: propProperties,
    edit,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    locale,
  } = otherProps;
  const {
    thing,
    value,
    error: thingError,
  } = useProperty({
    dataset: propDataset,
    thing: propThing,
    property: propProperty,
    properties: propProperties,
    type: dataType,
    locale,
  });

  let valueError;
  if (!edit && !value && dataType !== "boolean") {
    valueError = new Error("No value found for property.");
  }

  const isFetchingThing = !thing && !thingError;

  const [error] = useState<Error | undefined>(thingError ?? valueError);

  if (isFetchingThing) {
    let loader: JSX.Element | null = (LoadingComponent && (
      <LoadingComponent />
    )) || <span>fetching data in progress</span>;
    if (LoadingComponent === null) {
      loader = null;
    }
    return loader;
  }

  if (error) {
    if (ErrorComponent) {
      return <ErrorComponent error={error} />;
    }
    return <span>{error.toString()}</span>;
  }

  let Component: React.FC<Omit<Props, "dataType">> = StringValue;

  switch (dataType) {
    case "boolean":
      Component = BooleanValue;
      break;
    case "datetime":
      Component = DatetimeValue;
      break;
    case "decimal":
      Component = DecimalValue;
      break;
    case "integer":
      Component = IntegerValue;
      break;
    case "url":
      Component = UrlValue;
      break;
    default:
      Component = StringValue;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...otherProps} />;
}

Value.defaultProps = {
  autosave: false,
  edit: false,
};
