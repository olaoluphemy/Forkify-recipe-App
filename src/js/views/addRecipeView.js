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
  _errorMessage = "Something went wrong. Please try again! :(";
  _message = "Recipe was successfully added :)";

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }

  render() {
    const markup = this._generateMarkup();

    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    return `
    <div class="upload__column">
    <h3 class="upload__heading">Recipe data</h3>
    <label>Title</label>
    <input required name="title" type="text" />
    <label>URL</label>
    <input required name="sourceUrl" type="text" />
    <label>Image URL</label>
    <input required name="image" type="text" />
    <label>Publisher</label>
    <input required name="publisher" type="text" />
    <label>Prep time</label>
    <input required name="cookingTime" type="number" />
    <label>Servings</label>
    <input required name="servings" type="number" />
  </div>

  <div class="upload__column">
    <h3 class="upload__heading">Ingredients</h3>
    <label>Ingredient 1</label>
    <input
      type="text"
      required
      name="ingredient-1"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 2</label>
    <input
      type="text"
      name="ingredient-2"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 3</label>
    <input
      type="text"
      name="ingredient-3"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 4</label>
    <input
      type="text"
      name="ingredient-4"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 5</label>
    <input
      type="text"
      name="ingredient-5"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 6</label>
    <input
      type="text"
      name="ingredient-6"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
  </div>

  <button class="btn upload__btn">
    <svg>
      <use href="src/img/icons.svg#icon-upload-cloud"></use>
    </svg>
    <span>Upload</span>
  </button>
    `;
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
