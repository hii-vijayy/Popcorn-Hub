# Movie Hub

A React-based movie app that fetches and displays popular movies from Bollywood, Hollywood, and Punjabi cinema. The app allows users to search for movies and view their details by clicking on the movie cards.

<img src="src\assets\moviehub.png" alt="MovieHub Output" />

## Features

- **Movie Sections**: View Bollywood, Hollywood, and Punjabi movies.
- **Search Functionality**: Search movies by title across all sections.
- **Infinite Scroll**: Scroll through pages of movies with dynamic content loading.
- **Responsive Design**: Mobile-friendly design that adapts to different screen sizes.
- **Movie Details**: Click on any movie card to view additional details     .

## Tech Stack

- **Frontend**: React, HTML5, CSS3, JavaScript
- **API**: The Movie Database (TMDb) API for fetching movie data
- **State Management**: React's `useState` and `useEffect` hooks
- **Styling**: Custom CSS for styling components

## Setup

### Prerequisites

- Node.js and npm installed on your machine.

### Install Dependencies

1. Clone the repository:

    ```bash
    git clone https://github.com/hii-vijayy/MovieSearchApp.git
    ```

2. Navigate to the project directory:

    ```bash
    cd MovieSearchApp
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Set up your environment variables:
   
    Create a `.env` file in the root directory and add your API key for TMDb:

    ```bash
    VITE_IMDB_APP_API_KEY=<your-api-key>
    ```

    You can get an API key by signing up at [TMDb](https://www.themoviedb.org/).

### Run the App

Start the development server:
    `
 npm run dev
    `

## Future Features

- **Movie Details Page**: View detailed information about the movie when clicked.
- **Pagination**: Add buttons for users to navigate through different pages of movie results.
- **User Authentication**: Option for users to save their favorite movies.
- **Dark Mode**: Add a dark mode toggle for a better user experience.