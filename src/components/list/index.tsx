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
  getStringInLocaleAll,
  getStringUnlocalizedAll,
  Url,
} from "@inrupt/solid-client";

type Props = {
  dataSet: LitDataset & WithResourceInfo;
  property: Url | UrlString;
  thing: Thing;
  type: string;
  locale?: string;
  element?: React.ReactNode;
  child?: React.ReactNode;
};

export default function List({
  thing,
  dataSet,
  property,
  type,
  locale,
  element,
  child,
}: Props): ReactElement {
  const listValues = locale
    ? getStringInLocaleAll(thing, property, locale)
    : getStringUnlocalizedAll(thing, property);

  const Element = element || "ul";
  const Child = child;
  const children = child
    ? listValues.map((value, index) => (
      <Child key={value} value={value} index={index} />
      ))
    : listValues.map((item) => <li key={item}>{item}</li>);

  return <Element>{children}</Element>;
}
