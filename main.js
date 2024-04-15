import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { login } from "./auth";
import data, { createChartData } from "./data";
import { auth, db } from "./firebase";
import { switchFrame } from "./navigation";
import {
  addBudgetInBudgetCollection,
  addDepenseInDepenseCollection,
  addUser,
  getBudgetsByUser,
  getDepenseByBudget,
  getUser,
} from "./firestore";
import {
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { showBudgetCard, showDepenseCard } from "./views";

// firebase auth
const provider = new GoogleAuthProvider();

// btns
const profileBtn = document.querySelector("#profile-btn");
const profileRetourBtn = document.querySelector("#profile-retour");
const profileUserBottom = document.querySelector("#bottom_user");
const homeBtn = document.querySelector("#home");
const addBtn = document.querySelector("#bottom_add");
const toggleDarkMode = document.querySelector("#dark-mode-btn");
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

// events
profileBtn.addEventListener("click", () => {
  switchFrame("profile");
});
profileRetourBtn.addEventListener("click", () => {
  switchFrame("dashboard");
  profileUserBottom.classList.remove("active");
  homeBtn.classList.add("active");
});
profileUserBottom.addEventListener("click", () => {
  switchFrame("Mobileprofile");
  profileUserBottom.classList.add("active");
  homeBtn.classList.remove("active");
});

homeBtn.addEventListener("click", () => {
  switchFrame("mobile");
  profileUserBottom.classList.remove("active");
  homeBtn.classList.add("active");
});

addBtn.addEventListener("click", () => {
  switchFrame("ajouter");
});

const loadingFrame = document.querySelector(".loading");

const profileDeconnexion = document.querySelector("#profile-deconnexion");
profileDeconnexion.addEventListener("click", () => {
  signOut(auth).then(() => {
    switchFrame("login");
  });
});

let loading = false;

onAuthStateChanged(auth, async (user) => {
  loadingFrame.classList.add("active");
  if (user) {
    const userInFirestore = await getUser(user.uid);
    loadingFrame.classList.remove("active");
    if (!userInFirestore) {
      addUser(user);
      loading = false;
    }

    loading = false;

    switchFrame("dashboard");
    // user greet
    const userGreet = document.querySelector("#user-greet");
    userGreet.textContent = `Bienvenue ${user.displayName}`;

    const data = await createChartData(user.uid);

    const config = {
      type: "doughnut",
      data: data,
    };
    const ctx = document.getElementById("myChart");

    new Chart(ctx, config);

    const budgetP = document.querySelector(".montant-budget");
    let totalBudget = 0;
    // budgets
    onSnapshot(
      query(collection(db, "budgets"), where("uid", "==", user.uid)),
      (snapshot) => {
        const budgets = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const budgetFrame = document.querySelector(".budgets");

        budgetFrame.innerHTML = "";
        budgets.forEach(async (budget) => {
          totalBudget += parseInt(budget.montant);
          budgetP.textContent = `${totalBudget} $`;
          const dep = await getDepenseByBudget(budget.id);
          // aditionner les montants des depenses dans le budget
          let total = 0;
          dep.forEach((depense) => {
            total += parseInt(depense.montant);
          });

          console.log(total);
          const card = showBudgetCard(budget, total);
          budgetFrame.innerHTML += card;
        });

        if (budgets.length === 0) {
          // texte aucun budget
          budgetFrame.style.width = "100%";
          budgetFrame.style.display = "flex";
          budgetFrame.style.alignItems = "center";
          budgetFrame.style.justifyContent = "center";
          budgetFrame.innerHTML = "<p class=''>Aucun budget disponible</p>";
        }
      }
    );

    const totalDepenseP = document.querySelector(".montant-depense");
    let totalDepense = 0;
    // depenses show
    onSnapshot(
      query(collection(db, "depenses"), where("uid", "==", user.uid)),
      (snapshot) => {
        const depenses = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const depensesFrame = document.querySelector(".depenses .contents ul");
        depensesFrame.innerHTML = "";
        if (depenses.length == 0) {
          depensesFrame.innerHTML =
            "<p class='titre'>Aucune depense disponible</p>";
        }
        depenses.forEach((depense) => {
          const card = showDepenseCard(depense);
          depensesFrame.innerHTML += card;
          totalDepense += parseInt(depense.montant);
        });

        totalDepenseP.textContent = totalDepense + "$";
      }
    );

    // depenses
    const formDepense = document.querySelector("#depenses");
    // update select budget
    const selectDepense = document.querySelector("#selectBudget");
    onSnapshot(
      query(collection(db, "budgets"), where("uid", "==", user.uid)),
      (snapshot) => {
        const budgets = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        selectDepense.innerHTML = "";
        budgets.forEach((budget) => {
          const option = document.createElement("option");
          option.value = budget.name;
          option.textContent = budget.name;
          selectDepense.appendChild(option);
        });
      }
    );

    formDepense.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const depense = {
        name: formData.get("name"),
        budget: formData.get("budget"),
        montant: formData.get("montant"),
        uid: user.uid,
        date: serverTimestamp(),
      };

      // trouver le budget correspondant
      const budget = await getBudgetsByUser(user.uid).then((budgets) => {
        return budgets.find((budget) => budget.name === depense.budget);
      });
      if (depense.montant > budget.montant) {
        alert("Depense superieur au budget, veuillez recommencer");
        return;
      }

      depense.budget = budget.id;

      addDepenseInDepenseCollection(depense);
      e.target.reset();
      alert("Dépense ajouter");
      if (!("Notification" in window)) {
        return;
      }

      try {
        let notification = new Notification("Ajout de depense", {
          body: "Depense ajouter avec succes",
          badge: 1,
          icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        });
        navigator.setAppBadge(1).catch((err) => {
          console.log(err);
        });
      } catch (err) {
        alert("Notification API error: " + err);
      }
    });

    // ajout budget
    const budgetForm = document.querySelector("#budget_form");
    budgetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // formdata
      const formData = new FormData(e.target);
      const budget = {
        name: formData.get("name"),
        montant: formData.get("montant"),
        uid: user.uid,
        date: serverTimestamp(),
      };

      addBudgetInBudgetCollection(budget);

      e.target.reset();
      alert("budget ajouter");
    });

    // profile
    const profile = document.querySelector("#dashboard .profile");
    profile.querySelector("img").src = user.photoURL;
    profile.querySelector("p").textContent = user.displayName;
  } else {
    switchFrame("login");
    loadingFrame.classList.remove("active");
  }
});
// connexion avec google
const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", async () => {
  await signInWithRedirect(auth, provider).then((res) => {
    switchFrame("dashboard");
    console.log(res.uid);
  });
});

loading = false;

// deconnexion
const deconnexion = document.querySelector("#deconnexion");
deconnexion.addEventListener("click", () => {
  signOut(auth).then(() => {
    loading = false;
    switchFrame("login");
  });
});

function load() {
  const button = document.querySelector("#dark-mode-btn");
  const body = document.querySelector("body");

  // MediaQueryList object
  const useDark = window.matchMedia("(prefers-color-scheme: dark)");

  // Toggles the "dark-mode" class based on if the media query matches
  function toggleDarkMode(state) {
    // Older browser don't support the second parameter in the
    // classList.toggle method so you'd need to handle this manually
    // if you need to support older browsers.
    document.documentElement.classList.toggle("dark-mode", state);
  }

  // Initial setting
  toggleDarkMode(useDark.matches);

  // Listen for changes in the OS settings
  useDark.addListener((evt) => toggleDarkMode(evt.matches));

  // Toggles the "dark-mode" class on click
  button.addEventListener("click", () => {
    alert("Babe");
    document.documentElement.classList.toggle("dark-mode");
  });
}

window.addEventListener("DOMContentLoaded", load);
