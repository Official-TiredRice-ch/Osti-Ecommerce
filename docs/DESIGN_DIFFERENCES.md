# 🎨 Search Results Design - Local vs Online

## Design Philosophy

### LOCAL PRODUCTS (In-Store)
- **Layout**: Full-width horizontal cards
- **Style**: Premium, detailed, trustworthy
- **Color Scheme**: Blue (#007AFF) - professional and reliable
- **Purpose**: Encourage immediate purchase from your store

### ONLINE PRODUCTS (External)
- **Layout**: 2-column grid (compact cards)
- **Style**: External link appearance, informational
- **Color Scheme**: Source-specific colors (Google blue, Shopee orange, Lazada navy)
- **Purpose**: Show alternatives, drive traffic to external sites

---

## 📱 LOCAL PRODUCT CARD FEATURES

### Visual Design:
```
┌─────────────────────────────────────────┐
│  [Icon]  ✓ In Stock                    │
│  [80x80] Product Name                   │
│          Description text...            │
│          ₱45,999    Stock: 15           │
│          [🛒 Add to Cart]               │
└─────────────────────────────────────────┘
```

### Key Elements:
- ✅ **Green "In Stock" badge** - builds trust
- 📦 **Large product icon** (80x80px) - prominent display
- 📝 **Full description** - 2 lines visible
- 💰 **Large price** (18px, bold) - clear pricing
- 📊 **Stock count** - creates urgency
- 🛒 **"Add to Cart" button** - direct action
- 🎨 **White background** - clean, premium feel
- 🌟 **Shadow effect** - elevated appearance

### Colors:
- Background: `#FFFFFF` (white)
- Primary: `#007AFF` (blue)
- Success: `#34C759` (green)
- Text: `#1C1C1E` (dark)

---

## 🌐 ONLINE PRODUCT CARD FEATURES

### Visual Design:
```
┌──────────────┐  ┌──────────────┐
│ [GOOGLE] ↗  │  │ [SHOPEE] ↗  │
│   [Icon]     │  │   [Icon]     │
│ Product Name │  │ Product Name │
│ Description  │  │ Description  │
│ ₱35,999      │  │ ₱32,999      │
│ [View Online]│  │ [View Online]│
└──────────────┘  └──────────────┘
```

### Key Elements:
- 🏷️ **Source badge** - color-coded by platform
  - Google: `#4285F4` (blue)
  - Shopee: `#EE4D2D` (orange)
  - Lazada: `#0F156D` (navy)
- ↗️ **External link icon** - indicates leaving app
- 🔗 **Link icon** in image area - external content
- 📝 **Compact description** - 1 line only
- 💰 **Orange price** (#FF9500) - different from local
- 👁️ **"View Online" button** - opens external link
- 🎨 **Gray background** (#F8F9FA) - less prominent
- 📏 **Border** - contained appearance

### Colors:
- Background: `#F8F9FA` (light gray)
- Border: `#E5E5EA` (gray)
- Price: `#FF9500` (orange)
- Button: White with blue border

---

## 📊 SECTION HEADERS

### Available in Store
```
🏠 Available in Store (5)
─────────────────────────
```
- Icon: House (🏠)
- Color: Blue (#007AFF)
- Shows count of local products

### Found Online
```
🌐 Found Online (8)
─────────────────────────
```
- Icon: Globe (🌐)
- Color: Orange (#FF9500)
- Shows count of online products

---

## 🎯 USER EXPERIENCE BENEFITS

### For Local Products:
1. **Immediate Trust** - "In Stock" badge
2. **Clear Information** - Full details visible
3. **Direct Action** - One-tap add to cart
4. **Urgency** - Stock count visible
5. **Premium Feel** - White cards with shadows

### For Online Products:
1. **Clear Source** - Color-coded badges
2. **External Indicator** - Arrow icons
3. **Compact View** - See more options at once
4. **Easy Comparison** - Grid layout
5. **Safe Navigation** - "View Online" makes intent clear

---

## 🔄 LAYOUT COMPARISON

### Before (Old Design):
- All products looked the same
- Hard to distinguish local vs online
- No visual hierarchy
- Confusing user experience

### After (New Design):
- ✅ Clear visual separation
- ✅ Local products prioritized (full width)
- ✅ Online products grouped (2-column grid)
- ✅ Source-specific branding
- ✅ Different call-to-action buttons
- ✅ Section headers for organization

---

## 📱 RESPONSIVE BEHAVIOR

### Local Cards:
- Always full width (100%)
- Horizontal layout (image + info)
- Stacks vertically on scroll

### Online Cards:
- 2 columns (48% width each)
- Vertical layout (image on top)
- Grid wraps automatically

---

## 🎨 COLOR PSYCHOLOGY

### Blue (Local) = Trust & Reliability
- Your store is trustworthy
- Products are verified
- Immediate availability

### Orange (Online) = Exploration & Options
- External alternatives
- Price comparison
- More choices available

### Source Colors = Brand Recognition
- Google Blue = Search results
- Shopee Orange = E-commerce
- Lazada Navy = Marketplace

---

## 🚀 NEXT STEPS

1. Test the new design in the app
2. Verify local products show correctly
3. Check online products display properly
4. Ensure section headers appear
5. Test on different screen sizes

Clear cache and restart:
```bash
cd frontend/eco-app
npx expo start --clear
```
