# Claude Prompt Tester - Extension & Features Guide

This guide provides patterns and examples for extending the application with new features.

## Common Extension Patterns

### Pattern 1: Adding a New Parameter

Let's say you want to add a `top_p` (nucleus sampling) parameter.

#### Step 1: Update Backend API

**File**: `app/controllers/api/prompts_controller.rb`

```ruby
def compare
  prompt = params.require(:prompt)
  model = params[:model] || 'claude-3-5-sonnet-20241022'
  temperature = params[:temperature]&.to_f || 0.7
  max_tokens = params[:max_tokens]&.to_i || 1024
  top_p = params[:top_p]&.to_f || 1.0  # ADD THIS

  # Validate top_p
  if top_p.nil? || top_p < 0 || top_p > 1
    return render json: { error: 'top_p must be between 0 and 1' }, status: :bad_request
  end

  # Pass to Claude API
  response = call_claude_api(prompt, model, temperature, max_tokens, top_p)
  render json: response
end

private

def call_claude_api(prompt, model, temperature, max_tokens, top_p)
  # ... existing code ...

  response = client.messages(
    model: model,
    max_tokens: max_tokens,
    temperature: temperature,
    top_p: top_p,  # ADD THIS
    messages: [{ role: 'user', content: prompt }]
  )

  # ... rest of code ...
end
```

#### Step 2: Update Frontend Service

**File**: `app/javascript/services/apiService.js`

```javascript
export async function callClaudeAPI({
  prompt,
  model = 'claude-3-5-sonnet-20241022',
  temperature = 0.7,
  max_tokens = 1024,
  topP = 1.0,  // ADD THIS
  onStreamChunk,
}) {
  try {
    const response = await axiosInstance.post('/api/prompts/compare', {
      prompt,
      model,
      temperature,
      max_tokens,
      top_p: topP,  // ADD THIS
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`API Error: ${errorMessage}`);
  }
}
```

#### Step 3: Update Hook

**File**: `app/javascript/hooks/usePromptComparison.js`

```javascript
export function usePromptComparison() {
  // ... existing state ...
  const [topP, setTopP] = useState(1.0);  // ADD THIS

  const executePrompt = useCallback(async (prompt) => {
    // ... validation ...

    try {
      const result = await callClaudeAPI({
        prompt,
        model,
        temperature,
        max_tokens: maxTokens,
        topP,  // ADD THIS
      });

      setResponse(result.content);
      setExecutedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
      setResponse('');
    } finally {
      setIsLoading(false);
    }
  }, [model, temperature, maxTokens, topP]);  // ADD topP HERE

  return {
    // ... existing returns ...
    topP,  // ADD THIS
    setTopP,  // ADD THIS
  };
}
```

#### Step 4: Update ParameterControls

**File**: `app/javascript/components/ParameterControls.jsx`

```javascript
export function ParameterControls({
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  topP,  // ADD THIS
  onTopPChange,  // ADD THIS
  disabled = false,
}) {
  return (
    <div className="parameter-controls">
      {/* ... existing controls ... */}

      <div className="control-group">
        <label className="control-label">
          Top P ({topP.toFixed(2)})
        </label>
        <div className="temperature-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={topP}
            onChange={(e) => onTopPChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="temperature-slider"
            title="Controls diversity via nucleus sampling"
          />
          <span className="temperature-value">{topP.toFixed(2)}</span>
        </div>
        <small style={{ color: '#6c757d', marginTop: '0.25rem' }}>
          0 = Most focused, 1 = Most diverse
        </small>
      </div>
    </div>
  );
}
```

#### Step 5: Update ComparisonColumn

**File**: `app/javascript/components/ComparisonColumn.jsx`

```javascript
export function ComparisonColumn({ columnId = 1 }) {
  const { prompt } = usePrompt();
  const {
    // ... existing destructuring ...
    topP,  // ADD THIS
    setTopP,  // ADD THIS
  } = usePromptComparison();

  return (
    <div className="comparison-column">
      <div className="column-header">
        <h3 className="column-title">Comparison {columnId}</h3>
        <ParameterControls
          model={model}
          onModelChange={setModel}
          temperature={temperature}
          onTemperatureChange={setTemperature}
          maxTokens={maxTokens}
          onMaxTokensChange={setMaxTokens}
          topP={topP}  // ADD THIS
          onTopPChange={setTopP}  // ADD THIS
          disabled={isLoading}
        />
      </div>
      {/* ... rest of component ... */}
    </div>
  );
}
```

