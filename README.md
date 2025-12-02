# Bill Splitter App

A modern, intuitive web application built with Next.js and TypeScript for splitting expenses fairly among friends. Perfect for group dinners, trips, or any shared expenses.

<p align="center">
  <img src="./public/bill-splitter.png" alt="Bill Splitter Banner" />
</p>

## Features

### 📊 Dual Tab System

- **Expenses Tab**: List all items purchased with prices and quantities
- **Members Tab**: Track who paid what amount

### 💰 Smart Validation

- Real-time calculation of total expenses and payments
- Visual difference indicator showing balance status
- Calculate button only enabled when totals match
- Color-coded status (Green = matched, Red = mismatch)

### 🧮 Intelligent Settlement

- Calculates fair share per person
- Generates optimal settlement plan
- Minimizes number of transactions needed
- Shows who owes whom and exact amounts

### 🎨 Modern UI/UX

- Clean, gradient-based design
- Fully responsive (mobile & desktop)
- Smooth transitions and animations
- Intuitive tab navigation

## How to Use

### Step 1: Add Expenses

1. Click on the **Expenses** tab
2. Enter item name (e.g., "Pizza", "Drinks")
3. Enter price per item
4. Enter units/quantity (default is 1)
5. Click "Add Expense" for more items
6. Remove items with the trash icon

### Step 2: Add Members

1. Click on the **Members** tab
2. Enter member's name
3. Enter amount they paid
4. Click "Add Member" for more people
5. Remove members with the trash icon

### Step 3: Verify & Calculate

1. Check the status display at the top
2. Ensure "Total Expenses" matches "Total Paid"
3. Difference should be ₹0.00 (green)
4. Click "Calculate Split" button

### Step 4: View Settlement Report

1. See per-person fair share
2. Review individual contributions
3. Check settlement transactions
4. Click "Back to Edit" to make changes

## Example Scenario

**Group Dinner:**

- **Expenses:**

  - Pizza: ₹800 × 2 = ₹1,600
  - Drinks: ₹100 × 4 = ₹400
  - Total: ₹2,000

- **Members:**

  - Alice paid: ₹1,500
  - Bob paid: ₹300
  - Charlie paid: ₹200
  - Total: ₹2,000 ✓

- **Settlement:**
  - Fair share per person: ₹666.67
  - Bob pays ₹366.67 to Alice
  - Charlie pays ₹466.67 to Alice

## Technology Stack

- **Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)

## Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd bill-splitter

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bill-splitter/
├── app/
│   ├── page.tsx          # Main component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── tailwind.config.ts    # Tailwind config
```

## Key Components

### Interfaces

- `Expense`: Tracks individual expense items
- `Member`: Tracks who paid what amount
- `Settlement`: Represents payment transactions

### Main Functions

- `getExpensesTotal()`: Calculates sum of all expenses
- `getMembersTotal()`: Calculates sum of all payments
- `getDifference()`: Shows payment vs expense difference
- `calculateSettlements()`: Generates optimal settlement plan
- `canCalculate()`: Validates before calculating split

## Algorithm

The settlement algorithm uses a greedy approach:

1. Calculate each person's fair share (total ÷ people)
2. Determine who overpaid (creditors) and underpaid (debtors)
3. Match debtors with creditors optimally
4. Minimize total number of transactions

## Features in Detail

### Real-time Validation

- Continuously monitors expense and payment totals
- Provides visual feedback on balance status
- Prevents calculation until data is valid

### Dynamic Forms

- Add/remove expenses and members on the fly
- All fields validated in real-time
- Automatic total calculations

### Responsive Design

- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface

## Tips for Best Results

1. **Be Accurate**: Enter exact amounts to avoid rounding errors
2. **Double Check**: Verify totals match before calculating
3. **Use Units**: For multiple identical items, use the units field
4. **Clear Names**: Use clear, identifiable names for expenses and members
5. **Review Report**: Always review the settlement report before making payments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for splitting bills fairly**
