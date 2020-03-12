/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  // throw new Error('Not implemented');
}

Rectangle.prototype.getArea = function getArea() {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
  // throw new Error('Not implemented');
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const Obj = proto.constructor;
  return Object.assign(new Obj(), JSON.parse(json));
  // throw new Error('Not implemented');
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: '',
  occurences: {},
  checkOrder(sel) {
    switch (sel) {
      case ('elem'):
        if (Object.keys(this.occurences).length) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;
      case ('id'):
        if (Object.keys(this.occurences).length > 0 && !('elem' in this.occurences)) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;
      case ('class'):
        if (('attr' in this.occurences) || ('ps-elem' in this.occurences) || ('ps-class' in this.occurences)) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;
      case ('attr'):
        if (('ps-elem' in this.occurences) || ('ps-class' in this.occurences)) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;
      case ('ps-class'):
        if (('ps-elem' in this.occurences)) {
          throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;
      default:
        break;
    }
  },

  checkOccurence(sel) {
    if ((sel === 'id' || sel === 'ps-elem' || sel === 'elem') && sel in this.occurences) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.checkOrder(sel);
    this.occurences[sel] = 1;
  },

  createNewSelector() {
    const self = { ...this };
    self.result = '';
    self.newSelector = true;
    self.occurences = {};
    return self;
  },

  addToResult(sel) {
    this.result += sel;
  },

  element(value) {
    if (this.newSelector) {
      this.checkOccurence('elem');
      this.addToResult(value.toString());
      return this;
    }
    const self = this.createNewSelector();
    self.checkOccurence('elem');
    self.addToResult(value.toString());
    return self;
  },

  id(value) {
    if (this.newSelector) {
      this.checkOccurence('id');
      this.addToResult(`#${value}`);
      return this;
    }
    const self = this.createNewSelector();
    self.checkOccurence('id');
    self.addToResult(`#${value}`);
    return self;
  },

  class(value) {
    if (this.newSelector) {
      this.checkOccurence('class');
      this.addToResult(`.${value}`);
      return this;
    }
    const self = this.createNewSelector();
    self.checkOccurence('class');
    self.addToResult(`.${value}`);
    return self;
  },

  attr(value) {
    if (this.newSelector) {
      this.checkOccurence('attr');
      this.addToResult(`[${value}]`);
      return this;
    }
    const self = this.createNewSelector();
    self.checkOccurence('attr');
    self.addToResult(`[${value}]`);
    return self;
  },

  pseudoClass(value) {
    if (this.newSelector) {
      this.checkOccurence('ps-class');
      this.addToResult(`:${value}`);
      return this;
    }
    const self = this.createNewSelector();
    self.checkOccurence('ps-class');
    self.addToResult(`:${value}`);
    return self;
  },

  pseudoElement(value) {
    if (this.newSelector) {
      this.checkOccurence('ps-elem');
      this.addToResult(`::${value}`);
      return this;
    }
    const self = this.createNewSelector();
    self.checkOccurence('ps-elem');
    self.addToResult(`::${value}`);
    return self;
  },

  combine(selector1, combinator, selector2) {
    const self = { ...this };
    self.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return self;
  },

  stringify() {
    const res = this.result;
    this.result = '';
    this.occurences = {};
    return res;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
