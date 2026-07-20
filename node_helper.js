const NodeHelper = require("node_helper")
const { PolestarAPI } = require("polestar-api")

module.exports = NodeHelper.create({

  api: undefined,

  buildStatus(battery, climate, payload) {
    const { units } = payload

    if (!battery || !climate) return "Unknown"

    if (climate.runningStatus == 1) {
      let ventilation = "Unknown"
      let targetTemp = climate.requestedCompartmentTemperatureCelsius ?? 0
      if (units == "imperial")
        targetTemp = targetTemp * 1.8 + 32

      switch (climate.ventilation) {
        case 1:
          ventilation = "Cooling"
          break
        case 2:
          ventilation = "Heating"
          break
      }

      return `${ventilation} to ${targetTemp}`
    }

    if (battery.chargerConnectionStatus == 1) {
      switch (battery.chargingStatus) {
        case 2:
          return "Connected"
        case 7:
          return "Charging done"
      }
    }

    return "Ready"
  },

  buildTimestamp(utcSeconds, payload) {
    const { timezone, locale } = payload

    const date = new Date(0)
    date.setUTCSeconds(utcSeconds)
    return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit", timeZone: timezone })
  },

  async socketNotificationReceived(notification, payload) {
    const { email, password, vin } = payload
    switch (notification) {
      case "LOGIN":
        if (!this.api)
          this.api = new PolestarAPI(email, password)
        break
      case "UPDATE":
      {
        if (!this.api || !vin) return

        const car = await this.api.getCar(vin)
        if (!car) return

        const battery = await this.api.getLatestBattery(car)
        const exterior = await this.api.getLatestExterior(car)
        const climate = await this.api.getLatestParkingClimatization(car)
        const image = await this.api.getCarImage(car, "transparent", 5)

        const widgetPayload = {
          model: car.modelName,
          battery_percent: battery.batteryChargeLevelPercentage,
          charging_status: battery.chargingStatus,
          time_remaining: this.buildTimestamp(battery.estimatedChargingTimeMinutesToMinimumSoc, payload),
          updated_at: this.buildTimestamp(battery.timestamp.seconds, payload),
          locked: exterior.centralLock == 2,
          unlocked: exterior.centralLock == 1,
          climateOn: climate.runningStatus == 1,
          climateOff: climate.runningStatus == 2,
          status: this.buildStatus(battery, climate, payload),
          imageURL: image.url
        }
        this.sendSocketNotification("UPDATE", widgetPayload)
        break
      }
    }
  },
})
