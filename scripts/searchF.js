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

//METHODE FONCTIONNELLE 

//Variables pour récupérer les classes CSS du HTML
const ingredientList = document.querySelector(".ingredient-list");
const applianceList = document.querySelector(".appliance-list");
const utensilList = document.querySelector(".utensil-list");
const filterSection = document.querySelector(".filter-section");
const filtersAdded = document.querySelector(".filters-added");
const filtersDiv = document.querySelector(".filter-container");
const mainSearch = document.querySelector(".main-search");
const clearSearchIcon = document.querySelector(".clear-search");
const recipesSection = document.querySelector(".recipes-section");

//Sets pour stocker les valeurs uniques des ingrédients, appareils et ustensiles
//Les Set() stockent des valeurs uniques de manière non ordonnée, contrairement aux tableaux
const uniqueIngredients = new Set();
const uniqueAppliances = new Set();
const uniqueUtensils = new Set();

//Sets pour stocker les valeurs filtrées des ingrédients, appareils et ustensiles
const filteredIngredients = new Set();
const filteredAppliances = new Set();
const filteredUtensils = new Set();

//Fonction pour normaliser la casse du texte, pour que tout soit en minuscule
//Cela va nous permettre d'éviter les doublons pour certains ingrédients qui sont parfois réécrits avec des majuscules
function textNormalize(word) {
  return word.toLowerCase();
}

//On extrait les valeurs uniques des ingrédients, appareils et ustensiles pour les stocker dans les Set()

//Pour les ingrédients, on utilise une boucle forEach, puis une méthode map
//La méthode map permet de parcourir un tableau pour en renvoyer les éléments dans un nouveau tableau
recipes.forEach(recipe => {
  recipe.ingredients.map(recipeIngredient => recipeIngredient.ingredient)
    .forEach(ingredient => uniqueIngredients.add(textNormalize(ingredient)));
});

//Pour les appareils, pas besoin de méthode forEach
recipes.map(recipe => textNormalize(recipe.appliance))
  .forEach(appliance => uniqueAppliances.add(appliance));

//Pour les ustensiles
recipes.map(recipe => recipe.ustensils.map(utensil => textNormalize(utensil)))
  .forEach(utensils => utensils.forEach(utensil => uniqueUtensils.add(utensil)));

////////////////////////// Filtrage des recettes //////////////////////////
//Fonction pour mettre à jour et afficher la liste des recettes mise à jour lorsqu'une recherche est effectuée
function filterRecipes() {
  const searchValue = textNormalize(mainSearch.value);
  //On utilise la méthode filter pour que la recherche démarre uniquement lorsque 3 caractères sont entrés
  const searchWords = searchValue.split(/\s+/).filter(word => word.length >= 3);

  //On utilise la méthode filter pour utiliser les fonctionnalités suivantes pour chaque recette du tableau recipes
  const filteredRecipes = recipes.filter(recipe => {
    const lowerCaseName = textNormalize(recipe.name);
    const lowerCaseDescription = textNormalize(recipe.description);

    //On utilise la méthode every pour vérifier si le contenu de la recherche correspond au nom, à la description ou aux ingrédients d'une recette
    const matchesSearchWords = searchWords.every(word =>
      lowerCaseName.includes(word) ||
      lowerCaseDescription.includes(word) ||
      recipe.ingredients.some(ingredient =>
        textNormalize(ingredient.ingredient).includes(word)
      )
    );
    
    //On normalise la casse de chaque ingrédient, appareils et ustensiles contenu dans selectedFilters
    const selectedIngredients = selectedFilters.ingredients.map(textNormalize);
    const selectedAppliances = selectedFilters.appliances.map(textNormalize);
    const selectedUtensils = selectedFilters.utensils.map(textNormalize);

    //On vérifie si les éléments entrés dans le tableau selectedIngredients correspondent aux ingrédients du tableau recipe.ingredients
    const hasSelectedIngredients = selectedIngredients.every(ingredient =>
      recipe.ingredients.some(item => textNormalize(item.ingredient) === ingredient)
    );
    
    //Pour les appareils, on vérifie uniquement si le tableau est vide ou non
    const hasSelectedAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(textNormalize(recipe.appliance));

    //Même chose que les ingrédients pour les ustensiles
    const hasSelectedUtensils = selectedUtensils.every(utensil =>
      recipe.ustensils.some(item => textNormalize(item) === utensil)
    );
    
    //Si la recette correspond aux informations données, on l'affiche sur la page
    return matchesSearchWords && hasSelectedIngredients && hasSelectedAppliance && hasSelectedUtensils;
  });

  //Si la liste de recettes est vide après filtrage, on appelle la fonction displayData
  //La fonction contiendra un tableau vide qui permettra d'afficher le message d'erreur
  if (filteredRecipes.length === 0) {
    displayData([]);
    return;
  }

  displayData(filteredRecipes);
  filterDropdownLists(filteredRecipes);
}

