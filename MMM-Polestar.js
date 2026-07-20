Module.register("MMM-Polestar", {

  defaults: {
    email: "",
    password: "",
    vin: "",
    timezone: "America/Chicago",
    units: "imperial",
    locale: "en-UK",
    style: "iOS",
    theme: "light",
    refreshInterval: 5
  },

  getTemplate: function () {
    switch (this.config.style) {
      case "iOS":
      default:
        return "iOS.njk"
    }
  },

  getStyles() {
    switch (this.config.style) {
      case "iOS":
      default:
        return ["iOS.css"]
    }
  },

  start() {
    Log.info(`Starting ${this.name}`)
    this.sendSocketNotification("LOGIN", this.config)

    this.widgetPayload = {
      model: "Unknown",
      battery_percent: 0,
      charging_status: undefined,
      time_remaining: undefined,
      updated_at: undefined,
      locked: undefined,
      unlocked: undefined,
      climate_on: undefined,
      climate_off: undefined,
      status: "Loading...",
      theme: this.config.theme
    }

    this.updateWidget()
    setInterval(() => this.updateWidget(), this.config.refreshInterval * 60 * 1000)
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "UPDATE") {
      this.widgetPayload = payload
      this.widgetPayload.theme = this.config.theme
      this.updateDom()
    }
  },

  getTemplateData: function () {
    return this.widgetPayload
  },

  updateWidget() {
    this.sendSocketNotification("UPDATE", this.config)
  },

  notificationReceived(notification, payload) {
    if (notification === "UPDATE") {
      this.widgetPayload = payload
    }
  }
})
