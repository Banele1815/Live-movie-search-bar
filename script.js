console.log("App loaded");
const searchInput = document.getElementById("searchInput");
const movies = document.querySelectorAll("#movieList li");
const noResultsMessage = document.getElementById("noResultsMessage");
const resetBtn = document.getElementById("resetBtn");

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase();
  let hasResults = false;

  movies.forEach(function (movie) {
    const text = movie.textContent.toLowerCase();

    if (text.includes(searchValue)) {
      movie.style.display = "list-item";
      hasResults = true;
    } else {
      movie.style.display = "none";
    }
  });

  // Show "No movies found"
  noResultsMessage.style.display = hasResults ? "none" : "block";
});

// Reset everything
resetBtn.addEventListener("click", function () {
  searchInput.value = "";

  movies.forEach(function (movie) {
    movie.style.display = "list-item";
  });

  noResultsMessage.style.display = "none";
});
