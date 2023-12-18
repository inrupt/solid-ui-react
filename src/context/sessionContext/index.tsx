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

import {
  fetch,
  login,
  logout,
  handleIncomingRedirect,
  Session,
  getDefaultSession,
  EVENTS,
} from "@inrupt/solid-client-authn-browser";

import {
  SolidDataset,
  getProfileAll,
  ProfileAll,
  WithServerResourceInfo,
} from "@inrupt/solid-client";

export interface ISessionContext {
  login: typeof login;
  logout: typeof logout;
  session: Session;
  sessionRequestInProgress: boolean;
  setSessionRequestInProgress?: Dispatch<SetStateAction<boolean>> | any;
  fetch: typeof window.fetch;
  profile: ProfileAll<SolidDataset & WithServerResourceInfo> | undefined;
}

export const SessionContext = createContext<ISessionContext>({
  login,
  logout,
  fetch,
  session: getDefaultSession(),
  sessionRequestInProgress: true,
  profile: undefined,
});

/* eslint react/require-default-props: 0 */
export interface ISessionProvider {
  children: ReactNode;
  sessionId?: string;
  sessionRequestInProgress?: boolean;
  onError?: (error: Error) => void;
  /** @since 2.3.0 */
  restorePreviousSession?: boolean;
  /** @since 2.3.0 */
  onSessionRestore?: (url: string) => void;
  /**
   * @since 2.8.2
   * @experimental
   * */
  skipLoadingProfile?: boolean;
}

/**
 * Used to provide session data to child components through context, as used by various provided components and the useSession hook.
 */
export const SessionProvider = ({
  sessionId,
  children,
  onError,
  sessionRequestInProgress: defaultSessionRequestInProgress,
  restorePreviousSession,
  skipLoadingProfile,
  onSessionRestore,
}: ISessionProvider): ReactElement => {
  const restoreSession =
    restorePreviousSession || typeof onSessionRestore !== "undefined";
  const [session, setSession] = useState<Session>(getDefaultSession);
  const [profile, setProfile] =
    useState<ProfileAll<SolidDataset & WithServerResourceInfo>>();

  useEffect(() => {
    if (onSessionRestore !== undefined) {
      session.events.on(EVENTS.SESSION_RESTORED, onSessionRestore);
    }
  }, [onSessionRestore, session.events]);

  const defaultInProgress =
    typeof defaultSessionRequestInProgress === "undefined"
      ? !session.info.isLoggedIn
      : defaultSessionRequestInProgress;

  // If loggedin is true, we're not making a session request.
  const [sessionRequestInProgress, setSessionRequestInProgress] =
    useState(defaultInProgress);

  let currentLocation;

  if (typeof window !== "undefined") {
    currentLocation = window.location;
  }
  useEffect(() => {
    handleIncomingRedirect({
      url: window.location.href,
      restorePreviousSession: restoreSession,
    })
      .then(async (sessionInfo) => {
        if (skipLoadingProfile === true) {
          return;
        }

        // If handleIncomingRedirect logged the session in, we know what the current
        // user's WebID is.
        if (sessionInfo?.webId !== undefined) {
          const profiles = await getProfileAll(sessionInfo?.webId, {
            fetch: session.fetch,
          });

          setProfile(profiles);
        }
      })
      .catch((error: Error) => {
        if (onError) {
          onError(error as Error);
        } else {
          throw error;
        }
      })
      .finally(() => {
        // console.log("done");
        setSessionRequestInProgress(false);
      });

    getDefaultSession().events.on("logout", () => {
      // TODO force a refresh
      setSession(getDefaultSession());
    });
  }, [
    session,
    sessionId,
    onError,
    currentLocation,
    restoreSession,
    skipLoadingProfile,
  ]);

  const contextLogin = async (options: Parameters<typeof login>[0]) => {
    setSessionRequestInProgress(true);

    try {
      await login(options);
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        throw error;
      }
    } finally {
      setSessionRequestInProgress(false);
    }
  };

  const contextLogout = async () => {
    try {
      await logout();
      setProfile(undefined);
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        throw error;
      }
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        login: contextLogin,
        logout: contextLogout,
        sessionRequestInProgress,
        setSessionRequestInProgress,
        fetch,
        profile,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
