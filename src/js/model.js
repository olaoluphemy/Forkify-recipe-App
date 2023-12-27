import { API_URL, KEY, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";
import { sendJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    recipes: [],
    recipeResults: [],
    curPage: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (recipe) {
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

    if (!bookmarks) return;

    state.bookmarks = bookmarks;

    if (state.bookmarks.some((rec) => rec.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    const { recipes } = data.data;

    state.search.recipeResults = recipes.map((rec) => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        id: rec.id,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.curPage = 1;
  } catch (err) {
    throw err;
  }
};

export const setSearchResultsPage = function (page = state.search.curPage) {
  state.search.numPages = Math.ceil(
    state.search.recipeResults.length / state.search.resultPerPage
  );
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  state.search.recipes = state.search.recipeResults.slice(start, end);

  state.search.curPage = page;
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    (ing) =>
      (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmarks = function (recipe) {
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  state.bookmarks.push(recipe);
  persistBookmarks();
};

export const deleteBookmarks = function (id) {
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  const index = state.bookmarks.findIndex((el) => el.id === id);

  state.bookmarks.splice(index, 1);
  persistBookmarks();
};

export const uploadRecipe = async function (formData) {
  try {
    const object = Object.fromEntries(formData);

    const ingredients = formData
      .filter((ing) => ing[0].startsWith("ingredient") && ing[1] !== "")
      .map((ing) => {
        if (ing[1].split(",").length !== 3)
          throw new Error("invalid format, please try again :(");
        const ings = ing[1].trim().split(",");
        return {
          quantity: ings[0] || null,
          unit: ings[1],
          description: ings[2],
        };
      });

    const recipe = {
      cooking_time: +object.cookingTime,
      image_url: object.image,
      publisher: object.publisher,
      servings: +object.servings,
      source_url: object.sourceUrl,
      ingredients,
      title: object.title,
    };

    const data = await getJSON(`${API_URL}?key=${KEY}`, recipe);

    const newRecipe = data.data.recipe;
    state.recipe = createRecipeObject(newRecipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const items = localStorage.getItem("bookmarks");
  if (items) state.bookmarks = JSON.parse(items);
};

init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

// clearBookmarks();
