async function loadConfig() {
  const response = await fetch('config.json');
  if (!response.ok) {
    throw new Error('Impossible de charger la configuration');
  }
  const config = await response.json();
  return config;
}

function isLogin() {
  return false;
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

loadConfig()
  .then(async (config) => {
    const { api } = config;

    if (!api) {
      console.warn("api not found");

      return;
    }

    try {
      const datas = await Promise.all(
        ["works", "categories"].map((path) =>
          fetch(`${config.api}/${path}`)
            .then((res) => (res.ok ? res.json() : res))
            .catch((err) => err)
        )
      );

      if (datas[0] instanceof Response || datas[0] instanceof TypeError) {
        const { status, statusText } = datas[0];

        throw new ErrorJson({
          status: status ? status : 500,
          sorry: "Oups! Il y a un problème",
          statusText: statusText,
        });
      }

      const loginLinkEl = document.querySelector(".login-link");

      if (isLogin()) {
        admin();
      } else {
        visitor();
      }

      function visitor() {
        const gallery = new Gallery(...datas);

        gallery.initGallerySelector(".gallery");
      }

      function admin() {
        const dashboard = new Dashboard(...datas, api);

        dashboard.initGallerySelector(".gallery");

        loginLinkEl.innerHTML = "logout";

        loginLinkEl.addEventListener("click", onDisconnect, { once: true });

        function onDisconnect(e) {
          e.preventDefault();

          dashboard.onDisconnectUser(e);

          loginLinkEl.innerHTML = "login";
        }
      }
    } catch (error) {
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
  })
  .catch(handleError);

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