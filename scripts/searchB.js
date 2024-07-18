/*
scripts/searchB.js
Utilise des boucles pour parcourir les recettes et vérifier les critères de recherche.
Filtre les recettes en vérifiant les mots-clés dans le nom, la description, et les ingrédients.
Met à jour les listes déroulantes pour les filtres (ingrédients, appareils, ustensiles).

scripts/searchF.js
Utilise des méthodes fonctionnelles (filter, map) pour effectuer la recherche.
Filtre les recettes de manière similaire en vérifiant les mots-clés et les filtres sélectionnés.
Simplifie le code en utilisant des fonctions de haute ordre pour manipuler les tableaux.
*/

// METHODE A BOUCLES

// Sélection des éléments du DOM
const ingredientList = document.querySelector(".ingredient-list");
const applianceList = document.querySelector(".appliance-list");
const utensilList = document.querySelector(".utensil-list");
const filterSection = document.querySelector(".filter-section");
const filtersAdded = document.querySelector(".filters-added");
const filtersDiv = document.querySelector(".filter-container");
const mainSearch = document.querySelector(".main-search");
const clearSearchIcon = document.querySelector(".clear-search");
const recipesSection = document.querySelector(".recipes-section");

// Initialisation des tableaux pour stocker les éléments uniques
const uniqueIngredients = [];
const uniqueAppliances = [];
const uniqueUtensils = [];

const filteredIngredients = [];
const filteredAppliances = [];
const filteredUtensils = [];

// Fonction pour normaliser le texte (mettre en minuscules)
function textNormalize(word) {
  return word.toLowerCase();
}

// Boucle sur chaque recette pour extraire les ingrédients, appareils et ustensiles uniques
for (const recipe of recipes) {
  for (const recipeIngredient of recipe.ingredients) {
    const ingredient = recipeIngredient.ingredient;
    const normalizedIngredient = textNormalize(ingredient);

    if (!uniqueIngredients.includes(normalizedIngredient)) {
      uniqueIngredients.push(normalizedIngredient);
    }
  }

  const appliance = recipe.appliance;
  const normalizedAppliance = textNormalize(appliance);

  if (!uniqueAppliances.includes(normalizedAppliance)) {
    uniqueAppliances.push(normalizedAppliance);
  }

  for (const utensil of recipe.ustensils) {
    const normalizedUtensil = textNormalize(utensil);

    if (!uniqueUtensils.includes(normalizedUtensil)) {
      uniqueUtensils.push(normalizedUtensil);
    }
  }
}

// Fonction pour filtrer les recettes en fonction des critères de recherche et des filtres
function filterRecipes() {
  const searchValue = textNormalize(mainSearch.value);
  const searchWords = searchValue.split(/\s+/).filter(word => word.length >= 3);

  const filteredRecipes = recipes.filter(recipe => {
    const lowerCaseName = textNormalize(recipe.name);
    const lowerCaseDescription = textNormalize(recipe.description);

    const matchesSearchWords = searchWords.every(word =>
      lowerCaseName.includes(word) ||
      lowerCaseDescription.includes(word) ||
      recipe.ingredients.some(ingredient =>
        textNormalize(ingredient.ingredient).includes(word)
      )
    );

    const selectedIngredients = selectedFilters.ingredients.map(textNormalize);
    const selectedAppliances = selectedFilters.appliances.map(textNormalize);
    const selectedUtensils = selectedFilters.utensils.map(textNormalize);

    const hasSelectedIngredients = selectedIngredients.every(ingredient =>
      recipe.ingredients.some(item => textNormalize(item.ingredient) === ingredient)
    );

    const hasSelectedAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(textNormalize(recipe.appliance));

    const hasSelectedUtensils = selectedUtensils.every(utensil =>
      recipe.ustensils.some(item => textNormalize(item) === utensil)
    );

    return matchesSearchWords && hasSelectedIngredients && hasSelectedAppliance && hasSelectedUtensils;
  });

  if (filteredRecipes.length === 0) {
    displayData([]);
    return;
  }

  displayData(filteredRecipes);
  filterDropdownLists(filteredRecipes);
}

