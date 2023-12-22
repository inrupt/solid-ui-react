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

import type { ReactElement } from "react";
import React from "react";

import type {
  Thing,
  SolidDataset,
  WithResourceInfo,
  UrlString,
} from "@inrupt/solid-client";

import { DatasetProvider } from "../datasetContext";
import { ThingProvider } from "../thingContext";

export type Props = {
  children: React.ReactNode;
  loadingComponent?: React.ComponentType | null;
  onError?(error: Error): void | null;
};

export type ThingOrThingUrl = {
  thing?: Thing;
  thingUrl?: UrlString | string;
};

export interface Dataset extends Props {
  solidDataset: SolidDataset | (SolidDataset & WithResourceInfo);
}

export interface DatasetUrl extends Props {
  datasetUrl: UrlString | string;
}

export type RequireProperty<T, Prop extends keyof T> = T & {
  [key in Prop]-?: T[key];
};

export type RequireThingOrThingUrl =
  | RequireProperty<ThingOrThingUrl, "thing">
  | RequireProperty<ThingOrThingUrl, "thingUrl">;

// TODO: naming of this provider TBC
function CombinedDataProvider(
  props: Dataset & RequireThingOrThingUrl,
): ReactElement;

function CombinedDataProvider(
  props: DatasetUrl & RequireThingOrThingUrl,
): ReactElement;

/**
 * Used to provide both a [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) and [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to child components through context, as used by various provided components and the useDataset and useThing hooks.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function CombinedDataProvider(props: any): ReactElement {
  const {
    children,
    solidDataset,
    datasetUrl,
    thing,
    thingUrl,
    onError,
    loadingComponent,
  } = props;

  return (
    <DatasetProvider
      onError={onError}
      solidDataset={solidDataset}
      datasetUrl={datasetUrl}
      loadingComponent={loadingComponent}
    >
      <ThingProvider thing={thing} thingUrl={thingUrl}>
        {children}
      </ThingProvider>
    </DatasetProvider>
  );
}

export default CombinedDataProvider;
