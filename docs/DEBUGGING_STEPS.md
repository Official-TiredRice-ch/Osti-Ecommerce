# Debugging Online Search - Step by Step

## What I Just Did:
1. ✅ Added request logging middleware to `backend/server.js` - will log ALL incoming requests
2. ✅ Added detailed logging to `onlineSearchService.js` - will show:
   - Google search URL being called
   - HTTP response status
   - HTML content length
   - Parsing results
   - Number of results found

## Next Steps:

### 1. RESTART THE BACKEND (IMPORTANT!)
```bash
cd backend
npm start
```

### 2. Test the Search
- Open your Expo app
- Search for "laptop" or any product
- Watch the backend console output

### 3. What to Look For:

#### Expected Console Output:
```
[2026-03-25T...] GET /api/search/hybrid
Query params: { query: 'laptop', includeOnline: 'true', sortBy: 'relevance' }
=== HYBRID SEARCH REQUEST ===
Query: laptop
Include Online: true
Sources: google,shopee,lazada
Performing hybrid search with online sources...
No cache, performing fresh search...
Searching online sources: [ 'google', 'shopee', 'lazada' ]
🔍 Google Search URL: https://cse.google.com/cse/publicurl?cx=51716db4e83394a7e&q=laptop
📡 Google response status: 200
📄 Google HTML length: XXXXX
🔍 Parsing Google HTML for query: laptop
✅ Found result 1: ...
📊 Total Google results parsed: X
Online results count: X
Results breakdown: { local: X, online: X, combined: X }
```

### 4. Possible Issues & Solutions:

#### Issue A: No "=== HYBRID SEARCH REQUEST ===" message
- **Problem**: Endpoint not being hit
- **Solution**: Check if frontend is calling the correct URL

#### Issue B: Google HTML length is 0 or very small
- **Problem**: Google is blocking the request
- **Solution**: Need to use a different approach (see below)

#### Issue C: "Total Google results parsed: 0"
- **Problem**: HTML structure doesn't match our regex
- **Solution**: Need to inspect the actual HTML and update parsing logic

## Alternative Solutions if Google Scraping Fails:

### Option 1: Use Google Custom Search Element (Widget)
- Embed Google's search widget directly in the app
- Free but requires iframe/webview

### Option 2: Use SerpAPI (Free Tier)
- 100 free searches/month
- Easy to integrate
- More reliable than scraping

### Option 3: Focus on Shopee/Lazada APIs
- Implement proper Shopee/Lazada API integration
- More relevant for e-commerce

### Option 4: Build Your Own Product Database
- Scrape products once and store in database
- Much faster and more reliable

## Current Status:
- ✅ Backend has extensive logging
- ✅ Frontend calls hybrid endpoint
- ⏳ Need to restart backend and test
- ⏳ Need to see actual console output to diagnose further
