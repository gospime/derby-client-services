// app - Derby client applcation
module.exports = app => {
  app.services = new Map();

  /**
   * Register a service to app
   *
   * @param {Object} Service - a service class
   * @param {String} Service.prototype.name - the name of the service
   */
  app.registerService = Service => {
    // check the case when service should be enabled only for the client side
    if (!!Service.prototype.isOnlyForClient && app.derby.util.isServer) {
      return;
    }

    if (!Service.prototype.name) {
      throw new TypeError('The service must have a valid name!');
    }

    const name = Service.prototype.name;
    const key = name.toLowerCase();

    if (app.services.has(key)) {
      throw new TypeError(`The service with '${name}' name already exists`);
    }

    app.services.set(key, Service);
  };

  /**
   * Load a service by name
   *
   * @param String name - the name of the service
   */
  app.service = (name, ...rest) => {
    const key = name.toLowerCase();
    if (!app.services.has(key)) {
      throw new TypeError(`Undefined service by the name '${name}'`);
    }

    const Service = app.services.get(key);

    return new Service(...rest);
  };
};
