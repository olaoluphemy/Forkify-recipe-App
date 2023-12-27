import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    resultsView.update(model.state.search.recipeResults);

    // 3) Render bookmarks
    if (model.state.bookmarks.length === 0) return;
    bookmarksView.update(model.state.bookmarks); // better for performance
    // bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    // Set initial search results
    model.setSearchResultsPage();

    // Render Search results
    resultsView.render(model.state.search.recipes);

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = async function (page) {
  try {
    // Set new search results
    model.setSearchResultsPage(page);

    // Render new search results
    resultsView.render(model.state.search.recipes);

    // Render new pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlUpdateServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlBookMarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const initializeBookmarks = function () {
  if (model.state.bookmarks.length === 0) return;
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (formData) {
  try {
    await model.uploadRecipe(formData);

    recipeView.render(model.state.recipe);
    const id = `#${model.state.recipe.id}`;

    window.history.pushState(null, "", id);
    addRecipeView.renderMessage();

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2000);

    // reset form
    setTimeout(function () {
      addRecipeView.render();
    }, 3000);
  } catch (err) {
    addRecipeView.renderError(err);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2000);

    // reset form
    setTimeout(function () {
      addRecipeView.render();
    }, 3000);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(initializeBookmarks);
  recipeView.addHandlerControlRecipes(controlRecipes);
  recipeView.addHandlerControlServings(controlUpdateServings);
  recipeView.addHandlerAddBookmarks(controlBookMarks);
  searchView.addHandlerSearchResults(controlSearchResults);
  paginationView.addHandlerControlPagination(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlUploadRecipe);
};

init();
