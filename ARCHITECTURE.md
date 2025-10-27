# Claude Prompt Tester - Architecture Guide

## Project Overview

The Claude Prompt Tester is a Rails 7.1 + React 18 application that enables side-by-side comparison of Claude AI model outputs with different parameters. It provides a powerful interface for testing prompts across multiple model configurations and analyzing the differences.

## Technology Stack

- **Backend**: Rails 7.1.5 with Ruby 3.2.2
- **Frontend**: React 18.3 with Hooks and Context API
- **Build Tools**: esbuild (JavaScript), cssbundling-rails (CSS)
- **Database**: PostgreSQL (optional, for saving experiments)
- **Package Manager**: Yarn
- **AI API**: Anthropic Claude API

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           React Application (Frontend)               │
│  ┌────────────────────────────────────────────────┐ │
│  │          PromptTester (Main Component)         │ │
│  ├────────────────────────────────────────────────┤ │
│  │  PromptInput                                   │ │
│  │  (Shared prompt textarea with Context)        │ │
│  ├────────────────────────────────────────────────┤ │
│  │  ComparisonGrid (2-4 columns)                  │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │  ComparisonColumn 1                       │ │ │
│  │  │  ├─ ModelSelector                         │ │ │
│  │  │  ├─ ParameterControls                     │ │ │
│  │  │  ├─ ResponseDisplay                       │ │ │
│  │  │  └─ Run/Reset Buttons                     │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │  ComparisonColumn 2 (+ more)              │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │
         │ API Calls (axios)
         │
┌─────────────────────────────────────────────────────┐
│        Rails Backend API                            │
│  ┌────────────────────────────────────────────────┐ │
│  │  PromptsController                             │ │
│  │  - POST /api/prompts/compare                   │ │
│  │  - GET /api/models                             │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │
         │ Anthropic SDK
         │
