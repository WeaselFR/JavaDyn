class Config {
  static async load() {
    const response = await fetch("./config.json");
    return await response.json();
  }
}

class User {
  static get token() {
    return JSON.parse(sessionStorage.getItem("user"))?.token;
  }

  static setToken(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  static deleteToken() {
    sessionStorage.removeItem("user");
  }

  static get isLogin() {
    return this.token ? true : false;
  }
}

class Navigation {
  static to(to) {
    location.href = to;
  }
}

class ErrorHandler {
  static createElement({ status, sorry, statusText }) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-container");

    if (status)
      errorContainer.innerHTML += `<h3 class="error__status">${status}</h3>`;
    if (statusText)
      errorContainer.innerHTML += `<p class="error__text">${statusText}</p>`;
    if (sorry) errorContainer.innerHTML += `<p class="error__sorry">${sorry}</p>`;

    return errorContainer;
  }
}

class ErrorJson {
  constructor({ status, sorry, statusText }) {
    this.status = status;
    this.sorry = sorry;
    this.statusText = statusText;
  }
}