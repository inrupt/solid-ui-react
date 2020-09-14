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

import React, { createContext, ReactElement } from "react";
import { LitDataset, WithResourceInfo, UrlString } from "@inrupt/solid-client";

import useDataset from "../../hooks/useDataset";

export interface IDatasetContext {
  dataset: LitDataset | (LitDataset & WithResourceInfo) | undefined;
}

const DatasetContext = createContext<IDatasetContext>({
  dataset: undefined,
});

export default DatasetContext;

export interface IDatasetProvider {
  children: React.ReactNode;
  loading?: React.ReactNode;
  onError?(error: Error): void | null;
  dataset?: LitDataset | (LitDataset & WithResourceInfo);
  datasetUrl?: UrlString | string;
}

export type RequireProperty<T, Prop extends keyof T> = T &
  { [key in Prop]-?: T[key] };

export type RequireDatasetOrDatasetUrl =
  | RequireProperty<IDatasetProvider, "dataset">
  | RequireProperty<IDatasetProvider, "datasetUrl">;

export const DatasetProvider = ({
  children,
  onError,
  dataset: propDataset,
  datasetUrl,
  loading,
}: RequireDatasetOrDatasetUrl): ReactElement => {
  const { dataset, error } = useDataset(datasetUrl);

  if (error && onError) {
    onError(error);
  }

  const datasetToUse = propDataset ?? dataset;
  return (
    <DatasetContext.Provider value={{ dataset: datasetToUse }}>
      {datasetToUse ? children : loading || <span>Fetching data...</span>}
    </DatasetContext.Provider>
  );
};
