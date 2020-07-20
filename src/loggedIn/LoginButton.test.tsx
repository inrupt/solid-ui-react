import React from 'react';
import renderer from 'react-test-renderer';
import { LoginButton } from './LoginButton';

async function loginTest() {
    console.log('login function test')
}
it('renders correctly if we are passing in a "children" property', () => {
    const tree = renderer
      .create(<LoginButton children={<h2>Log In</h2>} popupUrl="./popup.html" onLogin={() => loginTest()}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
});
it('renders correctly if we are not passing in a "children" property', () => {
    const tree = renderer
      .create(<LoginButton popupUrl="./popup.html" onLogin={() => loginTest()}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
});