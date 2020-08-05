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

import React, {
  createContext,
  ReactElement,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  Thing,
  LitDataset,
  WithResourceInfo,
  UrlString,
  getThingOne,
} from "@inrupt/solid-client";
import { DatasetContext } from "../datasetContext";

interface IThingContext {
  thing: Thing | undefined;
}

export const ThingContext = createContext<IThingContext>({
  thing: undefined,
});

interface IThingProvider {
  children: React.ReactNode;
  thing?: Thing;
  thingUrl?: UrlString | string;
  dataset?: LitDataset | (LitDataset & WithResourceInfo);
  datasetUrl?: UrlString | string;
}

type RequireProperty<T, Prop extends keyof T> = T & { [key in Prop]-?: T[key] };
type RequireDatasetOrDatasetUrl =
  | RequireProperty<IThingProvider, "thing">
  | RequireProperty<IThingProvider, "thingUrl">;

export const ThingProvider = ({
  children,
  thing,
  thingUrl,
}: RequireDatasetOrDatasetUrl): ReactElement => {
  const datasetContext = useContext(DatasetContext);
  const { dataset } = datasetContext;
  const [litThing, setLitThing] = useState<Thing>();

  useEffect(() => {
    if (dataset && thingUrl) {
      setLitThing(getThingOne(dataset, thingUrl));
    }
  }, [dataset, thingUrl]);

  if (thing) {
    return (
      <ThingContext.Provider
        value={{
          thing,
        }}
      >
        {children}
      </ThingContext.Provider>
    );
  }

  return (
    <ThingContext.Provider
      value={{
        thing: litThing,
      }}
    >
      {children}
    </ThingContext.Provider>
  );
};