// Initialisation des filtres sélectionnés
const selectedFilters = {
  ingredients: [],
  appliances: [],
  utensils: []
};

// Fonction pour afficher les filtres sélectionnés
function displayFilters() {
  filtersAdded.appendChild(filtersDiv);
  filtersDiv.innerHTML = "";

  Object.entries(selectedFilters).forEach(([filterType, filterValues]) => {
    const activeFilters = filterValues.filter(value => value);

    activeFilters.forEach(value => {
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("new-filter");
      filtersDiv.appendChild(filterContainer);

      const filterValueSpan = document.createElement("span");
      filterValueSpan.textContent = value;
      filterContainer.appendChild(filterValueSpan);

      const removeFilterButton = document.createElement("i");
      removeFilterButton.classList.add("fa-solid", "fa-xmark");
      filterContainer.appendChild(removeFilterButton);

      removeFilterButton.addEventListener("click", () => {
        const updatedFilterValues = selectedFilters[filterType].filter(item => item !== value);
        selectedFilters[filterType] = updatedFilterValues;

        const dropdownMenus = filterSection.querySelectorAll(".dropdown-menu");
        dropdownMenus.forEach((dropdownMenu) => {
          const filterItems = dropdownMenu.querySelectorAll(".list-element");
          filterItems.forEach((item) => {
            if (item.textContent === value) {
              item.classList.remove("selected");
            }
          });
        });

        filterRecipes();
        displayFilters();
      });
    });
  });
}

// Fonction pour créer un élément de liste
function createListItem(text, isSelected) {
  const listElement = document.createElement("p");
  listElement.classList.add("list-element");
  listElement.textContent = text;
  if (isSelected) {
    listElement.classList.add("selected");
  }
  return listElement;
}

// Fonction pour créer une liste déroulante
function createDropdownList(container, dropdownId, optionsSet, label) {
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  container.appendChild(dropdown);

  const dropdownToggle = document.createElement("div");
  dropdownToggle.classList.add("dropdown-toggle");
  dropdownToggle.tabIndex = 0;
  dropdown.appendChild(dropdownToggle);

  const titleElement = document.createElement("h3");
  titleElement.textContent = label;
  dropdownToggle.appendChild(titleElement);

  const dropdownIcon = document.createElement("i");
  dropdownIcon.classList.add("fa-solid", "fa-angle-down");
  dropdownToggle.appendChild(dropdownIcon);

  const dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");
  dropdown.appendChild(dropdownMenu);

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.classList.add("search-input");
  dropdownMenu.appendChild(searchInput);

  const clearSearchIconDropdown = document.createElement("i");
  clearSearchIconDropdown.classList.add("clear-icon", "fa-solid", "fa-xmark");
  searchInput.parentNode.insertBefore(clearSearchIconDropdown, searchInput.nextSibling);

  const searchIcon = document.createElement("i");
  searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
  searchInput.parentNode.insertBefore(searchIcon, searchInput);

  optionsSet.forEach(option => {
    const listElement = createListItem(option, false);
    dropdownMenu.appendChild(listElement);
  });

  dropdownToggle.addEventListener("click", () => {
    dropdown.classList.toggle("open");
    const dropdownIcon = dropdownToggle.querySelector("i");
    dropdownIcon.classList.toggle("fa-angle-up", dropdown.classList.contains("open"));
    dropdownIcon.classList.toggle("fa-angle-down", !dropdown.classList.contains("open"));
  });

  const listItems = Array.from(dropdownMenu.querySelectorAll(".list-element"));

  listItems.forEach(listElement => {
    listElement.addEventListener("click", () => {
      const selectedValue = listElement.textContent;
      const isSelected = listElement.classList.contains("selected");

      if (isSelected) {
        listElement.classList.remove("selected");
        const updatedFilterValues = selectedFilters[dropdownId].filter(item => item !== selectedValue);
        selectedFilters[dropdownId] = updatedFilterValues;
      } else {
        listElement.classList.add("selected");
        selectedFilters[dropdownId].push(selectedValue);
      }

      filterRecipes();
      displayFilters();
    });
  });

  searchInput.addEventListener("input", () => {
    const searchValue = textNormalize(searchInput.value);
    const filteredSet =
      dropdownId === "ingredients"
        ? filteredIngredients
        : dropdownId === "appliances"
        ? filteredAppliances
        : filteredUtensils;

    listItems.forEach(item => {
      const text = textNormalize(item.textContent);
      item.style.display = text.includes(searchValue) && filteredSet.has(textNormalize(text)) ? "" : "none";
    });

    clearSearchIconDropdown.style.display = searchInput.value.trim() !== "" ? "block" : "none";
  });

  clearSearchIconDropdown.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
  });
}

