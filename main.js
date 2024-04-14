import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { login } from "./auth";
import data from "./data";
import { auth, db } from "./firebase";
import { switchFrame } from "./navigation";
import {
  addBudgetInBudgetCollection,
  addUser,
  getBudgetsByUser,
  getUser,
} from "./firestore";
import {
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { showBudgetCard } from "./views";

// firebase auth
const provider = new GoogleAuthProvider();

const config = {
  type: "doughnut",
  data: data,
};
const ctx = document.getElementById("myChart");

new Chart(ctx, config);

// btns
const profileBtn = document.querySelector("#profile-btn");
const profileRetourBtn = document.querySelector("#profile-retour");
const profileUserBottom = document.querySelector("#bottom_user");
const homeBtn = document.querySelector("#home");
const addBtn = document.querySelector("#bottom_add");
// events
profileBtn.addEventListener("click", () => {
  switchFrame("profile");
});
profileRetourBtn.addEventListener("click", () => {
  switchFrame("dashboard");
});
profileUserBottom.addEventListener("click", () => {
  switchFrame("profile");
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

    // budgets
    onSnapshot(
      query(collection(db, "budgets"), where("uid", "==", user.uid)),
      (snapshot) => {
        const budgets = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (budgets.length == 0) {
          const budgetFrame = document.querySelector(".budgets");
          // texte aucun budget
          budgetFrame.innerHTML = "<p>Aucun budget disponible</p>";
        }
        const budgetFrame = document.querySelector(".budgets");

        budgetFrame.innerHTML = "";
        budgets.forEach((budget) => {
          const card = showBudgetCard(budget);
          budgetFrame.innerHTML += card;
        });
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
