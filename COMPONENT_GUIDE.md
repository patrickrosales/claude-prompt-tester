# Component Guide - Visual & Reference

## Component Tree Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  PromptTester (PromptTester.jsx)           │
│                   - Imports all deps                         │
│                   - Wraps with PromptProvider               │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
    ┌────▼────────────────────┐  ┌──▼──────────────────┐
    │ Header (.header)        │  │ PromptProvider      │
    │ - Title                 │  │ - Context Setup     │
    │ - Subtitle              │  │ - prompt state      │
    └────────────────────────┘  └──┬──────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
               ┌────▼──────────────────┐    ┌────▼──────────────────┐
               │ PromptInput.jsx        │    │ ComparisonGrid.jsx    │
               │ ┌──────────────────┐  │    │ ┌──────────────────┐  │
               │ │ label            │  │    │ │ Add/Remove       │  │
               │ ├──────────────────┤  │    │ │ Column Controls  │  │
               │ │ textarea         │  │    │ └──────────────────┘  │
               │ │ (usePrompt hook) │  │    │ ┌──────────────────┐  │
               │ │                  │  │    │ │ Column Grid      │  │
               │ │ Updates context  │  │    │ │ (CSS Grid)       │  │
               │ └──────────────────┘  │    │ └──────┬───────────┘  │
               └────────────────────────┘    │        │              │
                                             │        │ repeats 1-4x │
                                             │        │              │
                              ┌──────────────┼────────┴──────────┐
                              │              │                   │
                         ┌────▼─────────┐    │  ┌────────────┐
                         │ Column 1      │    │  │ Column 2   │
                         └────────────────┘   │  └────────────┘
                                             │
                    ┌────────────────────────┘
                    │
         ┌──────────▼──────────────────────────────┐
         │ ComparisonColumn.jsx (repeated 1-4x)   │
         │ ┌────────────────────────────────────┐ │
         │ │ Header                             │ │
         │ │ - Title                            │ │
         │ │ - ParameterControls               │ │
         │ │   ├─ ModelSelector               │ │
         │ │   ├─ Temperature Slider           │ │
         │ │   └─ Max Tokens Input            │ │
         │ └────────────────────────────────────┘ │
         │                                        │
         │ ┌────────────────────────────────────┐ │
         │ │ Body                               │ │
         │ │ ┌──────────────────────────────┐  │ │
         │ │ │ ResponseDisplay              │  │ │
         │ │ │ (shows response or loading)  │  │ │
         │ │ │ - LoadingSpinner (if loading)│  │ │
         │ │ │ - Error text (if error)      │  │ │
         │ │ │ - Response text (if success) │  │ │
         │ │ │ - Clear button & timestamp   │  │ │
         │ │ └──────────────────────────────┘  │ │
         │ │                                    │ │
         │ │ ┌──────────────────────────────┐  │ │
         │ │ │ Button Group                 │  │ │
         │ │ ├─ Run Button                  │  │ │
         │ │ └─ Reset Button                │  │ │
         │ │ (usePromptComparison hook)     │  │ │
         │ └────────────────────────────────┘  │ │
         └──────────────────────────────────────┘
