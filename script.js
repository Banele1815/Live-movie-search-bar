console.log("App loaded");

// ─── Banele: Search Input Component ───────────────────────────────────────────

const searchInput = document.getElementById("searchInput");
const clearBtn    = document.getElementById("clearBtn");
const searchStatus = document.getElementById("searchStatus");

let debounceTimer = null;

// Captures every keystroke via the `input` event
searchInput.addEventListener("input", function (e) {
  const raw = e.target.value;
  const trimmed = raw.trim();

  // Show/hide clear button
  clearBtn.style.display = raw.length > 0 ? "inline-block" : "none";

  // ── Edge case handling ──────────────────────────────────────────
  if (raw === "") {
    searchStatus.textContent = "";
    dispatchSearch("");       // signal teammates: input cleared
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
  // ───────────────────────────────────────────────────────────────

  // Debounce: wait 350ms after user stops typing before firing search
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function () {
    dispatchSearch(trimmed);
  }, 350);
});

// Clears the field and resets state
clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  clearBtn.style.display = "none";
  searchStatus.textContent = "";
  searchInput.focus();
  dispatchSearch("");
});

/**
 * dispatchSearch — the handoff point to teammates.
 * Fires a custom event that the results/filter components listen for.
 * @param {string} query - trimmed search string (empty string = cleared)
 */
function dispatchSearch(query) {
  document.dispatchEvent(
    new CustomEvent("movie:search", { detail: { query } })
  );
}

// ─── End Banele's section ──────────────────────────────────────────────────────