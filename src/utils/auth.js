import auth from 'solid-auth-client';

let authInstance = null;

class Auth {
  /*
  *  Make a call to the solid auth endpoint. It requires an identity provider url, which here is
  *  coming from the dropdown, which is populated by the getIdentityProviders() function call. It
  *   currently requires a callback url and a storage option or else the call will fail.
  */
  solidLogin = async(idp) => {
    try {
      await auth.login(idp, {
        callbackUri: `${window.location.href}card`,
        storage: localStorage
      });
    } catch (err) {
      // console.log(err);
    }
  }

  /*
  * Signs out of Solid in this app, by calling the logout function and clearing the localStorage token
  */
 solidSignOut = async() => {
    try {
      await auth.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Redirect to login page
      return true;
    } catch (error) {
      // console.log(`Error: ${error}`);
    }
  }

  solidSignPopup = (popup) => {
    auth.popupLogin({ popupUri: popup });
  }

  /*
  *  Function to get providers. This is to mimic the future provider registry
  */
  getIdentityProviders(): Array<Object> {
    return [
      {
        label: 'Inrupt',
        image: '/assets/img/Inrupt.png',
        value: 'https://inrupt.net/auth',
        description: 'Lorem ipsum dolor sit amet non ipsom dolor'
      },
      {
        label: 'Solid Community',
        image: '/assets/img/Solid.png',
        value: 'https://solid.community',
        description: 'Lorem ipsum dolor sit non consectetur'
      },
      {
        label: 'Other (Enter WebID)',
        image: '/assets/img/Generic.png',
        description: null
      }
    ];
  }

}

if (!authInstance) {
  authInstance = new Auth();
}

export default authInstance;
