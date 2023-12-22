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

import React, { ReactElement, useState } from "react";

import { CommonProperties, useProperty } from "../../helpers";
import { Value } from "../value";

export type Props = {
  loadingComponent?: React.ComponentType | null;
  errorComponent?: React.ComponentType<{ error: Error }>;
} & CommonProperties &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Retrieves a URL from given [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing)/property, and renders as an anchor tag with the given href.
 */
export function Link({
  children,
  property: propProperty,
  properties: propProperties,
  thing: propThing,
  solidDataset,
  autosave,
  rel,
  target,
  edit,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  onSave,
  onError,
  ...linkOptions
}: Props): ReactElement | null {
  const {
    value: href,
    thing,
    property,
    dataset,
    error: thingError,
  } = useProperty({
    dataset: solidDataset,
    thing: propThing,
    property: propProperty,
    properties: propProperties,
    type: "url",
  });

  let valueError;
  if (!edit && !href) {
    valueError = new Error("URL not found for given property");
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
  const adjustedRel =
    rel || (target === "_blank" ? "noopener noreferrer" : "nofollow");

  if (edit) {
    return (
      <Value
        dataType="url"
        solidDataset={dataset}
        thing={thing}
        property={property as string}
        autosave={autosave}
        onSave={onSave}
        onError={onError}
        edit
      />
    );
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <a href={href as string} rel={adjustedRel} target={target} {...linkOptions}>
      {children ?? href}
    </a>
  );
}
