# Runora: Personal Budget Tracking App

## Overview

Runora is a mobile budget tracking application built with React Native, designed to help users manage their personal finances effortlessly. Track your income, expenses, set budgets, and gain insights into your spending habits with an intuitive and user-friendly interface.

## Features

- **Expense Tracking**: Easily log and categorize your daily expenses
- **Income Management**: Record and track multiple income sources
- **Budget Planning**: Set monthly budgets for different expense categories
- **Financial Insights**: Visualize spending patterns with interactive charts(currently in development)
- **Multi-Currency Support**: Track expenses in multiple currencies
- **Secure Authentication**: Protect your financial data with secure login(currently in development)
- **Offline Mode**: Access and update your financial information without an internet connection

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18 or later)
- Jdk 17 or better 
- npm or Yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/runora.git
   cd runora
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add necessary configuration variables (database connection, API keys, etc.)

4. Run the application:
   ```bash
   # For Android
   npx react-native run-android

   # For iOS
   npx react-native run-ios
   ```

## Technologies Used

- **Frontend**: React Native
- **State Management**: Redux
- **Backend**: Firebase/Node.js
- **Database**: Firestore
- **Authentication**: Firebase Authentication
- **Charting**: React Native Charts
- **Styling**: Styled Components

## Project Structure

```
runora/
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── redux/
│   ├── services/
│   └── utils/
│
├── assets/
│   ├── icons/
│   └── images/
│
├── __tests__/
│
├── android/
├── ios/
├── .env
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## Roadmap

- [ ] Add recurring transaction support
- [ ] Implement advanced financial reporting
- [ ] Create web application version
- [ ] Add investment tracking features

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Neeraj Butola - neerajbutola8910@gmail.com

Project Link: [https://github.com/Frostdev7506/runora](https://github.com/Frostdev7506/runora)
Landing Page: [https://runora.netlify.app](https://runora.netlify.app)

## Acknowledgements

- [React Native](https://reactnative.dev/)
- [Redux](https://redux.js.org/)
