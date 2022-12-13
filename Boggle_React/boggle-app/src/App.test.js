import React from 'react';
import App from './App';
// https://testing-library.com/docs/dom-testing-library/api-async#waitforelement
// https://testing-library.com/docs/react-testing-library/cheatsheet
import { render, fireEvent, act } from '@testing-library/react';
import fs from 'fs'; // File system import
import firebase from 'firebase.js';
import * as firebaseTesting from '@firebase/testing'

const projectId = "techx-codelab";
const rules = fs.readFileSync("firestore.rules", "utf8");

beforeEach(async () => {
  // Clear the database between tests
  await firebaseTesting.clearFirestoreData({ projectId });
  await firebaseTesting.loadFirestoreRules({ projectId, rules });
});

describe("My app", () => {

	const firebaseApp = firebase.initializeApp({
	  projectId: projectId
	});

	const db = firebaseApp.firestore();
	db.settings({
		host: "localhost:8080",
		ssl: false
	});

  test('handles user input', async () => {
    window.prompt = jest.fn(() => 'mountain view');
    console.log = jest.fn();

    // Mock Google Authentication to login as user with ID 123
    firebase.auth = jest.fn(() => ({
      signInWithPopup: () => ({
        then: (f) => {
          f({user: {uid: "123", displayName: "Alice Doe"}});
          return {
            catch: () => {},
          };
        },
      }),
    }));
    firebase.auth.GoogleAuthProvider = jest.fn();

    // Add entry to the database for user with ID 123
    await db.collection("users").doc("123").set({
      name: "alice",
      hometown: "sunnyvale"
    });

    const { getByText, findByText } = render(<App />);

    // The default values we inserted should be rendered
    await findByText(/123, alice, sunnyvale/i);

    // Click on the login button, the mock should return the "user"
    // with ID 123
    act(() => {
      /* fire events that update state */
      fireEvent.click(getByText('Login'));
    });

    // Wait for the welcome text, validating that the user is logged in
    await findByText(/Welcome, Alice Doe/i);

    // Click on the hometown button, prompt mock should resolve
    act(() => {
      fireEvent.click(getByText('Hometown?'));
    });

    // Verify that prompt and console log were called with expected values
    expect(window.prompt).toHaveBeenCalledWith('Hometown?');
    expect(console.log).toHaveBeenCalledWith('mountain view');

    // Database should have updated with new value which replaces hometown
    await findByText(/123, alice, mountain view/i);
  });
});