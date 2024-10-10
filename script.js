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


class Stone {
    _element = null;
    _subElements = null;
		
    constructor({id, disabled, hide, pair, img}){
        this._id = id;
        this._disabled = disabled;
        this._hide = hide;
        this._pair = pair;
        this._img = img;
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
        return `<button class="stone ${this._hide ? "stone--hide" : ""} ${this._pair ? "stone--pair" : ""}" ${this._disabled ? "disabled" : ""}>
                <img class="stone__img" src="/img/${this._img}" alt="">
                </button>`
    }

    get element() {
        return this._element;
    }
}

class Button {
    _element = null;
		
    constructor({use, disabled, text}, handler){
        this._use = use;
        this._disabled = disabled;
        this._text = text;
        this._handler = handler;
        this._init();
    }

    _init(){
        this._element = createElement(this._getTemplate());
        this._addListeners();
    }

	_getTemplate(){
        return `<button class="btn btn--${this._use}" ${this._disabled ? "disabled" : ""}>${text}</button>`
    }

	_addListeners() {
       this._element.addEventListener("click", () => this._handler()) 
	}

    get element() {
        return this._element;
    }
}