┌─────────────────────────────────────────────────────┐
│        Anthropic Claude API                         │
└─────────────────────────────────────────────────────┘
```

## Component Structure

### Component Hierarchy

```
PromptTester (Container)
├─ PromptProvider (Context)
│  ├─ PromptInput
│  └─ ComparisonGrid
│     ├─ ComparisonColumn (1..N)
│     │  ├─ ModelSelector
│     │  ├─ ParameterControls
│     │  │  ├─ ModelSelector
│     │  │  ├─ Temperature Slider
│     │  │  └─ Max Tokens Input
│     │  └─ ResponseDisplay
│     │     └─ LoadingSpinner
│     └─ Add/Remove Column Controls
```

### Component Responsibilities

#### PromptTester
- **Purpose**: Main application component
- **Responsibilities**: Wraps the entire app with PromptProvider, renders header and layout
- **Location**: `/app/javascript/components/PromptTester.jsx`
- **Key Props**: `initialColumns` (default: 2)

#### PromptProvider & usePrompt Hook
- **Purpose**: Manages shared prompt state across all columns
- **Pattern**: Context API for prop drilling elimination
- **Location**: `/app/javascript/context/PromptContext.jsx`
- **State**: `prompt` (string)
- **Methods**: `updatePrompt(newPrompt)`

#### PromptInput
- **Purpose**: Textarea for entering the prompt to compare
- **Responsibilities**:
  - Renders large textarea with placeholder
  - Updates context when user types
  - Provides helpful hints
- **Location**: `/app/javascript/components/PromptInput.jsx`
- **Key Features**: Shared across all columns, no local state

#### ComparisonGrid
- **Purpose**: Container for comparison columns with add/remove functionality
- **Responsibilities**:
  - Manages column count (1-4 columns)
  - Renders ComparisonColumn components
  - Provides UI for adding/removing columns
- **Location**: `/app/javascript/components/ComparisonGrid.jsx`
- **State**: `columnCount` (number, 1-4 range)

#### ComparisonColumn
- **Purpose**: Single model comparison unit
- **Responsibilities**:
  - Renders all controls for one model configuration
  - Manages column-specific state (model, temperature, maxTokens)
  - Handles API calls
  - Displays responses and errors
- **Location**: `/app/javascript/components/ComparisonColumn.jsx`
- **Uses Hook**: `usePromptComparison()`
- **Key Features**:
  - Independent state per column
  - Individual Run/Reset buttons
  - Responsive to prompt changes from context

#### usePromptComparison Hook
- **Purpose**: Manages state and API logic for individual comparison columns
- **Location**: `/app/javascript/hooks/usePromptComparison.js`
- **State Managed**:
  - `response` (string)
  - `isLoading` (boolean)
  - `error` (string | null)
  - `executedAt` (timestamp | null)
  - `model` (string)
  - `temperature` (number 0-1)
  - `maxTokens` (number 1-4096)
- **Methods**:
  - `executePrompt(prompt)` - Calls API with current parameters
  - `clearResponse()` - Clears response and error
  - `resetParameters()` - Resets to defaults
  - `setModel()`, `setTemperature()`, `setMaxTokens()` - Parameter setters

#### ParameterControls
- **Purpose**: Renders controls for model, temperature, and max tokens
- **Components**:
  - ModelSelector (dropdown)
  - Temperature slider (0.0-1.0 with 0.01 step)
  - Max tokens number input (1-4096)
- **Location**: `/app/javascript/components/ParameterControls.jsx`
- **Props**: Receives values and onChange callbacks

#### ModelSelector
- **Purpose**: Dropdown for selecting Claude models
- **Models Supported**:
  - Claude 3.5 Sonnet (default)
  - Claude 3 Opus
  - Claude 3 Haiku
- **Location**: `/app/javascript/components/ModelSelector.jsx`
- **Features**: Fetches available models from backend on mount

#### ResponseDisplay
- **Purpose**: Shows model response with loading/error states
- **Location**: `/app/javascript/components/ResponseDisplay.jsx`
- **States**:
  - Empty state: "Ready to compare..."
  - Loading state: Spinner with "Generating response..."
  - Error state: Error message in red
  - Success state: Response text with timestamp and clear button

#### LoadingSpinner
- **Purpose**: Animated loading indicator
- **Location**: `/app/javascript/components/LoadingSpinner.jsx`

### State Management Strategy

#### Context-Based (Shared)
- **Prompt**: Stored in PromptContext, accessed by all columns
- **Benefit**: Single source of truth, synchronized updates
- **Implementation**: usePrompt() custom hook

#### Local Hook State (Per-Column)
- **Model, Temperature, Max Tokens**: Per-column parameters
- **Response, Loading, Error**: Per-column execution state
- **Benefit**: Independent column operations, no interference
- **Implementation**: usePromptComparison() custom hook

### Why This Architecture Works Well

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: ComparisonColumn can be rendered multiple times independently
3. **Scalability**: Easy to add more columns or comparison features
4. **Testability**: Components are small and props-driven
5. **Performance**: Context is limited to prompt (rarely changes), local state for frequent updates
6. **Maintainability**: Clear data flow and component boundaries

## API Integration

### Backend API Endpoints

#### POST /api/prompts/compare
Calls Claude API with the provided parameters.

**Request Body**:
```json
{
  "prompt": "Your prompt here",
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.7,
  "max_tokens": 1024
}
```

**Response**:
```json
{
  "content": "Model response text...",
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.7,
  "max_tokens": 1024,
  "timestamp": "2025-10-26T14:30:00Z"
}
```

**Error Response**:
```json
{
  "error": "Error message describing what went wrong"
}
```

#### GET /api/models
Returns list of available Claude models.

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

### Frontend API Service

**Location**: `/app/javascript/services/apiService.js`

**Functions**:
- `callClaudeAPI(params)` - Calls the API endpoint
- `fetchAvailableModels()` - Fetches list of available models

**Error Handling**:
- Network errors caught and re-thrown with meaningful messages
- Fallback to hardcoded models if endpoint fails
- CSRF token automatically included from meta tag

## Styling

**Approach**: CSS (not styled-components) for simplicity

**Key Files**:
- `/app/javascript/styles/promptTester.css` - Main stylesheet

**Responsive Design**:
- Desktop (1024px+): 2-3 column grid
- Tablet (768px-1024px): 1 column
- Mobile (< 768px): Stacked layout

**Color Scheme**:
- Primary: #667eea (Purple)
- Secondary: #764ba2 (Dark Purple)
- Background: #f8f9fa (Light Gray)
- Text: #212529 (Dark Gray)
- Borders: #e9ecef (Light Gray)

## Data Flow

### User Initiates Comparison

```
User enters prompt → PromptInput updates PromptContext
                          ↓
                   All ComparisonColumns re-render
                   (via usePrompt hook)