//Tableau pour stocker les filtres qui seront sélectionnés
const selectedFilters = {
  ingredients: [],
  appliances: [],
  utensils: []
};

//Fonction pour afficher les filtres lorsqu'ils sont sélectionnés
function displayFilters() {
  filtersAdded.appendChild(filtersDiv);
  filtersDiv.innerHTML = "";

  //On parcourt chaque propriété de selectedFilters avec la méthode Object.entries()
  Object.entries(selectedFilters).forEach(([filterType, filterValues]) => {

    //On utilise la méthode filter() pour ne garder que les filtres qui ont des valeurs
    const activeFilters = filterValues.filter(value => value);

    //On utilise la méthode map() pour créer les éléments DOM pour chaque filtre actif
    activeFilters.map(value => {
      //On créé le div du filtre
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("new-filter");
      filtersDiv.appendChild(filterContainer);

      //On créé un span qui contiendra le nom du filtre
      const filterValueSpan = document.createElement("span");
      filterValueSpan.textContent = value;
      filterContainer.appendChild(filterValueSpan);

      //On créé le bouton de suppression de filtre, une icone fontawesome
      const removeFilterButton = document.createElement("i");
      removeFilterButton.classList.add("fa-solid", "fa-xmark");
      filterContainer.appendChild(removeFilterButton);

      //On écoute l'évènement clic lorsqu'on appuie sur un filtre
      removeFilterButton.addEventListener("click", () => {
        //On utilise la méthode filter() pour créer un nouveau tableau sans le filtre à supprimer
        const updatedFilterValues = selectedFilters[filterType].filter(item => item !== value);
        selectedFilters[filterType] = updatedFilterValues;

        //On supprime l'aspect de filtre sélectionné dans la liste des filtres même lorsqu'on clique sur la fermeture du filtre dans la liste des filtres actifs
        const dropdownMenus = filterSection.querySelectorAll(".dropdown-menu");
        dropdownMenus.forEach((dropdownMenu) => {
          const filterItems = dropdownMenu.querySelectorAll(".list-element");
          filterItems.forEach((item) => {
            if (item.textContent === value) {
              item.classList.remove("selected");
            }
          });
        });

        //On met à jour les recettes filtrées et les filtres affichés
        filterRecipes();
        displayFilters();
      });
    });
  });
}

////////////////////////// Création des listes //////////////////////////
//Fonction pour créer un élément de liste avec gestion des classes sélectionnées
//La fonction prend l'argument "text" pour générer le contenu de la liste (ici, les ingrédients, ustensiles ou appareils)
//Elle prend également l'argument isSelected pour ajouter une classe CSS et changer l'apparence/le comportement si l'élément de liste est sélectionné
function createListItem(text, isSelected) {
  const listElement = document.createElement("p");
  listElement.classList.add("list-element");
  listElement.textContent = text;
  if (isSelected) {
    listElement.classList.add("selected");
  }
  return listElement;
}

