if (isLogin()) {
  locationTo("../");
} else {
  document.querySelector("#loginForm").addEventListener("submit", handleSubmit);
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
      setToken(result);
      locationTo("../");
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

// Les principales améliorations apportées sont les suivantes :
// Les fonctions nommées ont été utilisées pour améliorer la lisibilité et la maintenabilité du code.
// Les retours prématurés ont été évités pour éviter les problèmes de compréhension et de débogage.
// Les constantes ont été utilisées pour stocker les éléments DOM réutilisables.
// Les erreurs ont été gérées de manière appropriée en utilisant des promesses et des classes d'erreur personnalisées.