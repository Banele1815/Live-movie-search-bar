Block 1 Retrospective – Movie Live Search Bar
1. Demo of Our Best Sprint Project
Our best sprint project during Block 1 was the Movie Live Search Bar. The application allows users to search through a collection of movies and see matching results instantly as they type. The project was built using only HTML, CSS, and Vanilla JavaScript without any frameworks or external libraries.
Key features include:

• Live search functionality with instant results.
• Dynamic filtering of movie data.
• Highlighting matched search terms.
• Responsive and user-friendly interface.
• Debounced search input for better performance.
• Clear button to quickly reset searches.
We selected this project because it demonstrated our understanding of JavaScript events, DOM manipulation, Git collaboration, and user experience design.

2. Technical Walkthrough – Group Implementation Decision
One of the most interesting implementation decisions in our Movie Live Search Bar project was the use of custom events combined with debouncing to create a responsive and maintainable search experience.
The search input component captures user input using the input event, which fires every time a user types a character. Instead of immediately filtering the movie list on every keystroke, we implemented a debounce mechanism:

clearTimeout(debounceTimer);
debounceTimer = setTimeout(function () {
  dispatchSearch(trimmed);
}, 350);
This waits 350 milliseconds after the user stops typing before performing the search. Without this approach, the application would attempt to search after every keystroke, resulting in unnecessary processing and a less efficient user experience.
Another important design decision was separating the search component from the filtering component using a custom event:

function dispatchSearch(query) {
  document.dispatchEvent(
    new CustomEvent("movie:search", {
      detail: { query }
    })
  );
}
The filter section listens for this event and updates the results:

document.addEventListener("movie:search", function (e) {
  render(e.detail.query);
});
This approach follows the principle of separation of concerns. The search component is responsible only for collecting user input, while the filtering component is responsible only for displaying results.
The application also includes several user experience improvements:

• Input validation for empty or whitespace-only searches.
• Search status messages.
• A clear button that resets the search.
• Highlighting matching text using the <mark> tag.
• Dynamic rendering of movie cards with posters, titles, release years, and genres.
These implementation decisions made the application more efficient, easier to maintain, and easier for multiple team members to work on simultaneously.


3. What Broke and How We Fixed It
One of the biggest issues occurred during the integration of team members' branches.
A team member named the stylesheet file style.css, while the rest of the project was using styles.css. After merging branches, the website suddenly appeared without any styling because the HTML file was still referencing styles.css while the merged code contained style.css.
How We Fixed It
We investigated why the styling was missing and checked both the HTML and project files. After comparing the file names, we discovered the naming mismatch.
To resolve the issue:

A. We renamed the stylesheet to match the filename expected by the HTML..
B. We tested the application to confirm the styles loaded correctly..
C. We committed and pushed the fix to the repository..
Lesson Learned
This issue taught us the importance of:

• Following agreed naming conventions.
• Reviewing pull requests carefully.
• Testing the application after merges.
• Communicating file structure changes with the team.
Although the issue was small, it caused a noticeable problem and highlighted the importance of consistency in collaborative development.

4. What Each Member Would Do Differently
Banele
I would spend more time planning the project structure before implementation. This would help identify potential integration issues earlier and make collaboration smoother.
Team Member 2
Would improve testing throughout development instead of waiting until features were completed. Earlier testing would help catch bugs sooner.
Kamo
Would focus on documenting implementation decisions while developing features instead of leaving documentation until the end of the sprint.
Bea
Would ensure all file names and project conventions match the team's agreed standards before creating pull requests and merging code.
Group Reflection
As a team, we would improve communication, testing, and code review practices. We learned that even small inconsistencies can create problems during integration. The project strengthened our understanding of Git workflows, collaborative development, JavaScript programming, and problem-solving as a team.
Overall, the Movie Live Search Bar was our strongest Block 1 project because it successfully combined technical functionality, good user experience, and effective team collaboration.
