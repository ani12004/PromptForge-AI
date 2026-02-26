# forge

Forge CLI Studio is a professional, premium terminal-native Prompt Engineering studio designed for rapid prompt generation, testing, and AI model evaluation.

## Installation

You can link this package globally to try it out:

```bash
cd forge-cli
npm link
```

## Usage

### Initialize a new project

```bash
forge init my-project
```

This will create a new directory, initialize a git repository, set up the required structure, and create a `forge.config.json` file.

### Studio Mode

Run the studio interactive REPL:

```bash
forge
```

Commands available in Studio Mode:
- `:model` - Switch to a specific model.
- `:models` - List available models and configure them.
- `:test` - Test the current model.
- `:test all` - Test all available models and display connection latency.
- `:auto` - Toggle auto-failover mode.
- `:key` - Configure API keys.
- `:clear` - Clear the console.
- `:exit` - Exit the studio.
