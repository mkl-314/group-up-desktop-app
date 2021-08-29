export const getNextSolution = () => {
  if (groupSolutions) {
    const solution = document.getElementById(`solution${solDisplayNum + 1}`);
    const hideSolution = document.getElementById(`solution${solDisplayNum}`);
    solution.classList.remove("no-display");
    hideSolution.classList.add("no-display");

    if (solDisplayNum + 1 >= groupSolutions.length) {
      const rightButton = document.getElementById("rightButton");
      rightButton.classList.add("hide");
    }
    const leftButton = document.getElementById("leftButton");
    leftButton.classList.remove("hide");

    setSolDisplayNum(solDisplayNum + 1);
  }
};
export const getPrevSolution = () => {
  if (groupSolutions) {
    const solution = document.getElementById(`solution${solDisplayNum - 1}`);
    const hideSolution = document.getElementById(`solution${solDisplayNum}`);
    solution.classList.remove("no-display");
    hideSolution.classList.add("no-display");

    if (solDisplayNum <= 1) {
      const leftButton = document.getElementById("leftButton");
      leftButton.classList.add("hide");
    }
    const rightButton = document.getElementById("rightButton");
    rightButton.classList.remove("hide");

    setSolDisplayNum(solDisplayNum - 1);
  }
};
