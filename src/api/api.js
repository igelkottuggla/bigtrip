import PointsModel from '../model/points';

const Methods = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const UrlAddresses = {
  POINTS: `points`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`,
  SYNC: `sync`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endpoint, authorization) {
    this._endpoint = endpoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: UrlAddresses.POINTS})
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: UrlAddresses.OFFERS})
      .then(Api.toJSON);
  }

  getDestinations() {
    return this._load({url: UrlAddresses.DESTINATIONS})
      .then(Api.toJSON);
  }

  updatePoint(event) {
    return this._load({
      url: `${UrlAddresses.POINTS}/${event.id}`,
      method: Methods.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  addPoint(event) {
    return this._load({
      url: `${UrlAddresses.POINTS}`,
      method: Methods.POST,
      body: JSON.stringify(PointsModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(event) {
    return this._load({
      url: `${UrlAddresses.POINTS}/${event.id}`,
      method: Methods.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `${UrlAddresses.POINTS}/${UrlAddresses.SYNC}`,
      method: Methods.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Methods.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endpoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
