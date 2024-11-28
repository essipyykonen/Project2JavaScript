// API URLs 
const finnkino_url = 'http://www.finnkino.fi/xml/TheatreAreas'; // URL to fetch the list of theaters
const schedule_url = 'http://www.finnkino.fi/xml/Schedule/'; // URL to fetch the schedule for a specific theater
const movieInfoDiv = document.getElementById('movie-info'); // Get the div where movie information will be displayed

// Fetch theater list and populate dropdown
async function fetchTheaters() {
    try {
        const response = await fetch(finnkino_url); // Fetch data from the Finnkino API for theaters
        const data = await response.text(); // Convert the response to text format
        const parser = new DOMParser(); // Create a new DOMParser instance to parse the XML data
        const xml = parser.parseFromString(data, 'application/xml'); // Parse the text data into XML
        const theaters = xml.getElementsByTagName('TheatreArea'); // Get all 'TheatreArea' elements from the XML

        const select = document.getElementById('theater-select'); // Get the dropdown element for theater selection
        Array.from(theaters).forEach(theater => { // Loop through each theater
            const option = document.createElement('option'); // Create a new option element for the dropdown
            option.value = theater.getElementsByTagName('ID')[0].textContent; // Set the value of the option to the theater's ID
            option.textContent = theater.getElementsByTagName('Name')[0].textContent; // Set the display text of the option to the theater's name
            select.appendChild(option); // Append the option element to the dropdown
        });

        // Add event listener dynamically to dropdown
        select.addEventListener('change', (e) => fetchMovies(e.target.value)); // Fetch movies when the selected theater changes
    } catch (error) {
        console.error('Error fetching theaters:', error); // Log any errors that occur during fetching
    }
}

// Fetch movies for the selected theater
async function fetchMovies(theaterId) {
    try {
        const response = await fetch(`${schedule_url}?area=${theaterId}`); // Fetch the movie schedule for the selected theater
        const data = await response.text(); // Convert the response to text format
        const parser = new DOMParser(); // Create a new DOMParser instance to parse the XML data
        const xml = parser.parseFromString(data, 'application/xml'); // Parse the text data into XML
        const shows = xml.getElementsByTagName('Show'); // Get all 'Show' elements from the XML (each represents a movie)

        movieInfoDiv.innerHTML = ''; // Clear previous results from the movie info div
        Array.from(shows).forEach(show => { // Loop through each show (movie)
            const movieTitle = show.getElementsByTagName('Title')[0].textContent; // Get the movie title
            const imageSrc = show.getElementsByTagName('EventSmallImagePortrait')[0].textContent; // Get the image URL for the movie
            const showtime = show.getElementsByTagName('dttmShowStart')[0].textContent; // Get the movie's showtime

            // Create movie card to display movie information
            const movieCard = document.createElement('div'); // Create a new div for the movie card
            movieCard.className = 'movie-card'; // Assign a class to the movie card for styling

            const img = document.createElement('img'); // Create an image element for the movie poster
            img.src = imageSrc; // Set the source of the image to the movie's image URL
            img.alt = movieTitle; // Set the alt text of the image to the movie's title

            const title = document.createElement('h3'); // Create a heading element for the movie title
            title.textContent = movieTitle; // Set the text content of the heading to the movie's title

            const time = document.createElement('p'); // Create a paragraph element for the showtime
            time.textContent = `Showtime: ${new Date(showtime).toLocaleString()}`; // Format and set the showtime text

            // Append the movie details to the movie card
            movieCard.appendChild(img); // Add the image to the movie card
            movieCard.appendChild(title); // Add the title to the movie card
            movieCard.appendChild(time); // Add the showtime to the movie card

            // Append the movie card to the movie info div
            movieInfoDiv.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error fetching movies:', error); // Log any errors that occur during fetching
    }
}

// Initialize the app by fetching the theaters once the document is loaded
document.addEventListener('DOMContentLoaded', fetchTheaters); // Fetch theaters when the DOM content is fully loaded
