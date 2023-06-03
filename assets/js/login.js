function isLogin() {
  const token = localStorage.getItem("token");
  return token !== null;
}

function loadConfig() {
  return fetch('config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Impossible de charger la configuration');
      }
      return response.json();
    });
}

function handleSubmit(e) {
  e.preventDefault();

  const targetEl = e.target;

  if (!targetEl.reportValidity()) {
    return;
  }

  const errorMessageEl = document.querySelector(".errorMessage");
  if (errorMessageEl) {
    errorMessageEl.remove();
  }

  const [email, password] = getEmailAndPassword();

  if (!email) {
    insertErrorMessageElement("Saisissez votre adresse e-mail!");
    return;
  }

  if (!password) {
    insertErrorMessageElement("Saisissez votre mot de passe!");
    return;
  }

  loadConfig()
    .then(config => loginUser(config, email, password))
    .then(result => {
      if (result.isAdmin) {
        // Si l'utilisateur connecté est un administrateur, redirigez vers la page d'administration
        window.location.href = "../admin";
      } else {
        // Sinon, redirigez vers la page principale
        window.location.href = "../";
      }
    })
    .catch(error => {
      if (error instanceof ErrorJson) {
        insertErrorMessageElement(error.sorry);
      } else {
        console.error(error);
      }
    });
}

function getEmailAndPassword() {
  const inputs = document.querySelectorAll('#loginForm input:not(input[type="submit"])');
  return Array.from(inputs).map(({ value }) => value || "");
}

function insertErrorMessageElement(errorMessage) {
  const targetEl = document.querySelector("#loginForm");
  targetEl.insertAdjacentHTML(
    "afterbegin",
    `<p class="errorMessage">${errorMessage}</p>`
  );
}

function loginUser(config, email, password) {
  return fetch(`${config.api}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ email, password }),
  })
  .then(res => {
    if (res.status !== 200) {
      const { status, statusText } = res;
      throw new ErrorJson({
        status: status,
        sorry: "Votre e-mail ou votre mot de passe est incorrect!",
        statusText: statusText,
      });
    }
    return res.json();
  });
}

if (isLogin()) {
  window.location.href = "../";
} else {
  document.querySelector("#loginForm").addEventListener("submit", handleSubmit);
}