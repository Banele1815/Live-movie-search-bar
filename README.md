# Movie Live Search Bar — Technical Documentation

**Target audience:** Junior developers reading this codebase for the first time.  
**Last updated:** May 2026

---

## What this project does

This is a live search bar that filters a list of movies as the user types.
No page reloads, no buttons to click — the results update instantly.
It is built with vanilla HTML, CSS and JavaScript only. No frameworks, no libraries.

---

## File structure

```
project/
├── index.html       — the page structure
├── styles.css       — all the styling
├── script.js        — all the JavaScript logic
└── assets/          — movie poster images
```

---

## How the JavaScript works

The JS is split into four clearly labelled sections. Here is what each one does
and why it was written that way.

---

### 1. Movie Data

```javascript
const MOVIES = [
  { title: 'Despicable Me', year: 2010, genre: 'Animation · Comedy' },
  { title: 'Iron Man', year: 2008, genre: 'Action · Superhero' },
  ...
];
```

This is an array of objects. Each object represents one movie and holds three
pieces of information — the title, the release year, and the genre.

**Why store data in JavaScript instead of HTML?**  
If the movies were hardcoded as `<li>` tags in the HTML, every time you wanted
to add or remove a movie you would have to edit the HTML file. By keeping the
data in JavaScript, the HTML stays clean and the `render()` function builds the
list automatically. Adding a new movie is as simple as adding one line to the
`MOVIES` array.

---

### 2. Search Input Component (Banele)

This section owns everything related to the search box — capturing what the
user types and deciding what to do with it.

#### Capturing input

```javascript
searchInput.addEventListener("input", function (e) {
  const raw = e.target.value;
  const trimmed = raw.trim();
  ...
});
```

The `input` event fires on every single keystroke. `e.target.value` is whatever
is currently in the search box. We store two versions — `raw` (exactly what the
user typed) and `trimmed` (with spaces removed from both ends).

**Why keep both?**  
We need `raw` to check if the user typed only spaces (an edge case). We need
`trimmed` to send a clean query to the filter — we don't want a search for
`"  iron  "` to return no results just because of accidental spaces.

#### Edge cases handled

| Situation | What happens |
|-----------|-------------|
| User clears the input | Status resets, list hides |
| User types only spaces | Warning message shown, no search fires |
| User types 90+ characters | Character limit warning appears |
| Normal typing | Status updates, search fires after debounce |

#### Debounce

```javascript
clearTimeout(debounceTimer);
debounceTimer = setTimeout(function () {
  dispatchSearch(trimmed);
}, 350);
```

Without debounce, typing "Black Panther" fires 13 separate search operations —
one per keystroke. With debounce, the search only fires 350ms after the user
stops typing. This is more efficient and prevents the interface from feeling
jittery on larger datasets.

Think of it like an elevator — it does not leave the moment one person steps in.
It waits a few seconds to see if more people are coming before it moves.

#### The clear button

```javascript
clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  clearBtn.style.display = "none";
  searchStatus.textContent = "";
  searchInput.focus();
  dispatchSearch("");
});
```

When clicked, this resets every piece of state — the input value, the button
visibility, the status message — and puts the cursor back in the search box so
the user can type again immediately.

---

### 3. The Custom Event — how the sections talk to each other

This is the most important architectural decision in the project.

```javascript
function dispatchSearch(query) {
  document.dispatchEvent(
    new CustomEvent("movie:search", { detail: { query } })
  );
}
```

Instead of the search input directly calling the filter function, it fires a
custom event on the document. The filter section listens for that event
separately:

```javascript
document.addEventListener("movie:search", function (e) {
  render(e.detail.query);
});
```

**Why do it this way?**  
This pattern is called separation of concerns. The search input does not need
to know anything about how filtering works. The filter does not need to know
anything about the search box. Each section only does its own job.

The practical benefit is that if one person changes their code, it does not
break the other person's code. The only thing they agreed on is the event name
`movie:search` and that it carries a `query` string — that is their contract.

---

### 4. Highlight matched text (Kamo)

```javascript
function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), match => `<mark>${match}</mark>`);
}
```

This function takes a movie title and wraps the part that matches the search
query in a `<mark>` tag, which the browser renders with a yellow highlight.

**Breaking it down line by line:**

- `if (!query) return text` — if there is no query, return the title unchanged
- `escaped` — this cleans the query so special characters like `(` or `.` do
  not accidentally break the search pattern
