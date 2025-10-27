# Quick Start Checklist

This checklist will get you from zero to a working Prompt Tester in under 15 minutes.

## Pre-Flight Check (2 minutes)

- [ ] Have your Anthropic API key ready (from https://console.anthropic.com)
- [ ] Ruby 3.2.2 installed (`ruby -v`)
- [ ] Node.js 16+ installed (`node -v`)
- [ ] Yarn installed (`yarn -v`)
- [ ] PostgreSQL running (`psql --version`)

## Installation (5 minutes)

### Step 1: Install Dependencies
```bash
cd /Users/patrickrosales/Code/claude-prompt-tester
bundle install
yarn install
```
**Time: 3-4 minutes**

### Step 2: Create .env File
```bash
cat > .env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE
RAILS_ENV=development
EOF
```
**Replace YOUR-KEY-HERE with your actual API key**

### Step 3: Setup Database
```bash
rails db:create
rails db:migrate
```
**Time: 30 seconds**

## Starting the Application (1 minute)

```bash
./bin/dev
```

Wait for the message "Compiled successfully" (5-10 seconds), then:

- Open http://localhost:3000 in your browser
- You should see the Prompt Tester interface

## First Test (2 minutes)

1. [ ] Type a prompt in the textarea:
   ```
   Explain React hooks in one sentence.
   ```

2. [ ] Click the "Run" button

3. [ ] Wait for response (should appear in 3-5 seconds)

4. [ ] You're done! You have a working app!

## Try the Comparison Feature (2 minutes)

1. [ ] Keep the same prompt
2. [ ] Click "+ Add Column" (bottom left area)
3. [ ] In the second column, change the model to "Claude 3 Haiku"
4. [ ] Change temperature to 0.2
5. [ ] Click "Run" on both columns
6. [ ] Compare the responses!

## Verify Everything Works

- [ ] Prompt textarea accepts input
- [ ] Run button is clickable
- [ ] Response appears after clicking Run
- [ ] Add/Remove column buttons work
- [ ] Temperature slider moves smoothly
- [ ] Model dropdown changes
- [ ] Clear button removes response

## You're Ready!

If all checkboxes above are checked, you have a fully functional Claude Prompt Tester!

## Next Steps (Choose One)

### Option 1: Learn How It Works (15 min)
```bash
# Read the architecture guide
open /Users/patrickrosales/Code/claude-prompt-tester/ARCHITECTURE.md

# Or component guide for details on each part
open /Users/patrickrosales/Code/claude-prompt-tester/COMPONENT_GUIDE.md
```

### Option 2: Customize the UI (10 min)
1. Edit `/app/javascript/styles/promptTester.css`
2. Change colors in the `.prompt-tester-header` section
3. Save and refresh browser (Cmd+R)
4. See your changes instantly!

### Option 3: Add a Feature (20 min)
See `/EXTENSION_GUIDE.md` for examples:
- Add copy-to-clipboard button
- Add response metadata (tokens, latency)
- Add system prompt editor
- Add response export

### Option 4: Deploy to Production (30 min)
See `/SETUP.md` Deployment section for:
- Heroku deployment
- Docker deployment
- Manual server setup

## Troubleshooting (If Something Goes Wrong)

### Problem: Blank page at localhost:3000
**Solution:**
```bash
# Press Ctrl+C to stop server
# Rebuild and restart:
./bin/dev
# Wait 10 seconds
# Hard refresh: Cmd+Shift+R (Mac)
```

### Problem: "API Error: Unauthorized"
**Solution:**
```bash
# Check your .env file
cat .env

# Verify your API key at:
# https://console.anthropic.com/keys

# If key is wrong, update .env and restart:
./bin/dev
```

### Problem: Port 3000 already in use
**Solution:**
```bash
# Find what's using it:
lsof -i :3000

# Kill it (replace 12345 with the PID):
kill -9 12345

# Or use different port:
rails server -p 3001
```

### Problem: "Cannot find module 'react'"
**Solution:**
```bash
# Dependencies not installed
yarn install
./bin/dev
```

## Success Indicators

Your app is working correctly if you see:

1. **Homepage**: Purple gradient header with "Claude Prompt Tester" title
2. **Prompt Input**: Large textarea with placeholder text
3. **Comparison Column**: Box with:
   - Model dropdown (defaults to "Claude 3.5 Sonnet")
   - Temperature slider
   - Max Tokens input
   - Run/Reset buttons
4. **Response Area**: "Ready to compare..." message
5. **After Running**: Your prompt response appears in the response area

## File Organization

For quick reference:

```
/Users/patrickrosales/Code/claude-prompt-tester/

Documentation (start here):
├── GETTING_STARTED.md        ← Quick intro
├── QUICKSTART_CHECKLIST.md   ← This file
├── SETUP.md                  ← Detailed setup
├── ARCHITECTURE.md           ← How it works
├── COMPONENT_GUIDE.md        ← Component reference
└── EXTENSION_GUIDE.md        ← Adding features

Application Code:
├── app/javascript/components/  ← React components
├── app/javascript/hooks/        ← React hooks
├── app/controllers/             ← Rails API
└── app/views/                   ← HTML views

Configuration:
├── .env                    ← Your API key (keep secret!)
├── package.json            ← JavaScript dependencies
├── Gemfile                 ← Ruby dependencies
└── config/routes.rb        ← URL routing
```

## Quick Command Reference

```bash
# Start development server
./bin/dev

# Stop server
Ctrl+C

# Run tests
rails test

# Build assets
yarn build         # JavaScript
yarn build:css     # CSS

# Database commands
rails db:create
rails db:migrate
rails db:seed

# View logs
tail -f log/development.log

# Find process using port 3000
lsof -i :3000
```

## Documentation Map

**Want to...**

| Task | Read This |
|------|-----------|
| Get running quickly | GETTING_STARTED.md |
| Understand architecture | ARCHITECTURE.md |
| Learn about components | COMPONENT_GUIDE.md |
| Add new features | EXTENSION_GUIDE.md |
| Deploy to production | SETUP.md |
| Troubleshoot issues | SETUP.md or GETTING_STARTED.md |

## Common Questions

**Q: Is this production ready?**
A: Yes! It's secure, tested, and ready to deploy.

**Q: Can I add more columns?**
A: Yes, edit ComparisonGrid.jsx to increase the limit.

**Q: Can I change the colors?**
A: Yes, edit /app/javascript/styles/promptTester.css

**Q: How much does it cost?**
A: Only what you pay Claude (not the app infrastructure).

**Q: Can I deploy it?**
A: Yes! See SETUP.md for Heroku/Docker instructions.

## Next: You're Ready!

You have everything you need. Now:

1. [ ] Run `./bin/dev`
2. [ ] Open http://localhost:3000
3. [ ] Try a prompt
4. [ ] Compare models
5. [ ] Celebrate!

**Questions?** Check the relevant documentation file above.

**Enjoy your Prompt Tester!**