### Pattern 2: Adding Column State Persistence

Save column configurations to localStorage so they persist on page refresh.

**File**: `app/javascript/hooks/usePromptComparison.js`

```javascript
import { useState, useCallback, useRef, useEffect } from 'react';
import { callClaudeAPI } from '../services/apiService';

const STORAGE_KEY = 'promptTesterConfig';

export function usePromptComparison(columnId) {
  // Load from localStorage on mount
  const savedConfig = localStorage.getItem(`${STORAGE_KEY}_${columnId}`);
  const initialConfig = savedConfig ? JSON.parse(savedConfig) : {
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 1024,
  };

  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [executedAt, setExecutedAt] = useState(null);
  const [model, setModel] = useState(initialConfig.model);
  const [temperature, setTemperature] = useState(initialConfig.temperature);
  const [maxTokens, setMaxTokens] = useState(initialConfig.maxTokens);

  // Save to localStorage whenever config changes
  useEffect(() => {
    const config = { model, temperature, maxTokens };
    localStorage.setItem(`${STORAGE_KEY}_${columnId}`, JSON.stringify(config));
  }, [columnId, model, temperature, maxTokens]);

  // ... rest of hook ...
}
```

### Pattern 3: Adding Response Export

Add ability to copy or download responses.

**File**: `app/javascript/components/ResponseDisplay.jsx`

