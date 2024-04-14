import { collection, onSnapshot, query, where } from "firebase/firestore";

export function showBudgetCard(budget, total) {
  console.log(total);
  return ` <div class="card">
    <h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-wallet"
      >
        <path
          d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
        />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </svg>
      ${budget.montant}$
    </h2>
    <span class="cumul">${budget.montant - total}$</span>
    <p>${budget.name}</p>
  </div>`;
}

export function showDepenseCard(depense) {
  // generate a color with a low oppaciry and use the same color id depense.budget is the same
  const customColor = `#${Math.floor(Math.random() * 16777215).toString(12)}1`;
  return `<li style="background-color: #${customColor};">
  <div class="dep">
    <!-- nom, montant et date -->
    <span class="depense-name">${depense.name}</span>
    <span class="depense-date">${new Date(depense.date.toDate())}</span>
  </div>
  <p class="depense-amount">${depense.montant}$</p>
</li>`;
}