//Fonction pour créer les 3 menus contenant les listes des ingrédients, appareils et ustensiles. Cette fonction prend 4 paramètres :
//Le premier, "container", pour définir le container où la liste sera créée
//Le second "dropdownId", pour définir un identifiant unique à chaque liste
//Le troisième "optionsSet" permet de définir l'ensemble des options de la liste, donc chaque élément qui sera listé
//Le quatrième, "label", est le label de la liste, ce qui sera écrit dessus pour savoir quelle liste on ouvre
function createDropdownList(container, dropdownId, optionsSet, label) {
    //On créé le div qui contiendra notre liste
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    container.appendChild(dropdown);

    //On créé un div qui servira à toggle l'affichage de liste, pour simuler une liste
    //Impossible d'utiliser <select> comme notre dropdown possède une barre de recherche, on simulera donc l'effet
    const dropdownToggle = document.createElement("div");
    dropdownToggle.classList.add("dropdown-toggle");
    dropdownToggle.tabIndex = 0;
    dropdown.appendChild(dropdownToggle);

    //On créé le label de la liste
    const titleElement = document.createElement("h3");
    titleElement.textContent = label;
    dropdownToggle.appendChild(titleElement);

    //On créé l'icone de flèche du menu dropdown
    const dropdownIcon = document.createElement("i");
    dropdownIcon.classList.add("fa-solid", "fa-angle-down");
    dropdownToggle.appendChild(dropdownIcon);

    //On créé la liste qui contiendra les éléments de liste
    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("dropdown-menu");
    dropdown.appendChild(dropdownMenu);

    //On créé la barre de recherche intégrée dans chaque menu dropdown
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("search-input");
    dropdownMenu.appendChild(searchInput);

    //On créé une icône de fermeture pour réinitialiser la barre de recherche intégrée
    const clearSearchIconDropdown = document.createElement("i");
    clearSearchIconDropdown.classList.add("clear-icon", "fa-solid", "fa-xmark");
    searchInput.parentNode.insertBefore(clearSearchIconDropdown, searchInput.nextSibling);

    //On créé l'icone loupe de la barre de recherche
    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
    searchInput.parentNode.insertBefore(searchIcon, searchInput);

    //Pour chaque option, on créé un nouvel élément de liste, grâce à la fonction createListItem
    optionsSet.forEach(option => {
      const listElement = createListItem(option, false);
      dropdownMenu.appendChild(listElement);
    });
    
    //On écoute l'évènement clic sur le dropdown, et grâce à la méthode toggle(), on change la visibilité de l'élément
    dropdownToggle.addEventListener("click", () => {
      dropdown.classList.toggle("open");
      const dropdownIcon = dropdownToggle.querySelector("i");
      dropdownIcon.classList.toggle("fa-angle-up", dropdown.classList.contains("open"));
      dropdownIcon.classList.toggle("fa-angle-down", !dropdown.classList.contains("open"));
    });
    
    const listItems = Array.from(dropdownMenu.querySelectorAll(".list-element"));

    //On créé une boucle forEach qui va permettre d'écouter le clic sur un élément de liste
    listItems.forEach(listElement => {
      listElement.addEventListener("click", () => {
        const selectedValue = listElement.textContent;
        const isSelected = listElement.classList.contains("selected");

        //Si l'élément de liste a déjà été sélectionné
        if (isSelected) {
          //On retire la classe qui met l'élément de liste en surbrillance
          listElement.classList.remove("selected");
          //On retire l'élément de listes des filtres lorsqu'on clique dessus
          const updatedFilterValues = selectedFilters[dropdownId].filter(item => item !== selectedValue);
          selectedFilters[dropdownId] = updatedFilterValues;
        } else {
          //Sinon, on le choisi et on rajoute un effet de surbrillance
          listElement.classList.add("selected");
          selectedFilters[dropdownId].push(selectedValue);
        }

        filterRecipes();
        displayFilters();
      });
    });
    
    //Ecoute de l'input sur la barre de recherche du menu des filtres
    searchInput.addEventListener("input", () => {
      const searchValue = textNormalize(searchInput.value);

      //On utilise les ensembles filtrés pour la recherche
      const filteredSet =
      dropdownId === "ingredients"
        ? filteredIngredients
        : dropdownId === "appliances"
        ? filteredAppliances
        : filteredUtensils;
      
      //On parcourt les éléments de liste pour normaliser le texte, et afficher les résultats de la recherche
      listItems.forEach(item => {
        const text = textNormalize(item.textContent);
        item.style.display = text.includes(searchValue) && filteredSet.has(textNormalize(text)) ? "" : "none";
      });
      
      //On change le style de la croix dans la barre de recherche des filtres, pour l'afficher ou non selon la présence de texte ou non
      clearSearchIconDropdown.style.display = searchInput.value.trim() !== "" ? "block" : "none";
    });

    //Ecoute de l'évènement clic sur l'icône de fermeture (croix) pour effacer le contenu de la barre de recherche
    clearSearchIconDropdown.addEventListener("click", () => {
        searchInput.value = "";
        //On déclenche l'évènement input pour mettre à jour les filtres
        searchInput.dispatchEvent(new Event("input")); 
    });
}

