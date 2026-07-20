(() => {
  "use strict";

  const choices = Array.from(document.querySelectorAll(".choice"));
  const cta = document.querySelector(".cta");

  choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      choices.forEach((button) => button.setAttribute("aria-pressed", String(button === choice)));
      cta.hidden = false;
    });
  });
})();
