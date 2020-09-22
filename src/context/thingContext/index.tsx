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
  useState,
  createContext,
  ReactElement,
  useContext,
} from "react";
import { Thing, UrlString, getThing } from "@inrupt/solid-client";
import DatasetContext from "../datasetContext";

export interface IThingContext {
  thing: Thing | undefined;
  setThing: (thing: Thing) => void;
}

const ThingContext = createContext<IThingContext>({
  thing: undefined,
  setThing: () => {},
});

export default ThingContext;

export interface IThingProvider {
  children: React.ReactNode;
  thing?: Thing;
  thingUrl?: UrlString | string;
}

export type RequireProperty<T, Prop extends keyof T> = T &
  { [key in Prop]-?: T[key] };

export type RequireThingOrThingUrl =
  | RequireProperty<IThingProvider, "thing">
  | RequireProperty<IThingProvider, "thingUrl">;

export const ThingProvider = ({
  children,
  thing: propThing,
  thingUrl,
}: RequireThingOrThingUrl): ReactElement => {
  const datasetContext = useContext(DatasetContext);
  const { dataset } = datasetContext;
  let thing = propThing;

  if (dataset && thingUrl) {
    thing = getThing(dataset, thingUrl);
  }

  // Allow child components to update the thing
  const [stateThing, setThing] = useState(thing);

  return (
    <ThingContext.Provider value={{ thing: stateThing, setThing }}>
      {children}
    </ThingContext.Provider>
  );
};