//On utilise la fonction que nous venons de créer en utilisant chaque paramètre pour créer les 3 listes d'ingrédients, appareils et ustensiles
createDropdownList(ingredientList, "ingredients", uniqueIngredients, "Ingrédients");
createDropdownList(applianceList, "appliances", uniqueAppliances, "Appareils");
createDropdownList(utensilList, "utensils", uniqueUtensils, "Ustensiles");

//On insère les listes en manipulant le DOM
filterSection.appendChild(ingredientList);
filterSection.appendChild(applianceList);
filterSection.appendChild(utensilList);

//Fonction pour filtrer les éléments de liste dans les listes d'ingrédients, d'ustensiles et d'appareils
function filterDropdownLists(filteredRecipes) {

  const ingredientItems = ingredientList.querySelectorAll(".list-element");
  const applianceItems = applianceList.querySelectorAll(".list-element");
  const utensilItems = utensilList.querySelectorAll(".list-element");

  //Ensembles pour stocker les valeurs uniques des ustensiles, appareils et ingrédients filtrés
  filteredIngredients.clear();
  filteredAppliances.clear();
  filteredUtensils.clear();

  //On utilise la méthode pour parcourir les recettes filtrées pour ajouter les éléments de liste aux ensembles filtrés
  filteredRecipes.map(recipe => {
    filteredAppliances.add(textNormalize(recipe.appliance));
    recipe.ustensils.map(utensil => filteredUtensils.add(textNormalize(utensil)));
    recipe.ingredients.map(ingredientData => filteredIngredients.add(textNormalize(ingredientData.ingredient)));
  });

  //Fonction pour vérifier si un élément de liste doit être affiché en fonction des ensembles filtrés
  function shouldDisplayItem(itemText, set) {
    return set.has(itemText);
  }

  //Pour chaque élément de liste, on masque ou on affiche en fonction des ensembles filtrés
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

//Fonction pour gérer l'affichage de la croix qui supprime le champ de recherche principal
function toggleClearSearchIcon() {
  clearSearchIcon.style.display = mainSearch.value.trim() !== "" ? "inline-block" : "none";
}
////////////////////////// Ecoute d'évènements //////////////////////////
//On réinitialise le champ de recherche principal lors du rechargement de la page
document.addEventListener("DOMContentLoaded", () => {
  mainSearch.value = "";
  //Cela permet par défaut de cacher la croix de suppression de texte
  mainSearch.dispatchEvent(new Event("input"));
});

//On écoute l'évènement input lorsqu'on entre du texte dans la barre de recherche principale
mainSearch.addEventListener("input", () => {
  //On active l'affichage de la croix de suppression lorsqu'un texte est entré
  toggleClearSearchIcon();
  //On filtre en temps réel les recettes
  filterRecipes();
});

//On écoute le clic de la croix de suppression qui sert à supprimer le texte entré dans la barre de recherche principale
clearSearchIcon.addEventListener("click", () => {
  //On vide la barre de recherche lors du clic
  mainSearch.value = "";
  //On cache la croix de suppression de texte
  toggleClearSearchIcon();
  //On filtre de nouveau les recettes
  filterRecipes();
});

const dropdowns = document.querySelectorAll(".dropdown");

//Fonction pour fermer toutes les listes déroulantes ouvertes
function closeDropdowns() {
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove("open");
  });
}

//Ecoute de l'évènement clic pour fermer les listes déroulantes lors d'un clic en dehors d'une liste
document.addEventListener("mousedown", (event) => {
    const isClickInsideDropdown = event.target.closest(".dropdown");
    if (!isClickInsideDropdown) {
      closeDropdowns();
      //On réinitialise les icones de flèches des menus lorsque les listes déroulantes sont fermées
      const dropdownIcons = document.querySelectorAll(".dropdown-toggle i");
      dropdownIcons.forEach(icon => {
          icon.classList.remove("fa-angle-up");
          icon.classList.add("fa-angle-down");
      });
    }
  });