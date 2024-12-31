function setInitialToggleState() {
  const toggleHeading = document.getElementById("toggle-heading");
  if (toggleHeading) {
    if (window.innerWidth <= 992) {
      toggleHeading.setAttribute("data-oxy-toggle-initial-state", "closed");
    } else {
      toggleHeading.setAttribute("data-oxy-toggle-initial-state", "open");
    }
  } else {
    console.warn("The element with ID 'toggle-heading' is missing.");
  }
}

document.addEventListener("DOMContentLoaded", setInitialToggleState);
window.addEventListener("resize", setInitialToggleState);
document.addEventListener("DOMContentLoaded", setInitialToggleState);
window.addEventListener("resize", setInitialToggleState);

// function setInitialToggleState() {
//   const toggleHeading = document.getElementById("toggle-heading");
//   const content = document.querySelector(".toggle-div");
//   if (toggleHeading && content) {
//     if (window.innerWidth <= 992) {
//       // Set TOC to "closed" state
//       toggleHeading.setAttribute("data-oxy-toggle-initial-state", "closed");
//       content.style.display = "none"; // Ensure TOC content is hidden
//     } else {
//       // Set TOC to "open" state
//       toggleHeading.setAttribute("data-oxy-toggle-initial-state", "open");
//       content.style.display = "block"; // Ensure TOC content is visible
//     }
//   } else {
//     console.warn(
//       "The element with ID 'toggle-heading' or the TOC content is missing."
//     );
//   }
// }

// // Add event listeners
// document.addEventListener("DOMContentLoaded", setInitialToggleState);
// window.addEventListener("resize", setInitialToggleState);