- `new RegExp(escaped, 'gi')` — creates a search pattern where `g` means find
  all matches and `i` means ignore uppercase/lowercase differences
- The replacement wraps each match in `<mark>` tags

**Example:**  
Query: `"iron"`  
Title: `"Iron Man"`  
Result: `"<mark>Iron</mark> Man"` — renders as **Iron** Man with yellow highlight

---

### 5. Render function

```javascript
function render(query) {
  movieList.innerHTML = "";

  if (query === null) {
    noResultsMessage.style.display = "none";
    return;
  }

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
      <strong>${highlightMatch(movie.title, query)}</strong>
      <span>(${movie.year})</span>
      <em>${movie.genre}</em>
    `;
    movieList.appendChild(li);
  });
}
```

This function is responsible for building and displaying the movie list.

**The three states of `query`:**

| Value | Meaning | What renders |
|-------|---------|-------------|
| `null` | Page just loaded | Nothing — list is hidden |
| `""` | User cleared input | Nothing — list hides again |
| `"iron"` | User is typing | Filtered and highlighted results |

**How it builds the list:**  
Instead of showing and hiding existing `<li>` elements, `render()` clears the
list completely with `movieList.innerHTML = ""` and rebuilds it from scratch
every time. This is simpler to reason about — the list always reflects exactly
what is in the `filtered` array at that moment.

---

## How all the pieces connect

```
User types
    ↓
input event fires
    ↓
edge cases checked
    ↓
debounce waits 350ms
    ↓
dispatchSearch() fires movie:search event
    ↓
render() receives the query
    ↓
MOVIES array is filtered
    ↓
highlightMatch() wraps matched text in <mark>
    ↓
new <li> elements are built and added to the page
```

---

## Git workflow used in this project

### Branching strategy

Each team member worked on their own branch and submitted a Pull Request (PR) to merge into main. No one committed directly to main.

| Branch | Owner | Responsibility |
|--------|-------|---------------|
| `feature/search-input-banele` | Banele | Search input, CSS, input event |
| `feature/filter-logic-component` | Teammate 2 | Filter logic, no results message |
| `feature/ui-enhancement` | Kamo | Highlight match, MOVIES data |
| `docs` | Docs Lead | This documentation file |

### How to resolve a merge conflict

When two people edit the same file, Git cannot automatically decide which version to keep. It marks the conflict like this:

```
<<<<<<< your-branch
  your code here
=======
  their code here
>>>>>>> main
```

To fix it:
1. Delete all three marker lines (`<<<<<<<`, `=======`, `>>>>>>>`)
2. Combine both versions into one correct version
3. Save the file
4. Run `git add filename` then `git commit`

### Key commands used

```bash
# Clone the repo
git clone https://github.com/Banele1815/Live-movie-search-bar.git

# Move into the folder
cd Live-movie-search-bar

# Get latest branches from GitHub
git fetch origin

# Switch to your branch
git checkout feature/search-input-banele

# Create a new branch
git checkout -b feature/new-feature

# Stage and commit changes
git add .
git commit -m "your message here"

# Push to GitHub
git push origin feature/search-input-banele

# Check which branch you are on
git branch

# See commit history
git log --oneline
```

---

## Common questions

**Why vanilla JS and not React or Vue?**  
This project is small enough that a framework would add complexity without
adding value. Vanilla JS also means anyone can open `index.html` directly in a
browser with no installation or build step required.

**Why use `createElement` instead of writing HTML strings?**  
The `render()` function uses `createElement` and `innerHTML` together. The
`innerHTML` on each `<li>` is safe here because the content comes from our own
`MOVIES` array, not from user input. Never use `innerHTML` with raw user input
— that opens the door to XSS attacks where malicious code gets injected into
the page.

**What is XSS?**  
Cross-Site Scripting. It is when an attacker injects JavaScript into a page
through an input field. For example if a user typed `<script>alert('hacked')</script>`
into the search bar and the app rendered that directly as HTML, the script would
execute. Our app is safe because user input only goes through the filter
comparison — it never gets written into the DOM directly.

**Why are movies hidden on load?**  
Passing `null` to `render()` on page load keeps the list empty until the user
starts typing. This gives the interface a cleaner look and sets the expectation
that the search bar is the starting point.

**What is debounce and why does it matter?**  
Debounce delays a function from running until a certain amount of time has
passed since it was last called. Without it, every keystroke triggers a filter
operation. With it, the filter only runs once the user pauses — making the app
faster and less wasteful, especially with larger datasets.
