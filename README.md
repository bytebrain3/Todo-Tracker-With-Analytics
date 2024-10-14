
---

# Todo Tracker with Analytics Dashboard

A Todo Tracker app with an integrated analytics dashboard that helps users keep track of their tasks, deadlines, and progress. The app incentivizes task completion through a point system and provides detailed analytics to monitor performance over time.

## Features

### 1. **Task Management**
- Add tasks (todos) with deadlines.
- Mark tasks as complete or incomplete.
- Automatic point deduction for uncompleted tasks after the deadline.
- Point increments for successfully completed tasks.

### 2. **Point System**
- Points are rewarded or deducted based on task completion:
  - **Completed Todos:** Users earn points based on task difficulty and time.
  - **Uncompleted Todos:** Users lose points if the task is not completed before the deadline.
  
### 3. **Leaderboard**
- A leaderboard system where top users are ranked based on:
  - Task completion rate.
  - Total points earned.
- Compete with other users to reach the top of the leaderboard.

### 4. **History & Analytics**
- Detailed history of all completed and uncompleted tasks.
- Visual analytics showing:
  - Number of tasks completed over time.
  - Percentage of tasks completed versus uncompleted.
  - Trends in productivity and performance.

### 5. **User Dashboard**
- Users can view their performance metrics and progress through the dashboard.
- Access to history, analytics, and the leaderboard from a single view.

## How It Works

1. **Add Todos:** Users can add tasks with specific deadlines.
2. **Complete Tasks:** Tasks must be marked as completed before the deadline to earn points.
3. **Automatic Point Calculation:** 
   - If the task is completed on time, points are added.
   - If the task is not completed by the deadline, points are deducted automatically.
4. **Analytics Dashboard:** Users can track their task history, view completion trends, and analyze their productivity.
5. **Leaderboard:** Users can check their rank based on points and completion rate, competing to be at the top.

## Technologies Used

- **Frontend:** Vue.js 

- **Database:** Firebase 
- **State Management:** pinia 
- **Styling:** TailwindCSS



## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bytebrain3/Todo-Tracker-With-Analytics.git
   cd Todo-Tracker-With-Analytics
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (in `firebase.js` file):


4. Run the application:

   ```bash
   npm start
   ```

5. Navigate to `http://localhost:3000` to use the app.



## Contribution

Feel free to fork this repository and submit pull requests. All contributions are welcome to improve the functionality, UI, or add new features.

## License

This project is licensed under the MIT License.

---

