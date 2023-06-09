// La fonction requestLogin effectue une requête POST vers l'URL "http://localhost:5678/api/users/login"
// avec les informations d'identification (email et mot de passe) fournies.
// Elle renvoie la promesse renvoyée par la fonction fetch().
function requestLogin() {
  return fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      "email": stockInputEmail,
      "password": stockInputPassword,
    })
  });
}

// Sélection des éléments du DOM
const inputPassword = document.querySelector('input[type="password"]');
const inputEmail = document.querySelector('input[type="email"]');
const submit = document.querySelector('input[type="submit"]');
const errorDisplay = document.querySelector('.error');
const login = document.getElementById("login");

// Variables pour stocker les valeurs des champs email et mot de passe
let stockInputPassword = inputPassword.value;
let stockInputEmail = inputEmail.value;

// Événement déclenché lors du clic sur le bouton de soumission
submit.addEventListener('click', (e) => {
  e.preventDefault();
  // Mise à jour des variables avec les nouvelles valeurs des champs email et mot de passe
  stockInputEmail = inputEmail.value;
  stockInputPassword = inputPassword.value;
  // Appel de la fonction requestLogin pour envoyer la requête et obtenir la réponse
  requestLogin()
    .then((response) => response.json())
    .then(loginResponse => {
      console.log(loginResponse);
      // Vérification si un jeton (token) est présent dans la réponse
      if (loginResponse.token) {
        // Stockage du jeton dans le stockage local (localStorage)
        localStorage.setItem('token', loginResponse.token);
        // Définition de la variable isUserLogged à true pour indiquer que l'utilisateur est connecté
        isUserLogged = true;
        // Redirection vers la page "./index.html"
        window.location.href = "./index.html";
        console.log("Utilisateur connecté");
      } else {
        // Affichage d'une erreur si le jeton n'est pas trouvé dans la réponse
        console.error("Le token n'a pas été trouvé");
        errorDisplay.innerHTML = "Identifiant ou Mot de passe incorrect";
      }
    });
});

// Événement déclenché lors de la modification de la valeur du champ email
inputEmail.addEventListener('input', (e) => {
  console.log(e.target.value);
});

// Événement déclenché lors de la modification de la valeur du champ mot de passe
inputPassword.addEventListener('input', (e) => {
  console.log(e.target.value);
});