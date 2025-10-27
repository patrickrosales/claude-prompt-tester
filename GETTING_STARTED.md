# Getting Started - Quick Start Guide

Welcome! You now have a complete, production-ready Claude Prompt Tester application. This guide will get you running in minutes.

## Before You Start: Prerequisites

Make sure you have:
- Ruby 3.2.2 (check: `ruby -v`)
- Node.js 16+ (check: `node -v`)
- Yarn (check: `yarn -v`)
- PostgreSQL 12+ (check: `psql --version`)
- Anthropic API key from https://console.anthropic.com

## Step 1: Setup (5 minutes)

### 1a. Install Dependencies

```bash
cd /Users/patrickrosales/Code/claude-prompt-tester

# Install Ruby gems
bundle install

# Install JavaScript packages
yarn install
```

### 1b. Configure Environment

Create a `.env` file in the project root:

```bash
cat > .env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-YOUR-ACTUAL-KEY-HERE
RAILS_ENV=development
EOF
```

**Get your API key**:
1. Go to https://console.anthropic.com
2. Click "API Keys" in sidebar
3. Create a new key
4. Copy and paste into `.env`

**Important**: Never commit `.env` to git!

### 1c. Setup Database

```bash
# Create database
rails db:create

# Run migrations
rails db:migrate
```

## Step 2: Run the Application (2 minutes)

```bash
# From project root:
./bin/dev
```

This starts:
- Rails server on http://localhost:3000
- JavaScript bundler (esbuild)
- CSS bundler

**Wait 5-10 seconds for everything to compile**, then:

1. Open http://localhost:3000 in your browser
2. You should see the Prompt Tester interface
3. Enter a prompt in the textarea
4. Click "Run" to test with Claude

## Step 3: Try It Out (2 minutes)

### Basic Test

1. **Enter a prompt**:
   ```
   What are the key differences between machine learning and deep learning?
   ```

2. **Keep default settings**:
   - Model: Claude 3.5 Sonnet
   - Temperature: 0.7
   - Max Tokens: 1024

3. **Click "Run"** and watch the response appear

### Compare Models

1. **Keep the same prompt**
2. **Click "+ Add Column"** (bottom left)
3. **Change second column model** to "Claude 3 Haiku"
4. **Change temperature** to 0.3
5. **Click Run on both** columns
6. **Compare outputs** side-by-side

Perfect! You're now comparing Claude models live.

## Understanding What You Built

### What Just Happened?

```
Your Prompt Text
     ↓
Shared across all columns via React Context
     ↓
Each column has independent:
  - Model selection
  - Temperature setting
  - Max tokens
  - Run button
     ↓
Click Run → API call to Rails backend
     ↓
Rails backend calls Anthropic Claude API
     ↓
Response returned and displayed in column
```

### Key Components

- **PromptInput**: Where you type your prompt
- **ComparisonColumns**: Each shows one model's output
- **ParameterControls**: Model, temperature, token settings
- **ResponseDisplay**: Shows response or loading/error state

See `/COMPONENT_GUIDE.md` for detailed component reference.

## Next: Explore & Customize

### Option A: Try Different Prompts

1. **Brainstorm**: Test creative prompts with high temperature (0.9)
2. **Analyze**: Test analytical prompts with low temperature (0.1)
3. **Compare**: See how each model handles different types

### Option B: Modify the UI

1. Open `/app/javascript/styles/promptTester.css`
2. Find `.prompt-tester-header` (around line 10)
3. Change the gradient colors:
   ```css
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   ```
4. Save and refresh browser - changes appear instantly!

### Option C: Add a Feature

Want to add something new? See examples in `/EXTENSION_GUIDE.md`:
- Add a response copy button
- Add response metadata (tokens, latency)
- Add system prompt editor
- Save comparisons to database

## Troubleshooting

### "Cannot find module 'react'"

**Cause**: Dependencies not installed
**Fix**:
```bash
yarn install
./bin/dev  # Restart
```

### "API Error: Unauthorized"

**Cause**: API key missing or invalid
**Fix**:
```bash
# Check .env file exists
cat .env

# Verify key is correct in console.anthropic.com
# Restart server after fixing:
./bin/dev
```

### "Port 3000 already in use"

**Cause**: Another service running on port 3000
**Fix**:
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (replace PID with the number)
kill -9 <PID>

# Or use different port
rails server -p 3001
```

### React not rendering / blank page

**Cause**: JavaScript bundle not built
**Fix**:
```bash
# Stop the server (Ctrl+C)
# Restart with:
./bin/dev

# Wait 10 seconds for compilation
# Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

For more troubleshooting, see `/SETUP.md` Troubleshooting section.

## Understanding the Code Structure

```
/app/javascript/
├── components/           ← React components (PromptTester, PromptInput, etc.)
├── context/              ← Shared state (PromptContext)
├── hooks/                ← Custom hooks (usePromptComparison)
├── services/             ← API calls (apiService.js)
└── styles/               ← CSS (promptTester.css)

/app/controllers/
├── home_controller.rb    ← Renders React app
└── api/
    └── prompts_controller.rb  ← Claude API calls

/app/views/
└── home/
    └── index.html.erb    ← <div id="react-root"></div>
```

See `/ARCHITECTURE.md` for detailed architecture explanation.

## Key Files to Know

| File | Purpose |
|------|---------|
| `SETUP.md` | Installation & development guide |
| `ARCHITECTURE.md` | How the application is designed |
| `COMPONENT_GUIDE.md` | Detailed reference for each component |
| `EXTENSION_GUIDE.md` | Patterns for adding new features |
| `.env` | Your API key (keep private!) |
| `/app/javascript/components/PromptTester.jsx` | Main React app |
| `/app/controllers/api/prompts_controller.rb` | Backend API |