```

## Component Reference

### PromptTester.jsx

**Purpose**: Main application container

**Props**:
- `initialColumns` (number, default: 2) - Starting number of comparison columns

**State**: None (all state in hooks/context)

**Renders**:
- Header with title
- PromptProvider wrapper
- PromptInput
- ComparisonGrid

**Key Code**:
```jsx
export function PromptTester({ initialColumns = 2 }) {
  return (
    <PromptProvider>
      <div className="prompt-tester">
        <header>...</header>
        <PromptInput />
        <ComparisonGrid initialColumns={initialColumns} />
      </div>
    </PromptProvider>
  );
}
```

**When to Modify**:
- Change app title/subtitle
- Add new top-level sections
- Adjust initial layout

---

### PromptContext.jsx

**Purpose**: Manages shared prompt state across all columns

**Pattern**: Context API + Custom Hook

**State**:
- `prompt` (string) - User's input text

**Methods**:
- `updatePrompt(newPrompt)` - Update prompt text

**Usage in Components**:
```jsx
const { prompt, updatePrompt } = usePrompt();
```

**When to Modify**:
- Add shared state (user preferences, etc.)
- Change state structure
- Add persistence layer

**Performance Note**: Context only stores prompt (rarely changes), so limited re-renders

---

### PromptInput.jsx

**Purpose**: Textarea for entering the prompt to test

**Props**: None (uses usePrompt hook)

**State**: None (all state in context)

**Functions**:
- `handleChange` - Updates context when user types

**Key Features**:
- Shared across all columns via context
- No local state (always in sync)
- Focus border highlights
- Placeholder text

**When to Modify**:
- Change textarea size/placeholder
- Add character counter
- Add template buttons
- Add formatting options

**Related Files**:
- `PromptContext.jsx` - State management

---

### ComparisonGrid.jsx

**Purpose**: Container for comparison columns with add/remove functionality

**Props**:
- `initialColumns` (number, default: 2) - Starting column count

**State**:
- `columnCount` (number, 1-4) - Current number of columns

**Functions**:
- `addColumn()` - Add column (max 4)
- `removeColumn()` - Remove column (min 1)

**Renders**:
- Add/Remove column buttons
- ComparisonColumn components (repeated 1-4 times)

**Key Code**:
```jsx
const [columnCount, setColumnCount] = useState(initialColumns);

const columns = Array.from({ length: columnCount }, (_, i) => i + 1);

