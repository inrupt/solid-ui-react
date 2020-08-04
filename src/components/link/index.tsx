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
import { Thing, Url, UrlString, getUrlOne } from "@inrupt/solid-client";

type Props = {
  thing: Thing;
  property: Url | UrlString;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Link({
  children,
  property,
  thing,
  rel,
  target,
  ...linkOptions
}: Props): ReactElement {
  const href = getUrlOne(thing, property);

  const adjustedRel =
    rel || (target === "_blank" ? "noopener noreferrer" : "nofollow");

  if (!href) {
    throw new Error("URL not found for given property");
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <a href={href} rel={adjustedRel} target={target} {...linkOptions}>
      {children ?? href}
    </a>
  );
}
