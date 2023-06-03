loadConfig()
  .then(handleConfig)
  .catch(handleError);

function handleConfig(config) {
  const { api } = config;

  if (!api) {
    console.warn("api not found");
    return;
  }

  Promise.all([
    fetchData(`${api}/works`),
    fetchData(`${api}/categories`)
  ])
    .then(handleData.bind(null, config))
    .catch(handleError);
}

function handleData(config, [works, categories]) {
  const gallery = document.querySelector(".gallery");

  if (!works || !categories) {
    gallery.innerHTML = `<p class="error-container">Projets indisponible!</p>`;
    return;
  }

  const loginLinkEl = document.querySelector(".login-link");

  isLogin() ? admin() : visitor();

  function visitor() {
    const gallery = new Gallery(works, categories);
    gallery.initGallerySelector(".gallery");
  }

  function admin() {
    const dashboard = new Dashboard(works, categories, config.api);
    dashboard.initGallerySelector(".gallery");

    loginLinkEl.innerHTML = "logout";
    loginLinkEl.addEventListener("click", onDisconnect, { once: true });

    function onDisconnect(e) {
      e.preventDefault();
      dashboard.onDisconnectUser(e);
      loginLinkEl.innerHTML = "login";
    }
  }
}

function handleError(error) {
  const gallery = document.querySelector(".gallery");

  if (error instanceof ErrorJson) {
    console.warn(error);
    const errorBoundary = elementCatchError(error);
    gallery.insertAdjacentElement("beforeend", errorBoundary);
  } else {
    console.error(error);
    gallery.innerHTML = `<p class="error-container">Projets indisponible!</p>`;
  }
}

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new ErrorJson({
      status: res.status ? res.status : 500,
      sorry: "Oups! Il y a un problème",
      statusText: res.statusText,
    });
  }
  return res.json();
}

// La fonction fetchData a été créée pour gérer les requêtes HTTP et les erreurs associées.