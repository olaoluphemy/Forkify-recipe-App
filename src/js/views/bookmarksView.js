import View from "./view.js";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _data;
  _parentElement = document.querySelector(".bookmarks");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((rec) => {
        return previewView.render(rec, true);
      })
      .join("");
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
}

export default new BookmarksView();