```

### User Clicks Run Button

```
User clicks Run → executePrompt(prompt) called
       ↓
Validates prompt & parameters
       ↓
callClaudeAPI() sends POST to /api/prompts/compare
       ↓
Rails controller validates input
       ↓
PromptsController#compare calls Anthropic SDK
       ↓
Response returned to React
       ↓
Response state updated in usePromptComparison
       ↓
ResponseDisplay re-renders with response text
```

### User Modifies Temperature

```
User adjusts slider → setTemperature() called
       ↓
usePromptComparison state updated
       ↓
ParameterControls re-renders with new value
       ↓
Temperature display updated (shows 0.00-1.00)
```

## Performance Considerations

### Optimization Strategies

1. **Context Splitting**: Prompt in Context (rarely changes), other state in hooks
2. **useCallback**: Prevent unnecessary function recreations in event handlers
3. **CSS Grid**: Efficient layout engine for responsive design
4. **Lazy Loading**: Models fetched once on ComponentSelector mount
5. **CSRF Token**: Cached from meta tag, not fetched per request

### Potential Bottlenecks & Solutions

| Issue | Impact | Solution |
|-------|--------|----------|
| Large responses | UI lag | Implement response virtualization (future) |
| Frequent API calls | Rate limiting | Debounce Run button, show rate limit info |
| Multiple re-renders | Performance | useCallback, useMemo hooks already in place |
| Bundle size | Load time | Consider code splitting for future features |

## Extensibility Points

### Easy to Add

1. **More Columns**: Already supports 1-4 columns, easy to increase
2. **New Parameters**: Add to ParameterControls, pass through API
3. **Response Export**: Add export buttons to save/copy responses
4. **Comparison Highlighting**: Add diff view between columns
5. **History**: Store previous comparisons in state/localStorage
6. **Sharing**: Generate shareable links with configuration

### Medium Effort

1. **Custom System Prompts**: Per-column system message
2. **Model Streaming**: Real-time token streaming display
3. **Response Metrics**: Token count, latency, cost estimation
4. **Prompt Templates**: Save/load preset prompts
5. **Dark Mode**: Toggle between light/dark themes

### Larger Features

1. **Prompt Versioning**: Track changes over time
2. **A/B Testing Analytics**: Track which configs perform best
3. **User Authentication**: Save experiments to database
4. **Prompt Marketplace**: Share prompts with community
5. **Advanced Analytics**: Response quality scoring, cost tracking

## Development Workflow

### Running the Application

1. **Install dependencies**: `bundle install && yarn install`
2. **Setup database**: `rails db:setup`
3. **Run dev server**: `./bin/dev` (uses Procfile.dev)
4. **Build assets**: Automatic with esbuild/cssbundling-rails
5. **Watch for changes**: Handled by Procfile.dev

### Building for Production

```bash
./bin/rails assets:precompile
RAILS_ENV=production ./bin/rails server
```

### Environment Variables

**Required**:
- `ANTHROPIC_API_KEY`: Your Claude API key

**Optional**:
- `RAILS_ENV`: Development/Production
- `DATABASE_URL`: Custom database connection

## Security Considerations

1. **API Key**: Never expose ANTHROPIC_API_KEY to frontend
   - Stored server-side, Rails controller handles API calls
   - Frontend only calls Rails endpoint, not Anthropic directly

2. **CSRF Protection**: Enabled by default in Rails
   - Token automatically included via axios configuration
   - Located in `<meta name="csrf-token">` tag

3. **Input Validation**: Both frontend and backend
   - Frontend validates on input (UI feedback)
   - Backend validates before API call (security)

4. **Rate Limiting**: Consider for production
   - Add Rack::Attack gem to limit requests per IP
   - Implement API key rotation

5. **Content Filtering**: Optional for production
   - Monitor API usage for abusive patterns
   - Consider adding prompt filtering/review

## Testing Strategy

### Unit Tests (React Components)

Tools: Jest + React Testing Library

```javascript
// Example: Testing ComparisonColumn
test('renders model selector', () => {
  render(<ComparisonColumn columnId={1} />)
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})
```

### Integration Tests (React + Mock API)

```javascript
// Example: Testing prompt flow
test('executes prompt when Run button clicked', async () => {
  render(<PromptTester />)
  // ... interact with component
  // ... verify API call made
})
```

### API Tests (Rails Controller)

Tools: RSpec

```ruby
# Example: Testing PromptsController
describe Api::PromptsController do
  it 'calls Claude API with correct parameters' do
    post :compare, params: { prompt: 'Test', model: '...', temperature: 0.7 }
    expect(response.status).to eq(200)
  end
