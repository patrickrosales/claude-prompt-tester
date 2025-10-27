# Claude Prompt Tester - Setup & Development Guide

## Prerequisites

- Ruby 3.2.2
- Node.js 16+
- Yarn package manager
- PostgreSQL 12+
- Anthropic API key (get from https://console.anthropic.com)

## Installation

### 1. Clone & Dependencies

```bash
cd /Users/patrickrosales/Code/claude-prompt-tester

# Install Ruby gems
bundle install

# Install JavaScript dependencies
yarn install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
# .env (development)
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
RAILS_ENV=development
DATABASE_URL=postgresql://localhost/claude_prompt_tester_development
```

**Important**: Never commit `.env` to git. Add to `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 3. Database Setup

```bash
# Create database
rails db:create

# Run migrations (currently none, but structure is set up)
rails db:migrate

# Seed database (optional)
rails db:seed
```

### 4. Start Development Server

The project uses `Procfile.dev` to run multiple processes:

```bash
# Start Rails + JavaScript bundler + CSS bundler
./bin/dev
```

This starts:
- Rails server on http://localhost:3000
- esbuild watcher for JavaScript
- cssbundling-rails for CSS

Visit http://localhost:3000 in your browser.

### Alternative: Manual Process Start

If `./bin/dev` doesn't work:

```bash
# Terminal 1: Rails server
rails server

# Terminal 2: JavaScript bundler
yarn build --watch

# Terminal 3: CSS bundler
yarn watch:css
```

## Configuration

### Rails Configuration

Key files:
- `config/routes.rb` - API routes and application routes
- `config/database.yml` - Database connection
- `config/environments/development.rb` - Development settings

### Environment Variables

**Required**:
- `ANTHROPIC_API_KEY` - Your Claude API key

**Optional**:
- `RAILS_ENV` - Rails environment (development/production/test)
- `DATABASE_URL` - Custom database URL
- `PORT` - Server port (default 3000)

## Development Workflow

### Making Changes

The project watches for file changes automatically:

**JavaScript/React Components**:
- Edit files in `/app/javascript/`
- esbuild automatically rebuilds
- Refresh browser to see changes
- Hot reload works with Turbo Rails

**CSS Styling**:
- Edit files in `/app/assets/stylesheets/`
- cssbundling-rails automatically rebuilds
- Changes apply without refresh

**Rails Controllers/Routes**:
- Edit files in `/app/controllers/`
- Restart Rails server for changes to apply
- Use `./bin/dev` or manually restart

### Building Assets

```bash
# Build JavaScript
yarn build

# Build CSS
yarn build:css

# Build both
yarn run build:css && yarn build
```

### Running Tests

```bash
# Run all tests
rails test

# Run specific test
rails test test/controllers/api/prompts_controller_test.rb
```

## Understanding the Project Structure

### Frontend (React)

```
app/javascript/
├── application.js              # Entry point, mounts React app
├── components/                 # React components
│   ├── PromptTester.jsx       # Main container
│   ├── PromptInput.jsx        # Prompt textarea
│   ├── ComparisonGrid.jsx     # Column grid container
│   ├── ComparisonColumn.jsx   # Individual comparison
│   ├── ParameterControls.jsx  # Model/temp/tokens controls
│   ├── ModelSelector.jsx      # Model dropdown
│   ├── ResponseDisplay.jsx    # Response output
│   └── LoadingSpinner.jsx     # Loading indicator
├── context/
│   └── PromptContext.jsx      # Shared prompt state
├── hooks/
│   └── usePromptComparison.js # Per-column state & logic
├── services/
│   └── apiService.js          # API calls to Rails backend
└── styles/
    └── promptTester.css       # All component styles
```

### Backend (Rails)

```
app/controllers/
├── application_controller.rb  # Base controller
├── home_controller.rb         # Renders index page
└── api/
    └── prompts_controller.rb  # API endpoint for Claude calls

app/views/
├── layouts/
│   └── application.html.erb   # Main layout, includes React div
└── home/
    └── index.html.erb         # <div id="react-root"></div>
```

### Configuration

```
config/
├── routes.rb                  # URL routing
├── database.yml               # Database config
└── environments/
    ├── development.rb         # Dev-specific config
    ├── production.rb          # Production config
    └── test.rb               # Test config
```

## API Endpoints

### POST /api/prompts/compare

Calls Claude API with provided parameters.

**Request**:
```bash
curl -X POST http://localhost:3000/api/prompts/compare \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is React?",
    "model": "claude-3-5-sonnet-20241022",
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

**Response**:
```json
{
  "content": "React is a JavaScript library...",
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.7,
  "max_tokens": 1024,
  "timestamp": "2025-10-26T14:30:00Z"
}
```

### GET /api/models

Returns available Claude models.

**Request**:
```bash
curl http://localhost:3000/api/models
```

**Response**:
```json
{
  "models": [
    {
      "id": "claude-3-5-sonnet-20241022",
      "name": "Claude 3.5 Sonnet"
    },
    {
      "id": "claude-3-opus-20250219",
      "name": "Claude 3 Opus"
    },
    {
      "id": "claude-3-haiku-20250307",
      "name": "Claude 3 Haiku"
    }
  ]
}
```

## Common Development Tasks

### Add a New Feature

1. **Identify Component Location**
   - UI feature? Add/edit in `/app/javascript/components/`
   - State needed? Add to hook or context
   - API call? Update `/app/javascript/services/apiService.js`
   - Backend logic? Update `/app/controllers/api/prompts_controller.rb`

2. **Example: Add Token Counter**
   ```javascript
   // In ResponseDisplay.jsx, add:
   <div className="token-info">
     Response: ~{Math.floor(response.length / 4)} tokens
   </div>
   ```

3. **Example: Add New API Parameter**
   ```ruby
   # In prompts_controller.rb
   top_p = params[:top_p]&.to_f || 1.0

   response = client.messages(
     model: model,
     max_tokens: max_tokens,
     temperature: temperature,
     top_p: top_p,  # Add here
     messages: [...]
   )
   ```

### Debug React Component

Use React Developer Tools browser extension:

1. Install: https://chrome.google.com/webstore
2. Open DevTools (F12 in Chrome)
3. Go to "Components" tab
4. Inspect component tree and props

### Debug Rails Backend

Use `byebug` in controller:

```ruby
# In prompts_controller.rb
def compare
  prompt = params.require(:prompt)
  byebug  # Execution pauses here
  # ... rest of code
end
```

Then in terminal where Rails runs, debug:
```
(byebug) prompt
(byebug) params
(byebug) continue
```

### View Network Requests

Browser DevTools > Network tab:

1. Open DevTools (F12)
2. Go to Network tab
3. Trigger an action (click Run)
4. See requests to `/api/prompts/compare`
5. Click request to view headers, payload, response

## Troubleshooting

### Issue: "React is not defined"

**Cause**: React import missing
**Solution**: Ensure `import React from 'react'` at top of component file

### Issue: "Cannot find module 'PromptTester'"

**Cause**: Incorrect import path
**Solution**: Check relative path, e.g., `../components/PromptTester` or `./PromptTester`

### Issue: Styles not applying

**Cause**: CSS not built or imported
**Solution**:
```bash
yarn build:css
# Restart Rails server
```

### Issue: ANTHROPIC_API_KEY not found

**Cause**: Environment variable not set
**Solution**:
```bash
# Check if set
echo $ANTHROPIC_API_KEY

# Set it
export ANTHROPIC_API_KEY=sk-your-key

# Restart server
```

### Issue: "Port 3000 already in use"

**Cause**: Another service on port 3000
**Solution**:
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
rails server -p 3001
```

### Issue: Database connection error

**Cause**: PostgreSQL not running or credentials wrong
**Solution**:
```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql

# Update DATABASE_URL if needed
# Check config/database.yml
```

## Testing

### Run Test Suite

```bash
# All tests
rails test

# Specific test file
rails test test/controllers/api/prompts_controller_test.rb

# With verbose output
rails test -v
```

### Write a New Test

Create file `test/controllers/api/prompts_controller_test.rb`:

```ruby
require "test_helper"

class Api::PromptsControllerTest < ActionDispatch::IntegrationTest
  test "compare endpoint returns response" do
    post api_prompts_compare_url, params: {
      prompt: "What is Ruby?",
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      max_tokens: 1024
    }

    assert_response :success
    assert_includes response.body, "content"
  end
end
```

## Performance Tips

### Frontend Optimization

1. **Use React DevTools Profiler**
   - Profile > Record
   - Interact with app
   - Check which components re-render

2. **Avoid Unnecessary Re-renders**
   - Already using useCallback in hooks
   - Keep state as local as possible
   - Use useMemo for expensive calculations

3. **Optimize Bundle Size**
   - esbuild automatically minifies
   - Check bundle: `yarn build --analyze` (if available)

### Backend Optimization

1. **Cache Model List**
   - /api/models endpoint results
   - Add HTTP caching headers

2. **Rate Limiting**
   - Consider Rack::Attack gem
   - Prevent abuse of /api/prompts/compare

3. **Background Jobs**
   - For future: Store comparisons in background
   - Use ActiveJob with Redis

## Production Deployment

### Heroku

```bash
# Add Heroku remote
heroku create prompt-tester

# Set environment variable
heroku config:set ANTHROPIC_API_KEY=sk-...

# Deploy
git push heroku main

# View logs
heroku logs -t
```

### Docker

```bash
# Build image
docker build -t prompt-tester .

# Run container
docker run -e ANTHROPIC_API_KEY=sk-... -p 3000:3000 prompt-tester
```

### Manual Server

1. Install Ruby, Node, PostgreSQL
2. Clone repository
3. Run setup (bundle install, yarn install, db setup)
4. Precompile assets: `rails assets:precompile`
5. Start server: `RAILS_ENV=production rails server`

## Security Checklist

- [ ] ANTHROPIC_API_KEY not in .env file (git)
- [ ] CSRF protection enabled (default in Rails)
- [ ] Input validation on both frontend and backend
- [ ] Rate limiting configured for production
- [ ] HTTPS enforced in production
- [ ] Database credentials not in repository
- [ ] Regular security updates for gems and packages

## Next Steps

1. **Try the Application**
   - Run `./bin/dev`
   - Enter a prompt in textarea
   - Click "Run" to compare models

2. **Read the Architecture Guide**
   - Review `/ARCHITECTURE.md`
   - Understand component structure

3. **Make Your First Change**
   - Change colors in CSS
   - Add a new parameter
   - Modify a component

4. **Add Tests**
   - Write integration test
   - Test new feature end-to-end

5. **Deploy**
   - Push to production
   - Share with team

## Resources

- **React**: https://react.dev
- **Rails**: https://guides.rubyonrails.org
- **Claude API**: https://docs.anthropic.com
- **CSS Grid**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **esbuild**: https://esbuild.github.io

## Support

For issues:
1. Check this guide's Troubleshooting section
2. Review `/ARCHITECTURE.md` for design decisions
3. Check browser console (F12) for JavaScript errors
4. Check Rails logs: `tail -f log/development.log`
5. Check Anthropic API status: https://status.anthropic.com

## License

[Add your license information here]
