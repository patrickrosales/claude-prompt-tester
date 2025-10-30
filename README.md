# Claude Prompt Tester

A side-by-side comparison tool for testing Claude AI models with different parameters. Compare how different Claude models respond to the same prompt, with configurable temperature and token settings.

## Features

- **Multi-Model Comparison**: Test up to 4 different Claude model configurations simultaneously
- **Parameter Control**: Adjust temperature (0.0-1.0) and max tokens (1-4096) for each model
- **Real-time Responses**: Get immediate feedback from Claude API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Model Selection**: Compare across available Claude models:
  - Claude Sonnet 4.5 (Latest)
  - Claude Opus 4.1
  - Claude Haiku 4.5
  - Claude 3 Haiku (Legacy)

## Quick Start

### Prerequisites

- Ruby 3.2.2
- Node.js 16+ with Yarn
- PostgreSQL 12+ (optional for basic usage)
- Anthropic API Key ([get one here](https://console.anthropic.com))

### Installation

```bash
# Clone and navigate to the project
cd claude-prompt-tester

# Install Ruby dependencies
bundle install

# Install JavaScript dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Set up database (optional)
rails db:create db:migrate

# Start the development server
./bin/dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to get started!

## Usage

1. **Enter your prompt** in the text area at the top
2. **Configure each comparison column** with:
   - Model selection
   - Temperature (creativity level)
   - Max tokens (response length)
3. **Click "Run"** to call the Claude API
4. **Compare responses** side-by-side
5. **Adjust parameters** and run again to explore different configurations

## Tech Stack

### Frontend
- **React 18.3** with Hooks and Context API
- **Bootstrap 5.3** for responsive UI
- **Axios** for API communication
- **esbuild** for fast bundling

### Backend
- **Rails 7.1.5** REST API
- **Ruby 3.2.2** application code
- **Anthropic SDK** for Claude API integration
- **Puma** web server

### Database
- **PostgreSQL 12+** (optional)

## Project Structure

```
app/
├── javascript/          # React frontend application
│   ├── components/      # React components
│   ├── context/         # State management (Context API)
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API communication
│   └── styles/          # Component styling
├── controllers/         # Rails API endpoints
├── services/            # Business logic (Anthropic API wrapper)
└── views/               # Rails templates
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `./bin/dev` | Start development server (Rails + esbuild + CSS) |
| `rails server` | Start Rails only |
| `yarn build` | Build JavaScript once |
| `yarn build:css` | Build CSS once |
| `rails db:create` | Create database |
| `rails test` | Run tests |

## API Endpoints

### Compare Prompts
```
POST /api/prompts/compare
Content-Type: application/json

{
  "prompt": "Your prompt here",
  "model": "claude-sonnet-4-5-20250929",
  "temperature": 0.7,
  "max_tokens": 1024
}
```

### Get Available Models
```
GET /api/models

Returns:
{
  "models": [
    { "id": "claude-sonnet-4-5-20250929", "name": "Claude Sonnet 4.5 (Latest)" },
    ...
  ]
}
```

## Documentation

For detailed information, see:

- **[SETUP.md](./Documentation/SETUP.md)** - Complete installation and development guide
- **[ARCHITECTURE.md](./Documentation/ARCHITECTURE.md)** - System design and component architecture
- **[GETTING_STARTED.md](./Documentation/GETTING_STARTED.md)** - Quick start guide with examples
- **[COMPONENT_GUIDE.md](./Documentation/COMPONENT_GUIDE.md)** - React component reference
- **[EXTENSION_GUIDE.md](./Documentation/EXTENSION_GUIDE.md)** - How to add new features
- **[IMPLEMENTATION_SUMMARY.md](./Documentation/IMPLEMENTATION_SUMMARY.md)** - Implementation details

## Development Workflow

1. Start the dev server: `./bin/dev`
2. Make changes to React components in `app/javascript/`
3. Changes hot-reload automatically
4. For Rails changes, the server will restart
5. Check the browser for updates

## Environment Variables

Create a `.env` file with:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key
```

See `.env.example` for all available options.

## Deployment

### Heroku
```bash
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key
git push heroku main
```

### Docker
```bash
docker build -t claude-prompt-tester .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-your-key claude-prompt-tester
```

### Manual Server
1. Install Ruby, Node.js, and PostgreSQL
2. Run installation steps from Quick Start
3. Set `ANTHROPIC_API_KEY` environment variable
4. Run `./bin/dev` to start the server

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- Check the [Documentation](./Documentation/) folder for detailed guides
- Review the [GETTING_STARTED.md](./Documentation/GETTING_STARTED.md) for common tasks
- Check [ARCHITECTURE.md](./Documentation/ARCHITECTURE.md) to understand the codebase

## Acknowledgments

Built with the [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-python) for seamless Claude API integration.