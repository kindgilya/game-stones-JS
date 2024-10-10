const root = document.querySelector(".root");

function createElement(html) {
    const div = document.createElement("div");
    div.insertAdjacentHTML("beforeend", html);
    return div.firstElementChild;
  }


class Game {
    _element = null;
    _subElements = null;
		
    constructor(){
        this._init();
    }

    _init(){
        this._element = createElement(this._getTemplate());
        this._subElements = this._getSubElements();
    }

    _getSubElements() {
        return Array.from(this._element.querySelectorAll("[data-element]")).reduce((acc, elem) => {
          return {
            ...acc,
            [elem.getAttribute("data-element")]: elem,
          };
        }, {});
      }

    _getTemplate(){
        return `<div class="game">
				<div class="game__btn"></div>
                <span class="game__found">Found parts: 0</span>
                <span class="game__total">Total parts: 0</span>
                <div class="game__field"></div>
        </div>`
    }

    get element() {
        return this._element;
    }
}