return (
  <div>
    <button onClick={addColumn}>+ Add Column</button>
    <button onClick={removeColumn}>- Remove Column</button>

    <div className="comparison-grid">
      {columns.map((columnId) => (
        <ComparisonColumn key={columnId} columnId={columnId} />
      ))}
    </div>
  </div>
);
```

**When to Modify**:
- Change column count limits
- Modify button styling
- Add column templates

**Performance Note**: Each column is independent, no performance issues at 4 columns

---

### ComparisonColumn.jsx

**Purpose**: Single model comparison unit with controls and response display

**Props**:
- `columnId` (number) - Column identifier for UI/debugging

**State via Hook** (`usePromptComparison`):
- `response` (string)
- `isLoading` (boolean)
- `error` (string | null)
- `executedAt` (timestamp | null)
- `model` (string)
- `temperature` (number)
- `maxTokens` (number)

**Functions from Hook**:
- `executePrompt(prompt)` - Run API call
- `setModel(newModel)` - Change model
- `setTemperature(value)` - Change temperature
- `setMaxTokens(value)` - Change max tokens
- `clearResponse()` - Clear response
- `resetParameters()` - Reset to defaults

**Renders**:
1. Column header with ParameterControls
2. Column body with ResponseDisplay
3. Run/Reset buttons

**Key Code**:
```jsx
export function ComparisonColumn({ columnId = 1 }) {
  const { prompt } = usePrompt();
  const { response, isLoading, error, ... } = usePromptComparison();

  return (
    <div className="comparison-column">
      <div className="column-header">
        <ParameterControls {...controlProps} />
      </div>
      <div className="column-body">
        <ResponseDisplay {...displayProps} />
        <div className="button-group">
          <button onClick={handleRun}>Run</button>
          <button onClick={resetParameters}>Reset</button>
        </div>
      </div>
    </div>
  );
}
```

**When to Modify**:
- Add new controls (sliders, inputs)
- Change button layout
- Add metadata display
- Modify response formatting

**Key Pattern**: Each column is completely independent; changes in one don't affect others

---

### usePromptComparison.js

**Purpose**: Custom hook managing per-column state and API logic

**Pattern**: Custom Hook (not Context)

**State Managed**:
- `response`, `isLoading`, `error`, `executedAt`
- `model`, `temperature`, `maxTokens`
- `abortControllerRef` - For canceling pending requests

**Methods Provided**:
- `executePrompt(prompt)` - Calls API, updates state
- `clearResponse()` - Resets response
- `resetParameters()` - Resets to defaults
- `setModel()`, `setTemperature()`, `setMaxTokens()`

**Return Value**:
```javascript
{
  // State
  response, isLoading, error, executedAt,
  model, temperature, maxTokens,

  // Actions
  executePrompt, clearResponse, resetParameters,
  setModel, setTemperature, setMaxTokens
}
```

**Key Implementation Details**:

```javascript
const executePrompt = useCallback(async (prompt) => {
  // Validation
  if (!prompt.trim()) {
    setError('Please enter a prompt');
    return;
  }

  // Cancel previous request
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // Set loading state
  setIsLoading(true);
  setError(null);

  try {
    // Call API with current parameters
    const result = await callClaudeAPI({
      prompt,
      model,
      temperature,
      max_tokens: maxTokens,
    });

    setResponse(result.content);
    setExecutedAt(new Date().toLocaleTimeString());
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}, [model, temperature, maxTokens]); // Dependencies
```

**When to Modify**:
- Add new state/parameters
- Change API call logic
- Modify error handling
- Add response processing

**Dependencies Array**: Critical for useCallback - includes all values used in function

---

### ParameterControls.jsx

**Purpose**: UI controls for temperature, max tokens, and model selection

**Props**:
- `model` (string) - Currently selected model
- `onModelChange` (function) - Callback for model change
- `temperature` (number) - Current temperature
- `onTemperatureChange` (function) - Callback for temperature change
- `maxTokens` (number) - Current max tokens
- `onMaxTokensChange` (function) - Callback for max tokens change
- `disabled` (boolean) - Disable during API call

**Renders**:
1. ModelSelector dropdown
2. Temperature slider with value display
3. Max tokens number input
4. Helpful hints for each control

**Key Code**:
```jsx
export function ParameterControls({
  model, onModelChange,
  temperature, onTemperatureChange,
  maxTokens, onMaxTokensChange,
  disabled = false,
}) {
  return (
    <div className="parameter-controls">
      <ModelSelector value={model} onChange={onModelChange} />

      <div className="control-group">
        <label>Temperature ({temperature.toFixed(2)})</label>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={temperature}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Max Tokens</label>
        <input
          type="number"
          min="1" max="4096"
          value={maxTokens}
          onChange={(e) => onMaxTokensChange(parseInt(e.target.value, 10))}
        />
      </div>
    </div>
  );
}
```

**When to Modify**:
- Add new parameter controls
- Change range/step values
- Modify control labels
- Add tooltips/help text

**Common Additions**:
- Top-P (nucleus sampling)
- Top-K (top-k sampling)
- Frequency penalty
- Presence penalty
- System prompt selector

---

### ModelSelector.jsx

**Purpose**: Dropdown for selecting Claude models

**Props**:
- `value` (string) - Currently selected model ID
- `onChange` (function) - Callback for selection change
- `disabled` (boolean) - Disable during API call

**State**:
- `models` (array) - List of available models
  - Initial: Hardcoded list
  - Fetched: Via API on mount

**Effects**:
- On mount: Fetches available models from backend

**Key Code**:
```jsx
export function ModelSelector({ value, onChange, disabled = false }) {
  const [models, setModels] = useState([
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus' },
    { id: 'claude-3-haiku-20250307', name: 'Claude 3 Haiku' },
  ]);

  useEffect(() => {
    fetchAvailableModels().then(setModels).catch(err => {
      // Fallback to hardcoded models
    });
  }, []);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {models.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
}
```

**When to Modify**:
- Change available models
- Add model descriptions
- Add model capabilities info
- Filter models by type

**Backend Integration**: Calls `/api/models` endpoint

---

### ResponseDisplay.jsx

**Purpose**: Display response with loading/error states

**Props**:
- `response` (string) - The response text
- `isLoading` (boolean) - Show loading spinner
- `error` (string | null) - Error message if any
- `executedAt` (timestamp | null) - When response was generated
- `onClear` (function) - Clear button callback

**States Rendered**:
1. **Empty**: "Ready to compare..."
2. **Loading**: Spinner with "Generating response..."
3. **Error**: Red error message
4. **Success**: Response text + timestamp + clear button

**Key Code**:
```jsx
export function ResponseDisplay({
  response, isLoading, error, executedAt, onClear
}) {
  if (isLoading) {
    return <div className="response-display empty">
      <LoadingSpinner message="Generating response..." />
    </div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!response) {
    return <div className="response-display empty">
      Ready to compare...
    </div>;
  }

  return (
    <div>
      <div className="response-display">{response}</div>
      <div className="response-metadata">
        <span>Executed: {executedAt}</span>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  );
}
```

**When to Modify**:
- Change empty/loading messages
- Add metadata display
- Modify error styling
- Add export buttons
- Add response formatting

**Common Additions**:
- Copy to clipboard button
- Download as text/PDF
- Token count display
- Latency display
- Cost estimation

---

### LoadingSpinner.jsx

**Purpose**: Animated loading indicator

**Props**:
- `message` (string, default: "Processing...") - Display text

**Renders**:
- Spinning circle animation
- Message text

**Key Code**:
```jsx
export function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner-animation"></div>
      <span>{message}</span>
    </div>
  );
}
```

**Styling**: CSS keyframe animation in promptTester.css

**When to Modify**:
- Change animation speed
- Change spinner style
- Customize message

---

### apiService.js

**Purpose**: API client for communicating with Rails backend

**Not a Component**: Utility functions module

**Functions**:

**1. callClaudeAPI(params)**
```javascript
callClaudeAPI({
  prompt,           // Required
  model,            // Optional (default: claude-3-5-sonnet)
  temperature,      // Optional (default: 0.7)
  max_tokens,       // Optional (default: 1024)
  onStreamChunk,    // Optional (for future streaming)
})
```

Returns: Promise<{ content, model, temperature, max_tokens, timestamp }>

**2. fetchAvailableModels()**

Returns: Promise<Array>

**Key Features**:
- Automatic CSRF token inclusion
- Error handling with meaningful messages
- Fallback to hardcoded models if fetch fails

**Key Code**:
```javascript
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || '',
  },
});

