const searchinput = document.getElementById("searchinput");
const movies = document.querySelectorAll("#movielist li");

searchinput.addEventListener("input", function () {
  const searchValue = searchinput.value.toLowerCase();

  movies.forEach(function (movie) {
    const title = movie.querySelector("span").textContent.toLowerCase();

    if (searchValue !== "" && title.includes(searchValue)) {
      movie.style.display = "";
    } else {
      movie.style.display = "none";
    }
  });
});