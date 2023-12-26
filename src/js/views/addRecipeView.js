import View from "./view.js";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _overlay = document.querySelector(".overlay");
  _openBtn = document.querySelector(".nav__btn--add-recipe");
  _closeBtn = document.querySelector(".btn--close-modal");
  _window = document.querySelector(".add-recipe-window");
  _data;
  _errorMessage = "No recipes found for your query. Please try again! :(";
  _message = "Recipe was successfully added :)";

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }

  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerOpenModal() {
    this._openBtn.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerCloseModal() {
    this._closeBtn.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = new FormData(this);
      handler(Array.from(data));
    });
  }
}

export default new AddRecipeView();