export async function callClaudeAPI({
  prompt, model, temperature, max_tokens,
}) {
  try {
    const response = await axiosInstance.post('/prompts/compare', {
      prompt, model, temperature, max_tokens,
    });
    return response.data;
  } catch (error) {
    throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
  }
}
```

**When to Modify**:
- Add new API endpoints
- Add authentication headers
- Change error handling
- Add request logging
- Implement retry logic

---

## Data Flow Diagram

### User Types Prompt

```
User Types
    ↓
PromptInput onChange
    ↓
usePrompt().updatePrompt()
    ↓
PromptContext state updates
    ↓
All ComparisonColumns re-render
    ↓
Each reads latest prompt via usePrompt()
```

### User Clicks Run

```
User clicks "Run"
    ↓
ComparisonColumn.handleRun()
    ↓
executePrompt(prompt) from usePromptComparison
    ↓
Validation (prompt not empty)
    ↓
setIsLoading(true)
    ↓
callClaudeAPI({ prompt, model, temperature, maxTokens })
    ↓
POST /api/prompts/compare
    ↓
Rails PromptsController#compare
    ↓
Anthropic SDK call
    ↓
Response returned
    ↓
setResponse(content)
    ↓
setExecutedAt(timestamp)
    ↓
setIsLoading(false)
    ↓
ResponseDisplay re-renders with content
```

### User Adjusts Temperature

```
User drags slider
    ↓
ParameterControls onChange
    ↓
setTemperature(newValue)
    ↓
usePromptComparison state updates
    ↓
ParameterControls re-renders
    ↓
Temperature display updates
```

## Performance Characteristics

### Re-render Triggers

**PromptTester**: On mount only

**PromptInput**:
- On mount
- When user types (via context)
- Parent context change

**ComparisonColumn**:
- On mount
- When prompt changes (from context)
- When own state changes (model, temperature, etc.)
- When hook state changes (response, loading, etc.)

**ResponseDisplay**:
- When `response`, `isLoading`, or `error` changes
- Wrapped in ComparisonColumn, re-renders only when needed

### useCallback Dependencies

**Critical**: All function dependencies must be listed
- If you use `model` in function, add to dependencies array
- Missing dependencies = stale closures = bugs

Example from `usePromptComparison`:
```javascript
const executePrompt = useCallback(async (prompt) => {
  // Uses: model, temperature, maxTokens
  // So dependencies must include these:
}, [model, temperature, maxTokens]);
```

### Bundle Size

- React 18: ~42KB gzipped
- Axios: ~13KB gzipped
- Code + CSS: ~20KB gzipped
- **Total: ~75KB** - reasonable for modern apps

## Testing Strategy

### Component Testing (Jest + React Testing Library)

```javascript
// Example: Test PromptInput
test('updates prompt on textarea change', () => {
  render(<PromptTester />);

  const textarea = screen.getByPlaceholderText(/Enter Your Prompt/i);
  fireEvent.change(textarea, { target: { value: 'Test prompt' } });

  expect(textarea.value).toBe('Test prompt');
});
```

### Hook Testing

```javascript
// Example: Test usePromptComparison
const { result } = renderHook(() => usePromptComparison());

