import React from 'react';
import renderer from 'react-test-renderer';
import { LogoutButton } from './LogoutButton';

async function logoutTest() {
    console.log('logout function test')
}
it('renders correctly if we are passing in a "children" property', () => {
    const tree = renderer
      .create(<LogoutButton children={<h2>Log Out</h2>} onLogout={() => logoutTest()}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
});
it('renders correctly if we are not passing in a "children" property', () => {
    const tree = renderer
      .create(<LogoutButton onLogout={() => logoutTest()}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
});