// Création des listes déroulantes pour les ingrédients, les appareils et les ustensiles
createDropdownList(ingredientList, "ingredients", uniqueIngredients, "Ingrédients");
createDropdownList(applianceList, "appliances", uniqueAppliances, "Appareils");
createDropdownList(utensilList, "utensils", uniqueUtensils, "Ustensiles");

filterSection.appendChild(ingredientList);
filterSection.appendChild(applianceList);
filterSection.appendChild(utensilList);

// Fonction pour filtrer les listes déroulantes en fonction des recettes filtrées
function filterDropdownLists(filteredRecipes) {
  const ingredientItems = ingredientList.querySelectorAll(".list-element");
  const applianceItems = applianceList.querySelectorAll(".list-element");
  const utensilItems = utensilList.querySelectorAll(".list-element");

  filteredIngredients.length = 0;
  filteredAppliances.length = 0;
  filteredUtensils.length = 0;

  filteredRecipes.forEach(recipe => {
    filteredAppliances.push(textNormalize(recipe.appliance));
    recipe.ustensils.forEach(utensil => filteredUtensils.push(textNormalize(utensil)));
    recipe.ingredients.forEach(ingredientData => filteredIngredients.push(textNormalize(ingredientData.ingredient)));
  });

  function shouldDisplayItem(itemText, set) {
    return set.includes(itemText);
  }

  ingredientItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredIngredients) ? "" : "none";
  });

  applianceItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredAppliances) ? "" : "none";
  });

  utensilItems.forEach(item => {
    const itemText = textNormalize(item.textContent);
    item.style.display = shouldDisplayItem(itemText, filteredUtensils) ? "" : "none";
  });
}

// Fonction pour afficher ou masquer l'icône de suppression de la recherche
function toggleClearSearchIcon() {
  clearSearchIcon.style.display = mainSearch.value.trim() !== "" ? "inline-block" : "none";
}

// Initialisation de la recherche principale au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  mainSearch.value = "";
  toggleClearSearchIcon();
});

// Gestion de l'entrée de la recherche principale
mainSearch.addEventListener("input", () => {
  toggleClearSearchIcon();
  filterRecipes();
});

// Gestion du clic sur l'icône de suppression de la recherche
clearSearchIcon.addEventListener("click", () => {
  mainSearch.value = "";
  toggleClearSearchIcon();
  filterRecipes();
});

// Fermeture des listes déroulantes
const dropdowns = document.querySelectorAll(".dropdown");

function closeDropdowns() {
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove("open");
  });
}

// Gestion de la fermeture des listes déroulantes lorsque l'utilisateur clique en dehors
document.addEventListener("mousedown", (event) => {
  const isClickInsideDropdown = event.target.closest(".dropdown");
  if (!isClickInsideDropdown) {
    closeDropdowns();
    const dropdownIcons = document.querySelectorAll(".dropdown-toggle i");
    dropdownIcons.forEach(icon => {
      icon.classList.remove("fa-angle-up");
      icon.classList.add("fa-angle-down");
    });
  }
});
