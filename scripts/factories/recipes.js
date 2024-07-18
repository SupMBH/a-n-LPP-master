//création de la représentation visuelle des recettes en amont du processus de recherche proprement dit.
//définit la structure des objets recette et fournit des méthodes pour manipuler ces objets

function recipesFactory(data) {

    const { id, image, name, servings, ingredients, time, description, appliance, ustensils } = data;

    //On créé un tableau pour contenir les éléments du tableau "ingredients" des recettes
    const parsedIngredients = [];

    //On créé une boucle for pour accéder aux éléments du tableau ingredients
    for (let i = 0; i < ingredients.length; i++) {
        const { ingredient, quantity, unit } = ingredients[i];
        parsedIngredients.push({ ingredient, quantity, unit });
    }   

    //Variable pour afficher les photos associées aux recettes
    const images = `assets/recipes/${image} `;

    //Cette fonction va manipuler le DOM pour afficher les informations associées à chaque recette
    function getRecipeCardDOM() {

        //Création de l'article qui contiendra les médias des photographes, avec un attribut ID et une classe CSS
        const article = document.createElement("article");
        article.setAttribute("id", id);
        article.className = "recipe-article";

        //On construit les différents éléments pour afficher l'image. Pour l'alt, on utilise le nom de l'image
        const img = document.createElement("img");
        //Avec .dataset, on accède à l'ID associé à l'image, puis on lui attribue une classe CSS
        img.dataset.id = id
        img.className = "recipe-image";
        img.setAttribute("src", images);
        img.setAttribute("alt", name);
        article.appendChild(img);

        //On créé un div contenant les informations sur la recette
        const recipeInfo = document.createElement("div");
        recipeInfo.className = "recipe-info";
        article.appendChild(recipeInfo);

        //On créé un titre h2 pour le titre des recettes
        const recipeName = document.createElement("h2");
        recipeName.textContent = name
        recipeInfo.appendChild(recipeName);

        //On créé un p pour afficher le temps demandé par la recette
        const recipeTime = document.createElement ("p");
        recipeTime.textContent = time + "min";
        recipeTime.className = "recipe-time"
        article.appendChild(recipeTime);

        //On créé un div qui va contenir la description de la recette
        const recipeDescription = document.createElement("div");
        recipeDescription.className = "recipe-container";
        
        //On créé un div pour afficher le titre "recette"
        const recipeDescriptionTitle = document.createElement("h3");
        recipeDescriptionTitle.textContent = "Recette";
        recipeDescriptionTitle.className = "recipe-ingredients-title";
        recipeDescription.appendChild(recipeDescriptionTitle);

        //On créé un paragraphe pour le texte de description de recette
        const recipeDescriptionText = document.createElement("p");
        recipeDescriptionText.className = "recipe-description-text";
        recipeDescriptionText.textContent = description;
        recipeDescription.appendChild(recipeDescriptionText);

        //On créé une section qui va contenir la liste des ingrédients
        const recipeIngredients = document.createElement("div")
        recipeIngredients.className = "ingredients-container"

        //On créé un div pour afficher le titre "ingrédients"
        const recipeIngredientsTitle = document.createElement("h3");
        recipeIngredientsTitle.textContent = "Ingrédients";
        recipeIngredientsTitle.className = "recipe-ingredients-title";
        recipeDescription.appendChild(recipeIngredientsTitle);


        //Fonction pour créer le container des ingrédients
        function createIngredientElement(ingredient, quantity, unit) {
            //On créé un div pour contenir les ingrédients
            const ingredientQuantityUnit = document.createElement("div");
            ingredientQuantityUnit.className = "ingredient-block"
        
            //On créé un p qui va contenir le nom de l'ingrédient
            const ingredientNameElement = document.createElement("p");
            ingredientNameElement.textContent = ingredient;
            ingredientNameElement.className = "ingredient-name"
            ingredientQuantityUnit.appendChild(ingredientNameElement);
        
            //On créé un paragraphe qui contiendra la quantité
            const quantityUnitElement = document.createElement("p");
            quantityUnitElement.className = "ingredient-quantity";
            if (quantity && unit) {
                //Si on a quantity et unit, on affiche les deux ensemble
                quantityUnitElement.textContent = `${quantity} ${unit}`;
              } else if (quantity) {
                //Si l'ingrédient n'a pas de "unit", on affiche uniquement la quantité
                quantityUnitElement.textContent = quantity.toString();
              } else {
                //S'il n'y a ni quantité ni unit, on affiche uniquement un tiret
                quantityUnitElement.textContent = "-";
              }

            ingredientQuantityUnit.appendChild(quantityUnitElement);
        
            return ingredientQuantityUnit;
        }

        //Pour chaque ingrédient, on créé l'élément correspondant
        ingredients.forEach((ingredient) => {
            const ingredientElement = createIngredientElement(
                ingredient.ingredient,
                ingredient.quantity,
                ingredient.unit
            );
            recipeIngredients.appendChild(ingredientElement);
        });

        recipeDescription.appendChild(recipeIngredients);
        recipeInfo.appendChild(recipeDescription);
    
        return article;

    }

    return { getRecipeCardDOM };
}