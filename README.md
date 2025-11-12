# Frontend Take-Home Assignment: "BookWorm" Search

Thank you for taking the time to complete this assignment. This exercise is designed to assess your skills in building a performant, real-world React application.

**Please limit your time to 1.5 hours.** We are more interested in your approach to the core problem than a perfectly polished, feature-complete solution.

## 🎯 Goal
Build a React application that searches for books using the Open Library API and displays the results in an **infinite-scrolling** list.

## 📚 Context
You are building a book search app. A simple search query can return millions of results, so your application must be performant and cannot fetch all the data at once.

## 📡 API Endpoint

You will use the free **Open Library Search API**.

* **URL:** `https://openlibrary.org/search.json`
* **Query Parameters:**
    * `q`: Your search query (e.g., `lord of the rings`)
    * `page`: The page number to fetch (e.g., `1`)
* **Example Fetch:** `https://openlibrary.org/search.json?q=lord+of+the+rings&page=1`

The list of books can be found in the `docs` array of the JSON response. You will need to display the `title` and the `author_name` (which is an array; displaying just the first author is fine).

## 📋 Requirements

### Project Setup
1.  Bootstrap the project using **Vite** or **Create React App**.
2.  You may use JavaScript or TypeScript.

### Core Functionality
1.  The app should have a single text input for the search query.
2.  When the user executes a search (e.g., after they stop typing), fetch **page 1** of the results for that query.
3.  Display the results in a list, showing each book's **title** and **author**.
4.  Implement **infinite scrolling**: As the user scrolls to the bottom of the list, your app should automatically fetch the *next* page (`page=2`, then `page=3`, etc.) and **append** the new results to the existing list.
5.  Display a "Loading..." message at the bottom of the list while the next page is being fetched.
6.  A new search (i.e., changing the text in the search box) should clear all old results and start a new list from `page=1`.
7.  If a search returns **0 results**, display a "No books found." message.
8.  If the API call **fails** (e.g., a network error or a 5xx response), display a user-friendly error message (e.g., "Failed to fetch books. Please try again.").

---

## ⚠️ Important Notes

1.  **No Data-Fetching Libraries:** Please handle all data fetching and state management using **only core React hooks** (e.g., `useState`, `useEffect`, `useRef`). **Do not use React Query, SWR,** or other external data-fetching libraries.
2.  **Focus on Functionality:** **Styling is not important.** Do not spend time on CSS. We are focused on the application logic, state management, and performance.

---

## 📤 Deliverables

Please create a github repo containing your solution and share the link.
Good luck!
