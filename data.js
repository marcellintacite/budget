import { getBudgetsByUser } from "./firestore";

export const createChartData = async (uid) => {
  const budget = await getBudgetsByUser(uid);
  const data = {
    labels: budget.map((budget) => budget.name),
    datasets: [
      {
        label: "budget",
        data: budget.map((budget) => budget.montant),
        backgroundColor: ["#6495ed", "#ff8282", "#64be94", "#ff5082"],
      },
    ],
  };

  return data;
};

const budgets = "";
console.log(budgets);
const data = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
};

export default data;
