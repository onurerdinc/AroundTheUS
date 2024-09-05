export default class Section {
  constructor({ items, renderer }, classSelector) {
    this._items = items;
    this._renderer = renderer;
    this._classSection = document.querySelector(classSelector);
  }

  renderItems(items) {
    this._classSection.innerHTML = "";
    this._items = items;
    this._items.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._classSection.prepend(element);
  }
}
