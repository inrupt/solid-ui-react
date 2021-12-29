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

import { useContext } from "react";
import useSWR from "swr";
import { getSolidDataset, SolidDataset } from "@inrupt/solid-client";
import { SessionContext } from "../../context/sessionContext";
import DatasetContext from "../../context/datasetContext";

export default function useDataset(
  datasetIri?: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  options?: any
): {
  dataset: SolidDataset | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
} {
  const { fetch } = useContext(SessionContext);
  const { solidDataset: datasetFromContext } = useContext(DatasetContext);
  const { data, error } = useSWR(
    datasetIri ? [datasetIri, options, fetch] : null,
    () => {
      const requestOptions = {
        fetch,
        ...options,
      };
      // useSWR will only call this fetcher if datasetUri is defined
      return getSolidDataset(datasetIri as string, requestOptions);
    },
    {
      revalidateOnFocus: false,
    }
  );

  const dataset = datasetIri ? (data as SolidDataset) : datasetFromContext;
  return { dataset, error };
}
