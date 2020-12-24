import AbstractView from './abstract';
import {EVENT_TYPES} from '../const';
import {humaneEditEventTime, createPrepositions} from '../util/event';
import {capitalize} from '../util/global';


const offerTemplate = (offer) => {
  const {id, name, price, isChecked} = offer;
  return ` <div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}" ${isChecked ? `checked` : ``}>
                        <label class="event__offer-label" for="event-offer-${id}">
                          <span class="event__offer-title">${name}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${price}</span>
                        </label>
                      </div>`;
};

const createOffers = (offers) => {
  return `
    ${offers.map((offer) => offerTemplate(offer)).join(``)}
    `;
};

const createEventTypeItems = () => {
  return `
  ${EVENT_TYPES.map(({id, type, name, image}) => `
      <div class="event__type-item">
          <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}">
          <label class="event__type-label  event__type-label--${image}" for="event-type-${type}-${id}">${name}</label>
      </div>`).join(``)}
    `;
};

const createEditEventTemplate = (event = {}) => {
  const {
    city,
    eventType,
    eventStart,
    eventEnd,
    offers,
    description,
    photos,
    id,
    price
  } = event;

  const createOffersSection = () => {
    return `
    ${offersTemplate}
  `;
  };

  const createDetailsSection = () => {
    const offersSection = createOffersSection();
    return `
        ${offersSection}
        `;
  };

  const createPhotosSection = () => {
    return `
    ${photos.map(({photoPath}) => `
      <img class="event__photo" src=${photoPath}" alt="Event photo">
    `).join(``)}
    `;
  };

  const offersTemplate = createOffers(offers);
  const detailsSection = createDetailsSection();
  const photosSection = createPhotosSection();
  const eventTypeItems = createEventTypeItems();

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypeItems}
                        </fieldset>
                    </div>
                    </div>

                    <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${capitalize(eventType)}  ${createPrepositions(eventType)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}">
                    <datalist id="destination-list-${id}">
                      <option value="Amsterdam"></option>
                      <option value="Geneva"></option>
                      <option value="Chamonix"></option>
                    </datalist>
                  </div>


                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humaneEditEventTime(eventStart)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humaneEditEventTime(eventEnd)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                ${(offers.length || description.length) ? `

              <section class="event__details">
                  ${offers.length ? `
                    <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                    ${detailsSection}
                    </div>
                    </section>
                ` : ``}
                ${description.length ? `
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  </section>
                  ` : ``}
                  <p class="event__destination-description">${description}</p>

                  ${photos.length ? `
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${photosSection}
                      </div>
                    </div>
                    ` : ``}
                    </section>
                    ` : ``}
              </form>
            </li>
            `;
};

export default class EditEventView extends AbstractView {
  constructor(event) {
    super();
    this._data = event;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._cardArrowHandler = this._cardArrowHandler.bind(this);
  }


  getTemplate() {
    return createEditEventTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  _cardArrowHandler() {
    this._callback.onArrowClick();
  }

  setCardArrowHandler(callback) {
    this._callback.onArrowClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._cardArrowHandler);
  }


  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

}
