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

import { useContext } from "react";
import {
  ILoginInputOptions,
  Session,
} from "@inrupt/solid-client-authn-browser";
import { SessionContext } from "../../context/sessionContext";

export interface SessionInfo {
  session: Session;
  sessionRequestInProgress: boolean;
  fetch: typeof window.fetch;
  login: (options: ILoginInputOptions) => Promise<void>;
  logout: () => Promise<void>;
}

export default function useSession(): SessionInfo {
  const { session, sessionRequestInProgress, fetch, login, logout } =
    useContext(SessionContext);

  return {
    session,
    sessionRequestInProgress,
    fetch,
    login,
    logout,
  };
}
