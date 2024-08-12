export default class Api {
  constructor(baseUrl, headers) {
    // constructor body
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
  async getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        authorization: "14397dd8-886c-41ac-9747-72b21d4fd4c0",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        console.log("Error");
        return Promise.reject(`Error: ${res.status}`);
      })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.error(err));
  }
  getInitialCards() {
    // ...
  }

  // other methods for working with the API
}
