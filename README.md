# Daily Meal Logging Application

A React-based wellness application for tracking daily meals, portions, feelings, and symptoms with an intuitive accordion-style interface.

## 📋 What I Built

A **single-page meal logging application** that allows users to:

- Log 4 meals daily (Breakfast, Lunch, Dinner, Snacks)
- Track food items with comma-separated input
- Select portion sizes (small, medium, large, or "no idea")
- Record post-meal feelings (great, good, okay, not-good, terrible)
- Log any symptoms experienced after meals
- Mark meals as skipped
- View yesterday's meals for quick repetition
- Auto-save all data to browser localStorage
- Track completion status with visual indicators

### Tech Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **UI Components:** shadcn/ui (Accordion, Alert, Badge, Button)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Storage:** Browser localStorage
- **Build Tool:** Vite

---

## 🎯 Assumptions Made

### 1. Data Persistence

- Users access the app from the same browser/device
- localStorage is sufficient (no multi-device sync needed)
- Data persists indefinitely unless user clears browser data
- No user authentication required

### 2. User Behavior

- Users log meals on the same day (real-time logging)
- Maximum 4 meal categories per day
- Food items are comma-separated (e.g., "Rice, Dal, Salad")
- Users understand portion sizes without precise measurements

### 3. Data Structure

- One date = one complete meal log
- Yesterday's data is pre-populated for first-time users (demo purposes)
- Symptoms are predefined (not custom user input)
- Feelings are rated on a 5-point scale

### 4. Browser Support

- Modern browsers with ES6+ support
- localStorage API available
- CSS Grid and Flexbox support

---

## 🧩 Component Breakdown

### Component Hierarchy

```
Index.tsx (Main Container)
├── MealCard.tsx (x4 - one per meal)
│   ├── PortionSelector.tsx (dynamic, based on items)
│   ├── FeelingSelector.tsx
│   └── SymptomChips.tsx
└── Alert Component (shadcn/ui)
```

### 1. Index.tsx (Main Container)

**Purpose:** Application root, state management, data persistence

**Key State:**

- `activeCard` - Which accordion card is open
- `mealsData` - All 4 meals data
- `isSubmitted` - Whether user submitted today
- `alert` - Success/error messages

**Key Functions:**

- `getMealLogsFromStorage()` - Read all dates from localStorage
- `saveMealLogsToStorage()` - Save today's data to localStorage
- `getYesterdayMeals()` - Fetch yesterday's items for suggestions
- `handleToggle()` - Expand/collapse meal cards
- `handleUpdate()` - Update specific meal data
- `handleSubmit()` - Validate and submit all meals

### 2. MealCard.tsx (Meal Accordion)

**Purpose:** Individual meal logging interface with expandable sections

**Key Features:**

- Auto-focus textarea when card expands
- Real-time parsing of comma-separated items
- Dynamic portion selectors (appear after items added)
- "Repeat Yesterday" chip for quick fill
- Skip checkbox with conditional UI
- Status badge (Pending/In Progress/Logged/Skipped)

### 3. PortionSelector.tsx (Smart Portion Selector)

**Purpose:** Contextual portion selection based on food type

**Smart Detection Logic:**

- Beverages (tea, coffee, juice) → Coffee icon with cup sizes
- Snacks (nuts, chips, cookies) → Cookie icon with handful/bowl
- Main meals → Utensils icon with plate sizes

### 4. FeelingSelector.tsx

**Purpose:** Post-meal feeling tracker with emoji buttons (Great, Good, Okay, Not Good, Terrible)

### 5. SymptomChips.tsx

**Purpose:** Multi-select symptom tracker (None, Bloating, Gas, Acidity, Nausea, Fatigue)

- "None" is mutually exclusive with other symptoms

---

## 🔄 State & Data Flow

### Data Flow Pattern

1. **Load:** localStorage → Component mount → mealsData state
2. **Update:** User input → handleUpdate() → setMealsData() → Auto-save useEffect
3. **Save:** mealsData changes → Auto-save → localStorage

### Key useEffect Hooks

- **Initialize Demo Data:** Runs once on mount
- **Load Today's Data:** Fetches from localStorage on mount
- **Auto-Save:** Triggers on every mealsData change
- **Auto-Focus:** Focuses textarea when card expands

---

## 🌐 REST API Design (Backend Integration)

### Authentication

- **POST /api/auth/register** - Register new user
- **POST /api/auth/login** - User login with JWT token

### Meal Logging

- **GET /api/meals?date=YYYY-MM-DD** - Fetch meals for specific date
- **POST /api/meals** - Create/update meals for a date
- **PATCH /api/meals/:date/:mealId** - Update single meal (auto-save)

### Analytics & History

- **GET /api/meals/history** - Fetch date range of meal logs
- **GET /api/meals/analytics** - Get insights (common foods, feelings, symptoms)

