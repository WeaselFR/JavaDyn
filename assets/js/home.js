// Classe qui charge la configuration à partir d'un fichier JSON
async function loadConfig() {
  // Effectue une requête GET vers le fichier 'config.json'
  const response = await fetch('config.json');

  // Vérifie si la requête a réussi (code HTTP 200-299)
  if (!response.ok) {
    throw new Error('Impossible de charger la configuration');
  }

  // Convertit la réponse en objet JSON
  const config = await response.json();

  // Renvoie la configuration
  return config;
}

// Vérifie si l'utilisateur est connecté
function isLogin() {
  // Récupère le jeton (token) depuis le stockage local
  const token = localStorage.getItem("token");

  // Vérifie si le jeton est présent
  return token !== null;
}

// Gère les erreurs qui se produisent lors de l'exécution de l'application
function handleError(error) {
  // Sélectionne l'élément du DOM qui affiche la galerie
  const gallery = document.querySelector(".gallery");

  // Vérifie si l'erreur est une instance de la classe ErrorJson
  if (error instanceof ErrorJson) {
    console.warn(error);

    // Crée un élément d'erreur spécifique pour l'erreur JSON
    const errorBoundary = elementCatchError(error);

    // Insère l'élément d'erreur dans la galerie
    gallery.insertAdjacentElement("beforeend", errorBoundary);
  } else {
    console.error(error);

    // Affiche un message d'erreur générique dans la galerie
    gallery.innerHTML = `<p class="error-container">Projets indisponible!</p>`;
  }
}

// Classe utilitaire pour effectuer une requête HTTP GET et renvoyer les données JSON
async function fetchData(url) {
  // Effectue une requête GET vers l'URL spécifiée
  const res = await fetch(url);

  // Vérifie si la requête a réussi (code HTTP 200-299)
  if (!res.ok) {
    // Lance une erreur de type ErrorJson avec les détails de l'erreur HTTP
    throw new ErrorJson({
      status: res.status ? res.status : 500,
      sorry: "Oups! Il y a un problème",
      statusText: res.statusText,
    });
  }

  // Convertit la réponse en objet JSON
  return res.json();
}

// Chargement de la configuration initiale
loadConfig()
  .then(async (config) => {
    const { api } = config;

    // Vérifie si l'URL de l'API est présente dans la configuration
    if (!api) {
      console.warn("api not found");
      return;
    }

    try {
      // Effectue des requêtes parallèles pour obtenir les données de travail et les catégories
      const datas = await Promise.all(
        ["works", "categories"].map((path) =>
          // Effectue une requête GET vers l'API avec le chemin spécifié
          fetch(`${config.api}/${path}`)
            .then((res) => (res.ok ? res.json() : res))
            .catch((err) => err)
        )
      );

      // Vérifie si la première réponse est une instance de Response ou TypeError
      if (datas[0] instanceof Response || datas[0] instanceof TypeError) {
        const { status, statusText } = datas[0];

        // Lance une erreur de type ErrorJson avec les détails de l'erreur HTTP
        throw new ErrorJson({
          status: status ? status : 500,
          sorry: "Oups! Il y a un problème",
          statusText: statusText,
        });
      }

      // Sélectionne l'élément du DOM pour le lien de connexion
      const loginLinkEl = document.querySelector(".login-link");

      // Vérifie si l'utilisateur est connecté
      if (isLogin()) {
        admin();
      } else {
        visitor();
      }

      // Fonction pour l'affichage de la galerie en tant que visiteur
      function visitor() {
        // Crée une instance de la classe Gallery avec les données
        const gallery = new Gallery(...datas);

        // Initialise la galerie dans l'élément du DOM correspondant
        gallery.initGallerySelector(".gallery");
      }

      // Fonction pour l'affichage du tableau de bord en tant qu'administrateur
      function admin() {
        // Crée une instance de la classe Dashboard avec les données et l'API
        const dashboard = new Dashboard(...datas, api);

        // Initialise la galerie dans l'élément du DOM correspondant
        dashboard.initGallerySelector(".gallery");

        // Modifie le texte du lien de connexion en "logout"
        loginLinkEl.innerHTML = "logout";

        // Ajoute un écouteur d'événement pour la déconnexion de l'utilisateur
        loginLinkEl.addEventListener("click", onDisconnect, { once: true });

        // Fonction de déconnexion de l'utilisateur administrateur
        function onDisconnect(e) {
          e.preventDefault();

          // Effectue les actions de déconnexion dans le tableau de bord
          dashboard.onDisconnectUser(e);

          // Modifie le texte du lien de connexion en "login"
          loginLinkEl.innerHTML = "login";
        }
      }
    } catch (error) {
      // Sélectionne l'élément du DOM qui affiche la galerie
      const gallery = document.querySelector(".gallery");

      // Vérifie si l'erreur est une instance de la classe ErrorJson
      if (error instanceof ErrorJson) {
        console.warn(error);

        // Crée un élément d'erreur spécifique pour l'erreur JSON
        const errorBoundary = elementCatchError(error);

        // Insère l'élément d'erreur dans la galerie
        gallery.insertAdjacentElement("beforeend", errorBoundary);
      } else {
        console.error(error);

        // Affiche un message d'erreur générique dans la galerie
        gallery.innerHTML = `<p class="error-container">Projets indisponible!</p>`;
      }
    }
  })
  
  .catch(handleError);

// Fonction utilitaire pour effectuer une requête HTTP GET et renvoyer les données JSON
async function fetchData(url) {
  // Effectue une requête GET vers l'URL spécifiée
  const res = await fetch(url);

  // Vérifie si la requête a réussi (code HTTP 200-299)
  if (!res.ok) {
    // Lance une erreur de type ErrorJson avec les détails de l'erreur HTTP
    throw new ErrorJson({
      status: res.status ? res.status : 500,
      sorry: "Oups! Il y a un problème",
      statusText: res.statusText,
    });
  }

  // Convertit la réponse en objet JSON
  return res.json();
}