act(() => {
  result.current.setTemperature(0.5);
});

expect(result.current.temperature).toBe(0.5);
```

### Integration Testing (Full component flow)

```javascript
// Example: Test full run flow
test('executes prompt when Run clicked', async () => {
  render(<PromptTester />);

  // Type prompt
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'Test prompt' }
  });

  // Click Run
  fireEvent.click(screen.getByText('Run'));

  // Wait for response
  await waitFor(() => {
    expect(screen.getByText(/response text/i)).toBeInTheDocument();
  });
});
```

## Accessibility (a11y)

Current implementation includes:
- Semantic HTML (button, textarea, input)
- Proper label associations
- ARIA labels for icons/spinners
- Color contrast meets WCAG AA
- Keyboard navigation support (native)

To improve:
- Add ARIA live regions for loading state
- Add keyboard shortcuts (Cmd+Enter to Run)
- Improve screen reader announcements
- Add focus indicators

## Browser Compatibility

### Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Not Supported
- IE 11
- Android Browser

## Security Considerations

1. **API Key Protection**
   - NEVER exposed to frontend
   - Stored server-side in environment variable
   - Rails controller handles all API calls

2. **CSRF Protection**
   - Built-in to Rails
   - Token automatically included in all POST requests

3. **Input Validation**
   - Frontend: Basic validation (prompt not empty)
   - Backend: Full validation (temperature 0-1, tokens 1-4096, etc.)

4. **Error Handling**
   - Never expose sensitive details in error messages
   - Log errors server-side for debugging

## Common Patterns

### Adding a New Control

1. Add to ParameterControls component
2. Add to usePromptComparison hook state
3. Add to ComparisonColumn destructuring
4. Pass through to ParameterControls props
5. Update API call in usePromptComparison
6. Update apiService.js for API call
7. Update Rails controller to handle new param

### Adding a New Component

1. Create component file in `/app/javascript/components/`
2. Export function component
3. Define props with JSDoc comments
4. Import in parent component
5. Pass required props
6. Add CSS to promptTester.css

### Styling a New Element

1. Add CSS class in component
2. Add styles to `/app/javascript/styles/promptTester.css`
3. Use BEM naming: `.component-name__element`
4. Test responsive behavior

## Debugging Tips

### React DevTools
1. Install React Developer Tools browser extension
2. Open DevTools (F12)
3. Go to "Components" tab
4. Inspect components and see live props/state

### Console Logging
```javascript
// In component
console.log('Component mounted with props:', { prompt, model });

// In hook
console.log('executing prompt with:', { prompt, model, temperature });
```

### Browser DevTools Network Tab
1. Open DevTools > Network tab
2. Perform action (click Run)
3. See POST to `/api/prompts/compare`
4. Click request to see payload and response

### Rails Logs
```bash
tail -f log/development.log

# Look for:
# - Started POST /api/prompts/compare
# - Parameters: {...}
# - Response: {...}
```

## Performance Profiling

### React Profiler
1. DevTools > Profiler tab
2. Click Record
3. Interact with app
4. Stop recording
5. See which components rendered and how long

### Chrome DevTools Performance
1. DevTools > Performance tab
2. Click Record
3. Interact with app
4. Stop recording
5. Analyze timeline

## Next: Extending

See `/EXTENSION_GUIDE.md` for:
- Adding new parameters
- Adding response export
- Adding metadata display
- Adding database persistence
- Adding user authentication
