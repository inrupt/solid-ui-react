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

import React, { createContext, ReactElement, useState, useEffect } from "react";
import {
  SolidDataset,
  WithResourceInfo,
  UrlString,
} from "@inrupt/solid-client";

import useDataset from "../../hooks/useDataset";

export interface IDatasetContext {
  solidDataset: SolidDataset | (SolidDataset & WithResourceInfo) | undefined;
  setDataset: (solidDataset: SolidDataset) => void;
}

const DatasetContext = createContext<IDatasetContext>({
  solidDataset: undefined,
  setDataset: () => {},
});

export default DatasetContext;

export interface IDatasetProvider {
  children: React.ReactNode;
  /**
   * @deprecated `loading` is deprecated. It can still be used but may be removed in a future major release.`loadingComponent` should be used instead.
   */
  loading?: React.ReactNode;
  loadingComponent?: React.ComponentType | null;
  onError?(error: Error): void | null;
  solidDataset?: SolidDataset | (SolidDataset & WithResourceInfo);
  datasetUrl?: UrlString | string;
}

export type RequireProperty<T, Prop extends keyof T> = T & {
  [key in Prop]-?: T[key];
};

export type RequireDatasetOrDatasetUrl =
  | RequireProperty<IDatasetProvider, "solidDataset">
  | RequireProperty<IDatasetProvider, "datasetUrl">;

/**
 * Used to provide a [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) to child components through context, as used by various provided components and the useDataset hook.
 */
export const DatasetProvider = ({
  children,
  onError,
  solidDataset: propDataset,
  datasetUrl,
  loading,
  loadingComponent: LoadingComponent,
}: RequireDatasetOrDatasetUrl): ReactElement => {
  const { dataset, error } = useDataset(datasetUrl);

  if (error && onError) {
    onError(error);
  }

  const datasetToUse = propDataset ?? dataset;

  // Provide a setDataset function so that child components can update.
  const [stateDataset, setDataset] = useState<
    SolidDataset | (SolidDataset & WithResourceInfo) | undefined
  >(datasetToUse);

  // If the dataset is asynchronously loaded, make sure to set the new state value.
  useEffect(() => {
    setDataset(datasetToUse);
  }, [datasetToUse]);

  let loader: JSX.Element | React.ReactNode | null = (LoadingComponent && (
    <LoadingComponent />
  )) ||
    loading || <span>Fetching data...</span>;

  if (LoadingComponent === null) {
    loader = null;
  }

  return (
    <DatasetContext.Provider value={{ solidDataset: stateDataset, setDataset }}>
      {stateDataset ? children : loader}
    </DatasetContext.Provider>
  );
};
