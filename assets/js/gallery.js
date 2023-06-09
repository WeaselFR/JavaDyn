class Gallery {
  // Propriétés de la classe
  indexCategoryPrevious = 0; // Index de la catégorie précédente
  workCardEls = []; // Tableau pour stocker les éléments de carte de travail
  filterButtonEls = []; // Tableau pour stocker les éléments de bouton de filtrage
  gallery = null; // Élément de la galerie
  filter = null; // Élément du filtre

  // Constructeur de la classe
  constructor(listWork, listCategory) {
    this.listWork = listWork; // Liste des travaux
    this.listCategory = listCategory; // Liste des catégories
    this.onFilterWorkEls = this.onFilterWorkEls.bind(this); // Liaison de la méthode onFilterWorkEls avec la classe
  }

  // Méthode pour créer un conteneur de filtre
  createFilterContainer() {
    const filter = document.createElement("div"); // Crée un élément de div pour le filtre
    filter.classList.add("filter"); // Ajoute une classe CSS "filter" à l'élément
    return filter; // Renvoie l'élément de filtre créé
  }

  // Méthode pour créer un bouton de filtrage
  createFilterButton(category, isActive = false) {
    const filterButton = document.createElement("button"); // Crée un élément de bouton pour le filtrage
    filterButton.classList.add("filter-btn"); // Ajoute une classe CSS "filter-btn" à l'élément
    if (isActive) filterButton.classList.add("active"); // Ajoute une classe CSS "active" si le bouton est actif
    filterButton.setAttribute("data-category-id", category.id); // Définit l'attribut "data-category-id" avec l'ID de la catégorie
    filterButton.innerText = category.name; // Définit le texte du bouton avec le nom de la catégorie
    this.filterButtonEls.push(filterButton); // Ajoute le bouton de filtrage au tableau des éléments de bouton de filtrage
  }

  // Méthode pour insérer les boutons de filtrage dans le conteneur de filtre
  insertFilterButton() {
    this.filterButtonEls.forEach((filterButtonEl) =>
      this.filter.insertAdjacentElement("beforeend", filterButtonEl)
    ); // Insère chaque élément de bouton de filtrage à l'intérieur du conteneur de filtre
  }

  // Méthode pour créer un élément de carte de travail
  createWorkCardEl(work) {
    const workCardEl = document.createElement("figure"); // Crée un élément de figure pour la carte de travail
    workCardEl.setAttribute("data-category-id", work.categoryId); // Définit l'attribut "data-category-id" avec l'ID de la catégorie du travail
    workCardEl.setAttribute("data-id", work.id); // Définit l'attribut "data-id" avec l'ID du travail
    workCardEl.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
      <figcaption>${work.title}</figcaption>`; // Définit le contenu HTML de l'élément de carte de travail
    this.workCardEls.push(workCardEl); // Ajoute l'élément de carte de travail au tableau des éléments de carte de travail
    return workCardEl; // Renvoie l'élément de carte de travail créé
  }

  // Méthode pour insérer les travaux de la galerie
  insertGalleryWorks(workEls) {
    workEls.forEach((workEl) =>
      this.gallery.insertAdjacentElement("beforeend", workEl)
    ); // Insère chaque élément de travail à l'intérieur de la galerie
  }

  // Méthode pour insérer le filtre de la galerie
  insertGalleryFilter() {
    if (this.filter === null) return; // Si le filtre est null, retourne immédiatement
    this.gallery.insertAdjacentElement("beforebegin", this.filter); // Insère le filtre juste avant le début de la galerie
  }

  // Méthode pour filtrer les éléments de travail
  onFilterWorkEls(e) {
    e.preventDefault(); // Empêche le comportement par défaut du clic
    const btn = e.target; // Récupère l'élément sur lequel le clic a été effectué
    const btnCategoryId = btn.getAttribute("data-category-id"); // Récupère l'ID de catégorie à partir de l'attribut "data-category-id" du bouton

    if (this.indexCategoryPrevious == btnCategoryId) return; // Si l'ID de catégorie est identique à l'ID de catégorie précédent, ne fait rien

    this.indexCategoryPrevious = Number(btnCategoryId); // Met à jour l'ID de catégorie précédent avec la nouvelle valeur
    this.filterButtonEls.forEach((btn) => btn.classList.remove("active")); // Supprime la classe CSS "active" de tous les boutons de filtrage
    btn.classList.add("active"); // Ajoute la classe CSS "active" au bouton actuel
    this.gallery.innerHTML = ""; // Vide le contenu de la galerie

    const listWorkFiltered = btnCategoryId == 0
      ? this.workCardEls
      : this.workCardEls.filter((workEl) => workEl.getAttribute("data-category-id") == btnCategoryId); // Filtre les éléments de carte de travail en fonction de l'ID de catégorie

    this.insertGalleryWorks(listWorkFiltered); // Insère les travaux filtrés dans la galerie
  }

  // Méthode pour initialiser le sélecteur de galerie
  initGallerySelector(selectors) {
    this.gallery = document.querySelector(selectors); // Sélectionne l'élément de galerie en utilisant les sélecteurs spécifiés
    this.filter = this.createFilterContainer(); // Crée l'élément de conteneur de filtre
    this.insertGalleryFilter(); // Insère le filtre dans la galerie
    this.listWork.forEach((work) => this.createWorkCardEl(work)); // Crée les éléments de carte de travail pour chaque travail dans la liste
    this.insertGalleryWorks(this.workCardEls); // Insère les éléments de carte de travail dans la galerie
    this.createFilterButton({ name: "Tous", id: 0 }, true); // Crée le bouton de filtrage "Tous" avec l'ID 0 et le marque comme actif
    this.listCategory.forEach((category) => this.createFilterButton(category)); // Crée les boutons de filtrage pour chaque catégorie dans la liste
    this.insertFilterButton(); // Insère les boutons de filtrage dans le conteneur de filtre
    this.filterButtonEls.forEach((filterBtn) =>
      filterBtn.addEventListener("click", this.onFilterWorkEls)
    ); // Ajoute un écouteur d'événement de clic à chaque bouton de filtrage pour appeler la méthode onFilterWorkEls lorsqu'un clic se produit
  }
}