## Common Tasks

### Task: Change the App Title

**File**: `/app/javascript/components/PromptTester.jsx`

Find:
```jsx
<h1 className="prompt-tester-title">Claude Prompt Tester</h1>
```

Change to:
```jsx
<h1 className="prompt-tester-title">My Prompt Analyzer</h1>
```

Save and refresh browser.

### Task: Add a Helpful Hint

**File**: `/app/javascript/components/PromptInput.jsx`

Find:
```jsx
<small>This prompt will be sent...</small>
```

Add more hints in this section.

### Task: Change Colors

**File**: `/app/javascript/styles/promptTester.css`

Find color variables (around line 1-20):
```css
.prompt-tester-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Change hex colors to your preference. Test colors at https://htmlcolorcodes.com

### Task: Adjust Layout

CSS Grid controls the column layout. Find:
```css
.comparison-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}
```

Change `400px` to make columns wider or narrower.

## Development Tips

### Seeing Changes in Real-Time

1. Edit React component (e.g., PromptInput.jsx)
2. Save file
3. Browser auto-refreshes with changes
4. No manual restart needed!

### Checking What's Happening

Open browser DevTools (F12):
- **Console tab**: See any JavaScript errors
- **Network tab**: See API calls to `/api/prompts/compare`
- **Application tab**: Inspect React state (with React DevTools extension)

### Debugging API Calls

In browser DevTools Network tab:
1. Filter to XHR (XMLHttpRequest)
2. Click "Run"
3. See POST request to `/api/prompts/compare`
4. Click request to see:
   - Request payload (what you sent)
   - Response (what Claude returned)
   - Status (200 = success)

### Debugging Rails Backend

Watch the Rails log:
```bash
# In a new terminal:
tail -f log/development.log

# Then perform an action (click Run)
# You'll see Rails processing the request
```

## Next Steps

### Short Term (Today)
1. ✓ Get it running
2. ✓ Try a few prompts
3. ✓ Compare models
4. Try changing temperature/model to see differences

### Medium Term (This Week)
1. Read `/ARCHITECTURE.md` to understand how it works
2. Try modifying colors/layout
3. Add a feature from `/EXTENSION_GUIDE.md` (copy button, export, etc.)
4. Show it to your team!

### Long Term (This Month)
1. Deploy to production (Heroku, Docker, etc.)
2. Add advanced features (streaming, A/B testing, database storage)
3. Customize for your specific use case
4. Share with your organization

## Learning Resources

### This Project
- `SETUP.md` - Full setup guide
- `ARCHITECTURE.md` - System design
- `COMPONENT_GUIDE.md` - Component reference
- `EXTENSION_GUIDE.md` - Adding features

### External Resources
- **React**: https://react.dev
- **Rails**: https://guides.rubyonrails.org
- **Claude API**: https://docs.anthropic.com
- **CSS Grid**: https://web.dev/css-grid/

## Getting Help

### If Something's Wrong

1. **Check `.env` file**
   ```bash
   cat .env
   ```
   Should contain your ANTHROPIC_API_KEY

2. **Check logs**
   ```bash
   tail -f log/development.log
   ```
   Look for error messages

3. **Check browser console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages

4. **Review SETUP.md Troubleshooting**
   - Covers common issues
   - Has solutions

### Still Stuck?

Check these files for relevant information:
1. `/SETUP.md` - Installation issues
2. `/ARCHITECTURE.md` - Understanding design
3. `/COMPONENT_GUIDE.md` - Component reference
4. `/EXTENSION_GUIDE.md` - Adding features

## Summary

You now have:

- ✓ A working Claude Prompt Tester
- ✓ Side-by-side model comparison
- ✓ Parameter controls (temperature, max tokens, model selection)
- ✓ Professional UI with responsive design
- ✓ Complete documentation
- ✓ Clear patterns for extending the app

**Start with `./bin/dev` and explore!**

## FAQ

**Q: Can I use this in production?**
A: Yes! It's production-ready. See deployment section in `/SETUP.md` for Heroku/Docker.

**Q: Can I add more than 4 columns?**
A: Yes, edit `/app/javascript/components/ComparisonGrid.jsx` and increase the limit.

**Q: Can I save comparisons to a database?**
A: Yes, see `/EXTENSION_GUIDE.md` for the database feature pattern.

**Q: Can I add custom prompts/templates?**
A: Yes, see `/EXTENSION_GUIDE.md` for the Prompt Templates feature.

**Q: How much does this cost to run?**
A: Only for API calls to Claude (pricing at https://www.anthropic.com). The app itself costs nothing.

**Q: Can I deploy this myself?**
A: Absolutely! See deployment section in `/SETUP.md`.

## What's Next?

Choose one:

1. **[Explore More] → Read `/ARCHITECTURE.md`**
   - Understand how the app is structured
   - Learn design patterns used
   - See how everything connects

2. **[Try Features] → Add Something New**
   - Copy to clipboard button
   - Export responses
   - Token counter
   - See `/EXTENSION_GUIDE.md` for patterns

3. **[Go Production] → Deploy**
   - Heroku, Docker, or Manual
   - See `/SETUP.md` Deployment section

4. **[Customize] → Make It Yours**
   - Change colors
   - Add your branding
   - Adjust layout
   - Modify UI text

Pick whichever interests you most!

---

**Congratulations on having a working prompt testing tool! Happy comparing!**
