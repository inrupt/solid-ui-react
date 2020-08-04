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

import React, { createContext, ReactElement, useState, useEffect } from "react";
import {
  fetchLitDataset,
  LitDataset,
  WithResourceInfo,
  UrlString,
} from "@inrupt/solid-client";

interface IDatasetContext {
  dataset: LitDataset | (LitDataset & WithResourceInfo) | undefined;
}

export const DatasetContext = createContext<IDatasetContext>({
  dataset: undefined,
});

interface IDatasetProvider {
  children: React.ReactNode;
  dataset?: LitDataset | (LitDataset & WithResourceInfo);
  datasetUrl?: UrlString | string;
}

type RequireProperty<T, Prop extends keyof T> = T & { [key in Prop]-?: T[key] };
type RequireDatasetOrDatasetUrl =
  | RequireProperty<IDatasetProvider, "dataset">
  | RequireProperty<IDatasetProvider, "datasetUrl">;

export const DatasetProvider = ({
  children,
  dataset,
  datasetUrl,
}: RequireDatasetOrDatasetUrl): ReactElement => {
  const [litDataset, setLitDataset] = useState<LitDataset & WithResourceInfo>();

  const setDataset = async (url: string) => {
    await fetchLitDataset(url).then((result) => {
      setLitDataset(result);
    });
  };

  useEffect(() => {
    if (!dataset && datasetUrl) {
      // eslint-disable-next-line no-void
      void setDataset(datasetUrl);
    }
  }, [dataset, datasetUrl]);

  if (dataset) {
    return (
      <DatasetContext.Provider
        value={{
          dataset,
        }}
      >
        {children}
      </DatasetContext.Provider>
    );
  }

  return (
    <DatasetContext.Provider
      value={{
        dataset: litDataset,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};
