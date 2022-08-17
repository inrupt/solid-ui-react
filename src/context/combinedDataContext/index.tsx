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
/* eslint-disable react/destructuring-assignment */

import React, { ReactElement } from "react";

import {
  SolidDataset,
  WithResourceInfo,
  UrlString,
  Thing,
} from "@inrupt/solid-client";

import { DatasetProvider } from "../datasetContext";
import { ThingProvider } from "../thingContext";

type DatasetProp = SolidDataset | (SolidDataset & WithResourceInfo);
type DatasetUrlProp = UrlString | string;
type ThingUrlProp = UrlString | string;

interface BaseProps {
  children: React.ReactNode;
  loadingComponent?: React.ComponentType | null;
  onError?(error: Error): void | null;
  thing?: Thing;
  thingUrl?: ThingUrlProp;
  solidDataset?: DatasetProp;
  datasetUrl?: DatasetUrlProp;
}

type DatasetAndThing = BaseProps & { solidDataset: DatasetProp; thing: Thing };
type DatasetAndThingUrl = BaseProps & {
  solidDataset: DatasetProp;
  thingUrl: ThingUrlProp;
};
type DatasetUrlAndThing = BaseProps & {
  datasetUrl: DatasetUrlProp;
  thing: Thing;
};
type DatasetUrlAndThingUrl = BaseProps & {
  datasetUrl: DatasetUrlProp;
  thingUrl: ThingUrlProp;
};

export type Props =
  | DatasetAndThing
  | DatasetAndThingUrl
  | DatasetUrlAndThing
  | DatasetUrlAndThingUrl;

// TODO: naming of this provider TBC
function CombinedDataProvider(props: DatasetAndThing): ReactElement;
function CombinedDataProvider(props: DatasetAndThingUrl): ReactElement;
function CombinedDataProvider(props: DatasetUrlAndThing): ReactElement;
function CombinedDataProvider(props: DatasetUrlAndThingUrl): ReactElement;
/**
 * Used to provide both a [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) and [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to child components through context, as used by various provided components and the useDataset and useThing hooks.
 */
function CombinedDataProvider(props: Props): ReactElement | null {
  const { children, thing, thingUrl, onError, loadingComponent } = props;

  if (typeof props.datasetUrl === "string" && !props.solidDataset) {
    return (
      <DatasetProvider
        onError={onError}
        datasetUrl={props.datasetUrl}
        loadingComponent={loadingComponent}
      >
        <ThingProvider thing={thing} thingUrl={thingUrl}>
          {children}
        </ThingProvider>
      </DatasetProvider>
    );
  }

  if (props.solidDataset !== undefined) {
    return (
      <DatasetProvider
        onError={onError}
        solidDataset={props.solidDataset}
        loadingComponent={loadingComponent}
      >
        <ThingProvider thing={thing} thingUrl={thingUrl}>
          {children}
        </ThingProvider>
      </DatasetProvider>
    );
  }

  return null;
}

export default CombinedDataProvider;
