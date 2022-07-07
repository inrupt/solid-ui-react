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

import React, {
  createContext,
  ReactElement,
  useState,
  useEffect,
  useMemo,
} from "react";
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

type onErrorCallback = (error: Error) => void | null;

export interface IDatasetProvider {
  children: React.ReactNode;
  /**
   * @deprecated `loading` is deprecated. It can still be used but may be removed in a future major release.`loadingComponent` should be used instead.
   */
  loading?: React.ReactNode;
  loadingComponent?: React.ComponentType | null;
  onError?: onErrorCallback;
  solidDataset?: SolidDataset | (SolidDataset & WithResourceInfo);
  datasetUrl?: UrlString | string;
}

type Dataset = IDatasetProvider & {
  solidDataset: SolidDataset | (SolidDataset & WithResourceInfo);
};
type DatasetUrl = IDatasetProvider & {
  datasetUrl: UrlString | string;
};

/**
 * Used to provide a [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) to child components through context, as used by various provided components and the useDataset hook.
 */
export function DatasetProvider(props: DatasetUrl): ReactElement;
export function DatasetProvider(props: Dataset): ReactElement;
export function DatasetProvider(props: IDatasetProvider): ReactElement {
  const { children } = props;

  let loader: JSX.Element | React.ReactNode | null = null;
  if (props.loadingComponent === null) {
    loader = null;
  } else if (
    typeof props.loadingComponent !== undefined &&
    props.loadingComponent !== undefined
  ) {
    const Loader = props.loadingComponent;
    loader = <Loader />;
  } else if (typeof props.loading !== undefined) {
    loader = () => props.loading;
  } else {
    loader = <span>Fetching data...</span>;
  }

  let datasetIri: UrlString | string | null = null;
  if (typeof props.datasetUrl === "string") {
    datasetIri = props.datasetUrl;
  }

  // datasetIri can be `null` which makes this hook a no-op, isLoading is true if we have a datasetIri:
  const { dataset: fetchedDataset, error: fetchError } = useDataset(datasetIri);
  const [isLoading, setIsLoading] = useState(
    datasetIri !== null && !fetchedDataset
  );

  // Provide a setDataset function so that child components can update.
  const [dataset, setDataset] = useState<
    SolidDataset | (SolidDataset & WithResourceInfo) | undefined
  >(() => {
    if (props.solidDataset) {
      return props.solidDataset;
    }

    if (datasetIri !== null && fetchedDataset) {
      return fetchedDataset;
    }

    // Otherwise return the undefined as we've not yet fetched the dataset:
    return undefined;
  });

  // Handle the the dataset loading asynchronously:
  let onError: onErrorCallback | undefined;
  if (typeof props.onError === "function") {
    onError = props.onError;
  }

  useEffect(() => {
    if (fetchError && typeof onError === "function") {
      onError(fetchError);
    }

    setIsLoading(false);
    setDataset(fetchedDataset);
  }, [fetchedDataset, fetchError, setDataset, onError]);

  const context = useMemo(
    () => ({
      solidDataset: dataset,
      setDataset,
    }),
    [dataset, setDataset]
  );

  return (
    <DatasetContext.Provider value={context}>
      {isLoading ? loader : children}
    </DatasetContext.Provider>
  );
}
