// selection des frames importants
const dashoard = document.querySelector("#dashboard");
const bottomBar = document.querySelector("#bottom-bar");
const budgetForm = document.querySelector("#budget_form");
const profile = document.querySelector("#dashboard .profile");
const mainContent = document.querySelector("#dashboard .main-content");
const forms = document.querySelector("#dashboard .forms");
const usergreet = document.querySelector("#user-greet");
const login = document.querySelector("#login");

export const switchFrame = (frame) => {
  switch (frame) {
    case "login":
      mainContent.style.display = "none";
      forms.style.display = "none";
      profile.style.display = "none";
      usergreet.style.display = "none";
      dashoard.style.display = "none";
      bottomBar.style.display = "none";
      login.style.display = "flex";
      //   ajouter une petite animation
      login.style.animation = "fadeIn 0.5s ease-in-out";
      break;
    case "profile":
      mainContent.style.display = "none";
      usergreet.style.display = "none";
      profile.style.display = "block";

      //   ajouter une petite animation
      profile.style.animation = "fadeIn 0.5s ease-in-out";
      break;
    case "Mobileprofile":
      mainContent.style.display = "none";
      usergreet.style.display = "none";
      profile.style.display = "block";
      forms.style.display = "none";

      //   ajouter une petite animation
      profile.style.animation = "fadeIn 0.5s ease-in-out";
      break;
    case "dashboard":
      profile.style.display = "none";
      mainContent.style.display = "block";
      usergreet.style.display = "block";

      //   ajouter une petite animation
      mainContent.style.animation = "fadeIn 0.5s ease-in-out";
      break;
    case "mobile":
      profile.style.display = "none";
      forms.style.display = "none";
      mainContent.style.display = "block";
      usergreet.style.display = "block";
      //   ajouter une petite animation
      mainContent.style.animation = "fadeIn 0.5s ease-in-out";
      break;
    case "ajouter":
      profile.style.display = "none";
      mainContent.style.display = "none";
      usergreet.style.display = "none";
      forms.style.display = "flex";
    default:
      break;
  }
};
