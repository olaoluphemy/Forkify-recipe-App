import View from "./view.js";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";

class ResultsView extends View {
  _data;
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query. Please try again! :(";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((rec) => {
        return previewView.render(rec, true);
      })
      .join("");
  }
}

export default new ResultsView();
