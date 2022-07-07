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

import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Thing, UrlString, getThing } from "@inrupt/solid-client";
import DatasetContext from "../datasetContext";

export interface IThingContext {
  thing?: Thing | null;
  setThing: (thing: Thing) => void;
}

const ThingContext = createContext<IThingContext>({
  thing: null,
  setThing: () => {},
});

export default ThingContext;

export type IThingProvider = {
  children: React.ReactNode;
  thing?: Thing;
  thingUrl?: UrlString | string | undefined;
};

/**
 * Used to provide a Thing to child components through context, as used by various provided components and the useThing hook.
 */
export const ThingProvider = ({
  children,
  thing: propThing,
  thingUrl,
}: IThingProvider): ReactElement => {
  const { solidDataset } = useContext(DatasetContext);

  // Allow child components to update the thing
  const [stateThing, setThing] = useState<Thing | null>(() => {
    if (propThing) {
      return propThing;
    }

    if (solidDataset && thingUrl) {
      return getThing(solidDataset, thingUrl);
    }

    return null;
  });

  // Reset the thing if the dataset changes.
  useEffect(() => {
    if (solidDataset && thingUrl) {
      setThing(getThing(solidDataset, thingUrl));
    } else if (propThing) {
      setThing(propThing);
    }
  }, [solidDataset, thingUrl, propThing]);

  const context = useMemo(
    () => ({
      thing: stateThing,
      setThing,
    }),
    [stateThing, setThing]
  );

  return (
    <ThingContext.Provider value={context}>{children}</ThingContext.Provider>
  );
};
