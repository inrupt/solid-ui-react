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

import {
  fetchLitDataset,
  getThingOne,
  getStringUnlocalizedOne,
  setStringUnlocalized,
  saveLitDatasetAt,
  Thing,
} from "@solid/lit-pod";

export interface profileObject {
  name: string | null;
  profile: Thing;
  profileResource: any;
}

export async function fetchProfileName(
  containerIri: string
): Promise<profileObject> {
  const profileResource = await fetchLitDataset(containerIri);
  // console.debug("profileResource", profileResource);
  const profile = getThingOne(profileResource, containerIri);
  const name: string | null = getStringUnlocalizedOne(
    profile,
    `http://xmlns.com/foaf/0.1/name`
  );
  return {
    name,
    profile,
    profileResource,
  };
}

export function setProfileNick(thing: Thing): Thing {
  console.debug("thing", thing);
  return setStringUnlocalized(
    thing,
    `http://xmlns.com/foaf/0.1/name`,
    "Domino"
  );
}

export async function saveProfileNick(
  updatedProfileResource: Thing
): Promise<string> {
  // eslint-disable-next-line no-void
  void saveLitDatasetAt(
    "https://ldp.demo-ess.inrupt.com/norbertiam/profile/card#mee",
    updatedProfileResource
  );
  return "saved";
}
