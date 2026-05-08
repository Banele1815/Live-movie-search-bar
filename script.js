<<<<<<< HEAD
const searchinput = document.getElementById("searchinput");
const movies = document.querySelectorAll("#movielist li");

searchinput.addEventListener("input", function () {
  const searchValue = searchinput.value.toLowerCase();

  movies.forEach(function (movie) {
    const title = movie.querySelector("span").textContent.toLowerCase();

    if (searchValue !== "" && title.includes(searchValue)) {
      movie.style.display = "";
=======
console.log("App loaded");

// ─── Banele: Search Input Component ───────────────────────────────────────────

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const searchStatus = document.getElementById("searchStatus");

let debounceTimer = null;

searchInput.addEventListener("input", function (e) {
  const raw = e.target.value;
  const trimmed = raw.trim();

  clearBtn.style.display = raw.length > 0 ? "inline-block" : "none";

  if (raw === "") {
    searchStatus.textContent = "";
    dispatchSearch("");
    return;
  }

  if (trimmed === "") {
    searchStatus.textContent = "⚠ Input contains only spaces.";
    return;
  }

  if (raw.length >= 90) {
    searchStatus.textContent = `⚠ Getting long — ${raw.length}/100 characters.`;
  } else {
    searchStatus.textContent = `Searching for "${trimmed}"…`;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function () {
    dispatchSearch(trimmed);
  }, 350);
});

clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  clearBtn.style.display = "none";
  searchStatus.textContent = "";
  searchInput.focus();
  dispatchSearch("");
});

function dispatchSearch(query) {
  document.dispatchEvent(
    new CustomEvent("movie:search", { detail: { query } })
  );
}

// ─── End Banele's section ──────────────────────────────────────────────────────


// ─── Teammate: Filter + Results Component ─────────────────────────────────────

const movies = document.querySelectorAll("#movieList li");
const noResultsMessage = document.getElementById("noResultsMessage");

document.addEventListener("movie:search", function (e) {
  const query = e.detail.query;
  let hasResults = false;

  movies.forEach(function (movie) {
    const text = movie.textContent.toLowerCase();
    if (query === "" || text.includes(query.toLowerCase())) {
      movie.style.display = "list-item";
      hasResults = true;
>>>>>>> 40ef8d824ec200866bd68b0218b8c7f6f658b73b
    } else {
      movie.style.display = "none";
    }
  });
<<<<<<< HEAD
});
=======

  noResultsMessage.style.display = hasResults ? "none" : "block";
});

// ─── End Teammate's section ───────────────────────────────────────────────────
>>>>>>> 40ef8d824ec200866bd68b0218b8c7f6f658b73b
