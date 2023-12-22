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

import { getThing, Thing } from "@inrupt/solid-client";
import { useContext } from "react";
import ThingContext from "../../context/thingContext";
import useDataset from "../useDataset";

export default function useThing(
  datasetIri?: string | null | undefined,
  thingIri?: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  options?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { thing?: Thing | null; error: any } {
  const { dataset, error } = useDataset(datasetIri, options);
  const { thing: thingFromContext } = useContext(ThingContext);
  if (!thingIri) {
    return { thing: thingFromContext || undefined, error };
  }

  if (!dataset) {
    return { thing: null, error };
  }

  const thing = getThing(dataset, thingIri);
  return { thing, error };
}
