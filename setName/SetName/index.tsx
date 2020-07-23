import React, { useState } from "react";
import { setThing } from "@solid/lit-pod";
import auth from "solid-auth-client";
import LoginButton from "../logIn/index";
import {
  fetchProfileName,
  setProfileNick,
  saveProfileNick,
} from "../helpers/fetch-lit-pod";

const SetName: React.FC = () => {
  const [profile, setProfile] = useState<string | null>();
  const [profileName, setProfileName] = useState<string | null>();
  // const [profileName, setProfileName] = useState<string | null>();

  async function loginTest() {
    alert("you have logged in");
  }

  async function loginFailed(error: Error) {
    console.log("ERROR", error.message);
  }

  async function greetUser() {
    const session = await auth.currentSession();
    if (!session) alert("Hello stranger!");
    else alert(`Hello ${session.webId}!`);
  }
  // eslint-disable-next-line no-void
  void greetUser();

  function fetchData() {
    // eslint-disable-next-line no-void
    void fetchProfileName(
      "https://ldp.demo-ess.inrupt.com/norbertiam/profile/card#me"
    ).then((result) => {
        console.debug("profile", result);
        setProfile(result.profile);
        setProfileName(result.name);
        const updatedProfile = setProfileNick(result.profile);

        const updatedProfileResource = setThing(
          result.profileResource,
          updatedProfile
        );
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        saveProfileNick(updatedProfileResource);
      }
    );
  }

  return (
    <div>
      <LoginButton
        popupUrl="./popup.html"
        onLogin={() => loginTest()}
        onError={(error) => loginFailed(error)}
      />
      <button type="button" onClick={() => fetchData()}>
        Get my name
      </button>
      <h1>{profileName}</h1>
    </div>
  );
};

export default SetName;
