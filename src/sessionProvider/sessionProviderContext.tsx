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
  SetStateAction,
  Dispatch,
  useEffect,
  ReactNode,
} from "react";
import auth from "solid-auth-client";

export interface ISession {
  webId: string;
}

interface ISessionContext {
  session?: ISession | undefined;
  setSession?: Dispatch<SetStateAction<ISession>> | any;
  sessionRequestInProgress?: boolean;
  setSessionRequestInProgress?: Dispatch<SetStateAction<boolean>> | any;
}

const SessionContext = createContext<ISessionContext>({});
export default SessionContext;

interface ISessionProvider {
  children: ReactNode;
}

export function SessionProvider({ children }: ISessionProvider): ReactElement {
  const [session, setSession] = useState<ISession | undefined>();
  const [sessionRequestInProgress, setSessionRequestInProgress] = useState(
    false
  );

  useEffect(() => {
    auth
      .trackSession((trackedSession) => setSession(trackedSession))
      .catch((error) => {
        throw error;
      });

    return function cleanup() {
      auth.stopTrackSession(() => {});
    };
  }, [setSession]);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        sessionRequestInProgress,
        setSessionRequestInProgress,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