end
```

### E2E Tests (Full Application)

Tools: Cypress or Playwright

```javascript
// Example: Full user workflow
describe('Prompt Tester E2E', () => {
  it('compares prompts across models', () => {
    cy.visit('/')
    cy.get('textarea').type('My test prompt')
    cy.get('button:contains("Run")').first().click()
    cy.get('.response-display').should('not.be.empty')
  })
})
```

## Deployment Guide

### Heroku Deployment

1. Add Procfile (already present as Procfile.dev)
2. Set `ANTHROPIC_API_KEY` in Config Vars
3. Deploy: `git push heroku main`

### Docker Deployment

Dockerfile already present in project.

```bash
docker build -t prompt-tester .
docker run -e ANTHROPIC_API_KEY=sk-... -p 3000:3000 prompt-tester
```

### Environment Setup

```bash
# .env (local development only)
ANTHROPIC_API_KEY=sk-your-key-here

# Don't commit .env to git
```

## Troubleshooting

### Common Issues

**Issue**: "Prompt cannot be empty" error
- **Cause**: Trying to run with empty prompt textarea
- **Solution**: Enter text in PromptInput before clicking Run

**Issue**: "API Error: Unauthorized"
- **Cause**: ANTHROPIC_API_KEY not set or invalid
- **Solution**: Check ENV variable, validate API key in Anthropic dashboard

**Issue**: React app not rendering
- **Cause**: JavaScript bundle not built or `#react-root` div missing
- **Solution**: Run `yarn build`, check `app/views/home/index.html.erb`

**Issue**: CSRF token errors in API calls
- **Cause**: Missing or invalid CSRF token
- **Solution**: Ensure `<meta name="csrf-token">` in layout, restart server

## File Structure Reference

```
app/
├── controllers/
│   ├── application_controller.rb
│   ├── home_controller.rb
│   └── api/
│       └── prompts_controller.rb
│
├── javascript/
│   ├── application.js
│   ├── components/
│   │   ├── PromptTester.jsx
│   │   ├── PromptInput.jsx
│   │   ├── ComparisonGrid.jsx
│   │   ├── ComparisonColumn.jsx
│   │   ├── ParameterControls.jsx
│   │   ├── ModelSelector.jsx
│   │   ├── ResponseDisplay.jsx
│   │   └── LoadingSpinner.jsx
│   │
│   ├── context/
│   │   └── PromptContext.jsx
│   │
│   ├── hooks/
│   │   └── usePromptComparison.js
│   │
│   ├── services/
│   │   └── apiService.js
│   │
│   └── styles/
│       └── promptTester.css
│
├── views/
│   ├── layouts/
│   │   └── application.html.erb
│   └── home/
│       └── index.html.erb
│
└── models/
    └── application_record.rb

config/
├── routes.rb
└── ...

package.json
Gemfile
```

## Next Steps & Recommendations

### Phase 2 Features

1. **Save Comparisons**: Store results in database
2. **Prompt History**: Track previous prompts
3. **Export Functionality**: Download results as PDF/JSON
4. **Advanced Metrics**: Token counts, latency, cost
5. **Keyboard Shortcuts**: Quick actions for power users

### Phase 3 Enhancements

1. **Team Collaboration**: Share configurations with others
2. **Prompt Templates**: Pre-built prompt library
3. **A/B Testing**: Automated comparison scoring
4. **Streaming Responses**: Real-time token updates
5. **Custom Parameters**: Function calling, vision, etc.

### Performance Optimizations

1. Implement response virtualization for large outputs
2. Add debouncing to Run button
3. Implement service worker for offline support
4. Optimize bundle size with code splitting
5. Add caching layer for model list

### Code Quality

1. Add comprehensive test suite
2. Set up CI/CD pipeline (GitHub Actions)
3. Implement TypeScript for type safety
4. Add Linting (ESLint) and Prettier
5. Document API with OpenAPI/Swagger

## References

- [React Hooks Documentation](https://react.dev/reference/react)
- [Rails API Guide](https://guides.rubyonrails.org/api_app.html)
- [Anthropic Claude API](https://docs.anthropic.com)
- [esbuild Documentation](https://esbuild.github.io/)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