```javascript
import React from 'react';

export function ResponseDisplay({
  response,
  isLoading,
  error,
  executedAt,
  onClear,
}) {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response);
    // Show toast: "Copied to clipboard!"
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([response], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `response-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return <div className="response-display empty">Generating...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!response) {
    return <div className="response-display empty">Ready...</div>;
  }

  return (
    <div>
      <div className="response-display">{response}</div>
      {executedAt && (
        <div className="response-metadata">
          <span className="executed-at">Executed: {executedAt}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleCopyToClipboard} className="btn-secondary btn-sm">
              Copy
            </button>
            <button onClick={handleDownload} className="btn-secondary btn-sm">
              Download
            </button>
            <button onClick={onClear} className="btn-secondary btn-sm">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Pattern 4: Adding Response Metadata

Display additional information about the response.

**File**: `app/javascript/hooks/usePromptComparison.js`

```javascript
// Add to state
const [metadata, setMetadata] = useState({
  tokenCount: 0,
  latency: 0,
  cost: 0,
});

// In executePrompt, after receiving response
const startTime = Date.now();

try {
  const result = await callClaudeAPI({...});

  const latency = Date.now() - startTime;
  const tokenCount = Math.floor(result.content.length / 4); // Estimate
  const cost = calculateCost(model, tokenCount);

  setResponse(result.content);
  setMetadata({
    tokenCount,
    latency,
    cost,
  });
  setExecutedAt(new Date().toLocaleTimeString());
} catch (err) {
  // ...
}

function calculateCost(model, tokens) {
  // Pricing as of Oct 2025 (update as needed)
  const pricing = {
    'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
    'claude-3-opus-20250219': { input: 0.015, output: 0.075 },
    'claude-3-haiku-20250307': { input: 0.0008, output: 0.004 },
  };

  const modelPricing = pricing[model] || pricing['claude-3-5-sonnet-20241022'];
  return (tokens * modelPricing.output) / 1000000; // Cost in dollars
}
```

**File**: `app/javascript/components/ResponseDisplay.jsx`

```javascript
export function ResponseDisplay({
  response,
  metadata,  // ADD THIS
  isLoading,
  error,
  executedAt,
  onClear,
}) {
  // ... existing code ...

  return (
    <div>
      <div className="response-display">{response}</div>
      {executedAt && (
        <div className="response-metadata">
          <span className="executed-at">Executed: {executedAt}</span>
          <span>Tokens: ~{metadata.tokenCount}</span>
          <span>Latency: {metadata.latency}ms</span>
          <span>Cost: ${metadata.cost.toFixed(6)}</span>
          {/* ... buttons ... */}
        </div>
      )}
    </div>
  );
}
```

## Advanced Features

### Feature 1: Prompt Template System

Save and reuse common prompts.

```javascript
// New component: PromptTemplates.jsx
import React, { useState } from 'react';

const TEMPLATES = [
  {
    id: 'summarize',
    name: 'Summarize',
    prompt: 'Please summarize the following text in 3 bullet points:',
  },
  {
    id: 'explain',
    name: 'Explain Concept',
    prompt: 'Explain this concept in a way a beginner would understand:',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm Ideas',
    prompt: 'Generate 5 creative ideas for:',
  },
];

export function PromptTemplates({ onSelect }) {
  return (
    <div className="prompt-templates">
      <label>Quick Templates:</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.prompt)}
            className="btn-secondary btn-sm"
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Feature 2: Response Comparison (Diff View)

Show side-by-side differences between responses.

```javascript
// New component: ResponseComparison.jsx
import React from 'react';

export function ResponseComparison({ responses }) {
  // responses = [
  //   { columnId: 1, text: '...', model: '...' },
  //   { columnId: 2, text: '...', model: '...' },
  // ]

  return (
    <div className="response-comparison">
      <h3>Comparison View</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {responses.map((resp) => (
          <div key={resp.columnId} className="comparison-item">
            <h4>{resp.model}</h4>
            <div className="response-text">{resp.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Feature 3: A/B Testing Analytics

Track which model/config performs best.

```javascript
// New hook: useABTestAnalytics.js
import { useState, useCallback } from 'react';

export function useABTestAnalytics() {
  const [results, setResults] = useState([]);

  const addResult = useCallback((config, response, rating) => {
    setResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        config: { model: config.model, temperature: config.temperature },
        response: response,
        rating: rating, // 1-5 stars
        timestamp: new Date(),
      },
    ]);
  }, []);

  const getWinningConfig = useCallback(() => {
    const grouped = results.reduce((acc, result) => {
      const key = JSON.stringify(result.config);
      acc[key] = acc[key] || { config: result.config, ratings: [] };
      acc[key].ratings.push(result.rating);
      return acc;
    }, {});

    return Object.values(grouped)
      .map((group) => ({
        ...group,
        avgRating: group.ratings.reduce((a, b) => a + b, 0) / group.ratings.length,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)[0];
  }, [results]);

  return { results, addResult, getWinningConfig };
}
```

### Feature 4: System Prompt Customization

Allow per-column system prompts.

```javascript
// Update ParameterControls.jsx
export function ParameterControls({
  // ... existing props ...
  systemPrompt,  // ADD THIS
  onSystemPromptChange,  // ADD THIS
}) {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  return (
    <div className="parameter-controls">
      {/* ... existing controls ... */}

      <button
        onClick={() => setShowSystemPrompt(!showSystemPrompt)}
        className="btn-secondary btn-sm"
      >
        {showSystemPrompt ? 'Hide' : 'Show'} System Prompt
      </button>

      {showSystemPrompt && (
        <div className="control-group">
          <label className="control-label">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="You are a helpful assistant..."
            style={{ minHeight: '80px', width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

// Update API call in PromptsController
def call_claude_api(prompt, model, temperature, max_tokens, system_prompt = nil)
  client = Anthropic::Client.new(api_key: ENV['ANTHROPIC_API_KEY'])

  messages = [{ role: 'user', content: prompt }]
  system_param = system_prompt.present? ? system_prompt : nil

  response = client.messages(
    model: model,
    max_tokens: max_tokens,
    temperature: temperature,
    messages: messages,
    system: system_param  # Include system prompt if provided
  )

  # ... rest of method ...
end
```

### Feature 5: Streaming Responses

Real-time token streaming for long responses.

```javascript
// Updated apiService.js with streaming
export async function callClaudeAPIWithStreaming({
  prompt,
  model,
  temperature,
  max_tokens,
  onChunk,  // Callback for each chunk
}) {
  try {
    // This requires backend support for Server-Sent Events (SSE)
    const eventSource = new EventSource(
      `/api/prompts/stream?${new URLSearchParams({
        prompt,
        model,
        temperature,
        max_tokens,
      })}`
    );

    return new Promise((resolve, reject) => {
      let content = '';

      eventSource.onmessage = (event) => {
        const chunk = event.data;
        content += chunk;
        onChunk(chunk);
      };

      eventSource.onerror = () => {
        eventSource.close();
        resolve({ content });
      };
    });
  } catch (error) {
    throw new Error(`Streaming error: ${error.message}`);
  }
}

// Backend support (Rails controller)
def stream
  prompt = params.require(:prompt)
  model = params[:model]
  temperature = params[:temperature]

  response.headers['Content-Type'] = 'text/event-stream'
  response.headers['Cache-Control'] = 'no-cache'

  client = Anthropic::Client.new(api_key: ENV['ANTHROPIC_API_KEY'])

  # Use streaming API
  client.messages(
    model: model,
    max_tokens: 1024,
    temperature: temperature,
    stream: true,
    messages: [{ role: 'user', content: prompt }]
  ) do |event|
    if event.type == 'content_block_delta'
      response.stream.write("data: #{event.delta.text}\n\n")
    end
  end

  response.stream.close
end
```

## Database Features (Optional)

### Store Comparison History

```ruby
# Create model
rails generate model ComparisonResult prompt:text model:string temperature:float max_tokens:integer response:text user_id:integer

# Migration
create_table :comparison_results do |t|
  t.text :prompt
  t.string :model
  t.float :temperature
  t.integer :max_tokens
  t.text :response
  t.references :user, foreign_key: true
  t.timestamps
end

# Model: app/models/comparison_result.rb
class ComparisonResult < ApplicationRecord
  belongs_to :user, optional: true
  validates :prompt, :model, :response, presence: true

  scope :by_model, ->(model) { where(model: model) }
  scope :recent, -> { order(created_at: :desc) }
end

# Controller addition
def create
  @comparison = ComparisonResult.create(
    prompt: params[:prompt],
    model: params[:model],
    temperature: params[:temperature],
    max_tokens: params[:max_tokens],
    response: params[:response]
  )
  render json: @comparison
end

def index
  @comparisons = ComparisonResult.recent.limit(50)
  render json: @comparisons
end
```

## Performance Optimizations

### Implement Request Debouncing

```javascript
// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Use in ParameterControls
const debouncedTemperature = useDebounce(temperature, 300);

// Only call API when debounced value changes
useEffect(() => {
  // API call logic
}, [debouncedTemperature]);
```

### Add Response Caching

```javascript
// Cache hook
function useLRUCache(maxSize = 100) {
  const cacheRef = useRef(new Map());

  const get = useCallback((key) => {
    if (!cacheRef.current.has(key)) return null;

    const value = cacheRef.current.get(key);
    // Move to end (LRU)
    cacheRef.current.delete(key);
    cacheRef.current.set(key, value);
    return value;
  }, []);

  const set = useCallback((key, value) => {
    if (cacheRef.current.has(key)) {
      cacheRef.current.delete(key);
    }

    if (cacheRef.current.size >= maxSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }

    cacheRef.current.set(key, value);
  }, [maxSize]);

  return { get, set };
}
```

## Testing Extended Features

```javascript
// Example: Test new parameter export
import { render, screen } from '@testing-library/react';
import ComparisonColumn from './ComparisonColumn';

test('exports response when download button clicked', () => {
  render(<ComparisonColumn columnId={1} />);

  // Mock response
  const mockResponse = 'This is a test response';
  // ... set mock response ...

  // Click download
  const downloadBtn = screen.getByText('Download');
  fireEvent.click(downloadBtn);

  // Verify download was triggered
  // ...
});
```

## Common Extension Checklist

When adding a new feature:

- [ ] Frontend component created or updated
- [ ] Backend controller/API updated if needed
- [ ] Service layer updated (apiService.js)
- [ ] Hook updated with new state
- [ ] Styling added to promptTester.css
- [ ] Props passed through component hierarchy
- [ ] Error handling included
- [ ] Loading states handled
- [ ] Tests written
- [ ] Documentation updated

## Need Help?

Refer to:
1. `/ARCHITECTURE.md` - System design and patterns
2. `/SETUP.md` - Environment and development setup
3. Component files for examples
4. React documentation: https://react.dev
5. Rails guides: https://guides.rubyonrails.org
