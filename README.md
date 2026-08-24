# FlyRank Capstone

Capstone project for the FlyRank Frontend AI Engineering Internship — a portfolio
demonstrating the ability to turn client ideas into simple, functional, and intuitive
web applications.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Getting Started

**Prerequisites:** Node.js 20.9+

```bash
git clone https://github.com/andresbleck/flyrank-capstone.git
cd flyrank-capstone
npm install
npm run dev
```

The app runs at `http://localhost:3000` by default.

## AI Tool: calculateMacros

The AI Coach can call this tool to work out someone's daily calories and macros using the Mifflin-St Jeor formula, instead of having the model guess the numbers itself.

It takes age, weight (kg), height (cm), sex, activity level (sedentary through very active), and a goal (lose, maintain, or gain), and returns `bmr`, `tdee`, `calories`, `protein`, `carbs`, `fat`, plus the goal it calculated for.

Zod checks that the inputs are the right type, but that's not enough on its own — a negative weight is still a valid number. So `execute` also checks that age is between 14 and 100 and that weight/height are positive, and throws a clear error if not.

## License

Released under the [MIT License](LICENSE).
