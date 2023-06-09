class Config {
  /**
   * Classe statique pour charger la configuration depuis un fichier JSON.
   */
  
  // Méthode statique asynchrone pour charger la configuration depuis un fichier JSON
  static async load() {
    const response = await fetch("./config.json"); // Effectue une requête pour récupérer le fichier config.json
    return await response.json(); // Renvoie la réponse sous forme de JSON
  }
}

class User {
  /**
   * Classe statique pour gérer les informations de l'utilisateur.
   */
  
  // Propriété statique qui récupère le token de l'utilisateur depuis sessionStorage
  static get token() {
    return JSON.parse(sessionStorage.getItem("user"))?.token;
  }

  // Méthode statique pour définir le token de l'utilisateur dans sessionStorage
  static setToken(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  // Méthode statique pour supprimer le token de l'utilisateur de sessionStorage
  static deleteToken() {
    sessionStorage.removeItem("user");
  }

  // Propriété statique qui vérifie si l'utilisateur est connecté en fonction de la présence du token
  static get isLogin() {
    return this.token ? true : false;
  }
}

class Navigation {
  /**
   * Classe statique pour gérer la navigation de l'application.
   */
  
  // Méthode statique pour naviguer vers une autre URL
  static to(to) {
    location.href = to; // Redirige l'utilisateur vers l'URL spécifiée
  }
}

class ErrorHandler {
  /**
   * Classe statique pour gérer les erreurs et afficher des messages d'erreur.
   */
  
  // Méthode statique pour créer un élément d'erreur à afficher dans l'interface utilisateur
  static createElement({ status, sorry, statusText }) {
    const errorContainer = document.createElement("div"); // Crée un élément de div pour contenir l'erreur
    errorContainer.classList.add("error-container"); // Ajoute une classe CSS "error-container" à l'élément

    if (status)
      errorContainer.innerHTML += `<h3 class="error__status">${status}</h3>`; // Ajoute un titre avec la classe CSS "error__status" si le statut est défini
    if (statusText)
      errorContainer.innerHTML += `<p class="error__text">${statusText}</p>`; // Ajoute un paragraphe avec la classe CSS "error__text" si le texte de statut est défini
    if (sorry)
      errorContainer.innerHTML += `<p class="error__sorry">${sorry}</p>`; // Ajoute un paragraphe avec la classe CSS "error__sorry" si le message d'excuse est défini

    return errorContainer; // Renvoie l'élément d'erreur créé
  }
}

class ErrorJson {
  /**
   * Classe pour représenter une erreur JSON avec ses propriétés.
   */
  
  constructor({ status, sorry, statusText }) {
    this.status = status; // Propriété pour stocker le statut de l'erreur
    this.sorry = sorry; // Propriété pour stocker le message d'excuse de l'erreur
    this.statusText = statusText; // Propriété pour stocker le texte de statut de l'erreur
  }
}