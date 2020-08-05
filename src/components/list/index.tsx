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

import React, { ReactElement, useState, useEffect } from "react";
import {
  Thing,
  LitDataset,
  WithResourceInfo,
  UrlString,
} from "@inrupt/solid-client";

type Props = {
  dataSet: LitDataset & WithResourceInfo;
  property: UrlString | string;
  thing: Thing;
  locale?: string;
};

export default function List({
  thing,
  dataSet,
  property,
  locale,
}: Props): ReactElement {


  


  /*  const [text, setText] = useState<string | null>("");
  const [initialValue, setInitialValue] = useState<string | null>("");

  useEffect(() => {
    if (locale) {
      setText(getStringInLocaleOne(thing, property, locale));
    } else {
      setText(getStringUnlocalizedOne(thing, property));
    }
  }, [thing, property, locale]);

  const someFunction = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (initialValue !== e.target.value) {
      const newValue = e.target.value;
      let updatedResource: Thing;
      if (locale) {
        updatedResource = setStringInLocale(thing, property, newValue, locale);
      } else {
        updatedResource = setStringUnlocalized(thing, property, newValue);
      }
      try {
        await saveLitDatasetAt(
          getFetchedFrom(dataSet),
          setThing(dataSet, updatedResource)
        );
        if (onSave) {
          onSave();
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    }
  };  */

  return (
    <>
      <div>hello</div>
    </>
  );
}
