console.log("App loaded");

// ─── Movie Data ────────────────────────────────────────────────────────────────

const MOVIES = [
  { title: 'Despicable Me', year: 2010, genre: 'Animation · Comedy', img: './assets/Despicable.webp' },
  { title: 'Iron Man', year: 2008, genre: 'Action · Superhero', img: './assets/iron man.jpg' },
  { title: 'Black Panther', year: 2018, genre: 'Action · Superhero', img: './assets/black panther.jpg' },
  { title: 'Boss Baby', year: 2017, genre: 'Animation · Comedy', img: './assets/boss baby.jpg' },
  { title: 'High School Musical', year: 2006, genre: 'Musical · Drama', img: './assets/high school musical.jpg' },
];

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


// ─── Kamo's section: Highlight matched text ────────────────────────────────────

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), match => `<mark>${match}</mark>`);
}

// ─── Filter + Results Component ────────────────────────────────────────────────

const movieList = document.getElementById("movieList");
const noResultsMessage = document.getElementById("noResultsMessage");

function render(query) {
  movieList.innerHTML = "";

  const filtered = query
    ? MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase()))
    : MOVIES;

  if (filtered.length === 0) {
    noResultsMessage.style.display = "block";
    return;
  }

  noResultsMessage.style.display = "none";

  filtered.forEach(function (movie) {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${movie.img}" alt="${movie.title}" />
      <div>
        <strong>${highlightMatch(movie.title, query)}</strong>
        <span>(${movie.year})</span>
        <em>${movie.genre}</em>
      </div>
    `;
    movieList.appendChild(li);
  });
}

document.addEventListener("movie:search", function (e) {
  render(e.detail.query);
});

render("");

// ─── End Filter + Results section ─────────────────────────────────────────────
// ─── End Teammate's section ───────────────────────────────────────────────────
