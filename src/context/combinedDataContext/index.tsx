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
  Thing,
  LitDataset,
  WithResourceInfo,
  UrlString,
} from "@inrupt/solid-client";

import { DatasetProvider } from "../datasetContext/index";
import { ThingProvider } from "../thingContext/index";

type Props = {
  children: React.ReactNode;
};

type ThingOrThingUrl = {
  thing?: Thing;
  thingUrl?: UrlString | string;
};

interface Dataset extends Props {
  dataset: LitDataset | (LitDataset & WithResourceInfo);
}

interface DatasetUrl extends Props {
  datasetUrl: UrlString | string;
}

type RequireProperty<T, Prop extends keyof T> = T & { [key in Prop]-?: T[key] };
type RequireThingOrThingUrl =
  | RequireProperty<ThingOrThingUrl, "thing">
  | RequireProperty<ThingOrThingUrl, "thingUrl">;

// TODO: naming of this provider TBC
function CombinedDataProvider(
  props: Dataset & RequireThingOrThingUrl
): ReactElement;
function CombinedDataProvider(
  props: DatasetUrl & RequireThingOrThingUrl
): ReactElement;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function CombinedDataProvider(props: any): ReactElement {
  const { children, dataset, datasetUrl, thing, thingUrl } = props;
  return (
    <DatasetProvider dataset={dataset} datasetUrl={datasetUrl}>
      <ThingProvider thing={thing} thingUrl={thingUrl}>
        {children}
      </ThingProvider>
    </DatasetProvider>
  );
}

export default CombinedDataProvider;