### Suggestions

- **GET /api/suggestions/foods?query=** - Autocomplete food items
- **GET /api/suggestions/yesterday** - Quick repeat yesterday's meals

### User Management

- **GET /api/user/preferences** - Fetch user settings
- **PATCH /api/user/preferences** - Update timezone, reminders, defaults

### Export

- **GET /api/export?format=csv|json|pdf** - Export meal logs

**API Assumptions:**

- RESTful design with JSON format
- JWT authentication via Authorization header
- ISO 8601 date format (YYYY-MM-DD)

---

## 🚨 Edge Cases & Limitations

### 1. Data Persistence

- localStorage can fail in private browsing mode
- Quota limits (~5-10MB)
- No backup/export functionality

### 2. Date/Time Issues

- Midnight boundary confusion (logging at 11:59 PM vs 12:01 AM)
- Timezone changes during travel
- No historical editing capability

### 3. Input Parsing

- Special characters in food names (parentheses, slashes)
- Very long food names causing UI overflow
- Empty input (only commas/spaces) not validated

### 4. State Synchronization

- Multiple tabs can cause data conflicts
- Race conditions with rapid typing (auto-save)
- No cross-tab sync

### 5. Portion Selection

- Ambiguous food detection ("tea biscuit" - beverage or snack?)
- Unselected portions not validated before submission

### 6. Mobile/Responsive

- Auto-focus triggers keyboard unexpectedly on mobile
- Small touch targets for portion buttons (<44px)

### 7. Accessibility

- No keyboard navigation (Tab, Enter, Escape)
- Missing ARIA labels for screen readers
- Status changes not announced

### 8. Performance

- Large localStorage data after months of use
- Animation jank with many food items
- No lazy loading or virtualization

### 9. Data Loss

- Browser data clear removes all history
- No warning or export prompt
- Confusing submission state after refresh

---

## 🚀 Improvements with 2 More Hours

### Priority 1: High Impact (60 mins)

1. **Debounced Auto-Save (15 min)** - Reduce localStorage writes by ~80%
2. **Cross-Tab Sync (20 min)** - Listen to storage events for multi-tab support
3. **Input Validation (25 min)** - Character limits, empty input checks, error messages

### Priority 2: Medium Impact (45 mins)

4. **Keyboard Shortcuts (15 min)** - Ctrl+S to submit, Ctrl+1-4 for meals, Escape to close
5. **Smart Suggestions (20 min)** - Learn from last 7 days, show top 5 frequent foods
6. **Data Export (10 min)** - Download JSON backup

### Priority 3: Nice-to-Have (15 mins)

7. **Loading States (10 min)** - Optimistic UI updates with "Saving..." indicator
8. **Accessibility (5 min)** - Add ARIA labels, keyboard handlers, screen reader announcements

---

## 🚨 Known Issues

### What Won't Work:

1. **Private Browsing Mode** - localStorage disabled
2. **Multiple Devices** - No cloud sync, data stays local
3. **Date Changes at Midnight** - Refresh after midnight loses "today's" context
4. **Large Data Sets** - Performance degrades after 365+ days of logs
5. **Mobile Safari Auto-focus** - Keyboard pops up automatically (annoying UX)
6. **Screen Readers** - Most UI not accessible without ARIA
7. **Simultaneous Edits** - Last write wins in multi-tab scenario
8. **Food Name Edge Cases** - "Coffee tea" treated as beverage (first match wins)

---

## 🏁 Getting Started

### Installation

```bash
git clone https://github.com/archit-srivastava-d2k/Daily_Meal_logging.git
cd Daily_Meal_logging
npm install  # or bun install
npm run dev  # or bun dev
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏆 Summary

### Key Strengths

- ✅ Intuitive accordion UI with smooth animations
- ✅ Real-time auto-save (no manual save needed)
- ✅ Context-aware portion sizes (beverages vs meals)
- ✅ Smart "Repeat Yesterday" feature
- ✅ Clean React patterns with TypeScript

### Areas for Improvement

- ❌ Backend integration for multi-device sync
- ❌ Enhanced validation and error handling
- ❌ Accessibility (ARIA, keyboard navigation)
- ❌ Performance optimization for large datasets
- ❌ Data export/import functionality

### Technical Highlights

- **State Management:** Local React state with useCallback optimization
- **Data Persistence:** localStorage with auto-save on every change
- **Type Safety:** Full TypeScript with interfaces for MealData
- **Performance:** Memoized handlers, potential for debouncing
- **Scalability:** Component composition ready for feature expansion

**Total Implementation Time:** ~20 hours  
**With 2 More Hours:** Debouncing, cross-tab sync, validation, keyboard shortcuts, accessibility

---

**Built by:** Archit Srivastava  
**Date:** December 25, 2025  
**Tech Stack:** React 18 + TypeScript + Tailwind CSS + Framer Motion
