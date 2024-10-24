const root = document.querySelector(".root");

function createElement(html) {
    const div = document.createElement("div");
    div.insertAdjacentHTML("beforeend", html);
    return div.firstElementChild;
}

class Game {
    _element = null;
    _subElements = null;

    _state = {
      stonesStatus:[],
      startGame: false,
      pair: [],
      foundParts: 0,
    }

    constructor({data, Stone, Button}){
        this._setStateStonesStatus(data.map((elem) => {
         return {
           ...elem,
          disabled: true,
          hide: false,
         } 
        }));
        this._Stone = Stone;
        this._Button = Button;
        this._init();
    }

    _setStateStonesStatus(newState){
      this._state.stonesStatus = newState;
    }

    _setStateStartGame(status){
      this._state.startGame = status;
    }

    _setStateFoundParts(num){
      this._state.foundParts = num;
    }

    _setStatePair(obj){
      if (this._state.pair.length === 2) {
      this._state.pair = [];
      }

      this._state.pair = [...this._state.pair, obj];
    }

    _init() {
        this._element = createElement(this._getTemplate());
        this._subElements = this._getSubElements();
        this._render();
    }

    _setStateStartGameHandler(){
      this._setStateStartGame(!this._state.startGame);

      if (this._state.startGame) {
        this._setStateStonesStatus(data.map((elem) => {
          return {
            ...elem,
           disabled: false,
           hide: true,
          } 
         }).sort((a, b) => 0.5 - Math.random()));
      }

      // .sort((a, b) => 0.5 - Math.random())

      if (!this._state.startGame) {
        this._setStateStonesStatus(data.map((elem) => {
          return {
            ...elem,
           disabled: true,
           hide: false,
          } 
         }));
         this._setStateFoundParts(0);
      }

      this._render();
    }

    _setStatePairHandler(obj){
      if (this._state.pair.length === 1 && this._state.pair[0].id === obj.id) {
        return;
      }
      
      this._setStatePair(obj);
      
      if (this._isEqualPair()) {
        const idsStonesInPair = [this._state.pair[0].id, this._state.pair[1].id];

        this._state.stonesStatus.map((el) => {
          if (idsStonesInPair.includes(el.id)) {
            // камень найден по id
            el.disabled = true;
            el.hide = false;
            return el;
          }
          return el;
        })
        this._setStateFoundParts(this._state.foundParts + 1);
      }
      this._render();
    }

    /* 
    
    ДЗ
    - + исправить баг (когда 2 раза кликаем на 1 камень, он думает что это пара)
    - оживить total + found
    - если все пары нашлись, игра переходит в статус начала игры (все должно сброситься)
    
    */

    _getTotalParts(){
      const obj = this._state.stonesStatus.reduce((acc, el) => {
        if (acc[el.color] === undefined) {
          acc[el.color] = 1;
        } else {
          acc[el.color] += 1;
        }
        return acc;
      }, {});
      
      return Object.values(obj).reduce((acc, el) => {
        acc += Math.floor(el / 2);
        return acc
      }, 0);
    }

    _isEqualPair(){
      if (this._state.pair.length < 2) {
        return false;
      }
      if (this._state.pair[0].color === this._state.pair[1].color) {
        return true;
      }
      return false;
    }

    _generateBtn() {
      return new this._Button({use:"start", text: this._state.startGame ? "finish game" : "start game"}, this._setStateStartGameHandler.bind(this)).element
    }

    _generateStones(){
      return this._state.stonesStatus.map((obj) => {
        return new this._Stone(obj, this._setStatePairHandler.bind(this)).element;
      })
    }

    _render(){
      this._subElements.field.innerHTML = "";
      this._subElements.btn.innerHTML = "";
      this._subElements.field.append(...this._generateStones());
      this._subElements.btn.append(this._generateBtn());
      this._subElements.total.textContent = `Total parts: ${this._getTotalParts()}`;
      this._subElements.found.textContent = `Found parts: ${this._state.foundParts}`;
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
				<div class="game__btn" data-element="btn"></div>
                <span class="game__found" data-element="found">Found parts: 0</span>
                <span class="game__total" data-element="total">Total parts: 0</span>
                <div class="game__field" data-element="field"></div>
        </div>`
    }

    get element() {
        return this._element;
    }
}

class Stone {
    _element = null;
    _subElements = null;
		
    constructor({id, color, disabled, hide, img},handler){
        this._id = id;
        this._color = color;
        this._disabled = disabled;
        this._hide = hide;
        this._img = img;
        this._handler = handler;
        this._init();
    }

    _init(){
        this._element = createElement(this._getTemplate());
        this._subElements = this._getSubElements();
        this._addListeners();
    }

    _addListeners(){
      this._element.addEventListener("click", () => {
        this._handler({
          id: this._id,
          color: this._color
        })
      })
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
        return `<button class="btn btn--${this._use}" ${this._disabled ? "disabled" : ""}>${this._text}</button>`
    }

	_addListeners() {
       this._element.addEventListener("click", () => this._handler()) 
	}

    get element() {
        return this._element;
    }
}

const data = [
  {
    id: 346,
    color: "blue",
    img: "t2.png",
  },
  {
    id: 2345,
    color: "red",
    img: "t1.png",
  },
  {
    id: 7,
    color: "green",
    img: "t3.png",
  },
  {
    id: 235,
    color: "violet",
    img: "t4.png",
  },
  {
    id: 567,
    color: "blue",
    img: "t2.png",
  },
  {
    id: 67,
    color: "red",
    img: "t1.png",
  },
  {
    id: 43,
    color: "green",
    img: "t3.png",
  },
  {
    id: 87,
    color: "violet",
    img: "t4.png",
  },
  {
    id: 95,
    color: "blue",
    img: "t2.png",
  },
  {
    id: 352,
    color: "red",
    img: "t1.png",
  },
  {
    id: 3456,
    color: "green",
    img: "t3.png",
  },
  {
    id: 323446,
    color: "violet",
    img: "t4.png",
  },
  {
    id: 6587,
    color: "blue",
    img: "t2.png",
  },
  {
    id: 89,
    color: "red",
    img: "t1.png",
  },
  {
    id: 6507,
    color: "green",
    img: "t3.png",
  },
  {
    id: 2146,
    color: "violet",
    img: "t4.png",
  },
];


root.insertAdjacentElement("beforeend", new Game({data, Stone, Button}).element)