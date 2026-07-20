# MMM-Polestar

*MMM-Polestar* is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) that displays information about your Polestar

## Screenshot

![Example of MMM-Template](./example_1.png)

## Installation

### Install

In your terminal, go to the modules directory and clone the repository:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/CaramelKat/MMM-Polestar
```

### Update

Go to the module directory and pull the latest changes:

```bash
cd ~/MagicMirror/modules/MMM-Polestar
git pull
npm ci --omit=dev
```

## Configuration

To use this module, you have to add a configuration object to the modules array in the `config/config.js` file.

### Example configuration

Minimal configuration to use the module:

```js
	{
		module: "MMM-Polestar",
		position: "top_right",
		config: {
			email: "example@example.com",
			password: "AccountPassword",
			vin: "17CharacterVinNum"
		}
	},
```

Configuration with all options:

```js
	{
		module: "MMM-Polestar",
		position: "top_right",
		config: {
			email: "example@example.com",
			password: "AccountPassword",
			vin: "17CharacterVinNum",
			timezone: "America/Chicago",
			units: 'metric' or 'imperial',
			locale: 'en-US',
			style: 'iOS',
			theme: 'light' or 'dark' or 'dark square',
			refreshInterval: 5
		}
	},
```

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `node --run lint` - Run linting and formatter checks.
- `node --run lint:fix` - Fix linting and formatter issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

