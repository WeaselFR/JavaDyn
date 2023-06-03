class Gallery {
  indexCategoryPrevious = 0;
  workCardEls = [];
  filterButtonEls = [];
  gallery = null;
  filter = null;

  constructor(listWork, listCategory) {
    this.listWork = listWork;
    this.listCategory = listCategory;
    this.onFilterWorkEls = this.onFilterWorkEls.bind(this);
  }

  createFilterContainer() {
    const filter = document.createElement("div");
    filter.classList.add("filter");
    return filter;
  }

  createFilterButton(category, isActive = false) {
    const filterButton = document.createElement("button");
    filterButton.classList.add("filter-btn");
    if (isActive) filterButton.classList.add("active");
    filterButton.setAttribute("data-category-id", category.id);
    filterButton.innerText = category.name;
    this.filterButtonEls.push(filterButton);
  }

  insertFilterButton() {
    this.filterButtonEls.forEach((filterButtonEl) =>
      this.filter.insertAdjacentElement("beforeend", filterButtonEl)
    );
  }

  createWorkCardEl(work) {
    const workCardEl = document.createElement("figure");
    workCardEl.setAttribute("data-category-id", work.categoryId);
    workCardEl.setAttribute("data-id", work.id);
    workCardEl.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
      <figcaption>${work.title}</figcaption>`;
    this.workCardEls.push(workCardEl);
    return workCardEl;
  }

  insertGalleryWorks(workEls) {
    workEls.forEach((workEl) =>
      this.gallery.insertAdjacentElement("beforeend", workEl)
    );
  }

  insertGalleryFilter() {
    if (this.filter === null) return;
    this.gallery.insertAdjacentElement("beforebegin", this.filter);
  }

  onFilterWorkEls(e) {
    e.preventDefault();
    const btn = e.target;
    const btnCategoryId = btn.getAttribute("data-category-id");

    if (this.indexCategoryPrevious == btnCategoryId) return;

    this.indexCategoryPrevious = Number(btnCategoryId);
    this.filterButtonEls.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
    this.gallery.innerHTML = "";

    const listWorkFiltered = btnCategoryId == 0
      ? this.workCardEls
      : this.workCardEls.filter((workEl) => workEl.getAttribute("data-category-id") == btnCategoryId);

    this.insertGalleryWorks(listWorkFiltered);
  }

  initGallerySelector(selectors) {
    this.gallery = document.querySelector(selectors);
    this.filter = this.createFilterContainer();
    this.insertGalleryFilter();
    this.listWork.forEach((work) => this.createWorkCardEl(work));
    this.insertGalleryWorks(this.workCardEls);
    this.createFilterButton({ name: "Tous", id: 0 }, true);
    this.listCategory.forEach((category) => this.createFilterButton(category));
    this.insertFilterButton();
    this.filterButtonEls.forEach((filterBtn) =>
      filterBtn.addEventListener("click", this.onFilterWorkEls)
    );
  }
}

// Simplification de la méthode onFilterWorkEls en utilisant une condition ternaire pour déterminer listWorkFiltered.
