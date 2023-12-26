import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  render(data, preview = false) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (preview) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();
    const newMarkup = document.createRange().createContextualFragment(markup);
    const newDom = Array.from(newMarkup.querySelectorAll("*"));
    const curDom = Array.from(this._parentElement.querySelectorAll("*"));

    curDom.forEach((el, i) => {
      const curEl = newDom[i];
      if (!el.isEqualNode(curEl) && curEl.firstChild?.nodeValue.trim() !== "") {
        el.textContent = curEl.textContent;
      }

      if (!el.isEqualNode(curEl)) {
        Array.from(curEl.attributes).forEach((attribute) =>
          el.setAttribute(attribute.name, attribute.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
              <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
