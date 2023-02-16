import Game from "./game";

class GameChoice {
  private static buttonsPlayerChoice: NodeListOf<HTMLLIElement> = document.querySelectorAll("[data-player-choice]");

  private static buttonsMarkChoice: NodeListOf<HTMLLIElement> = document.querySelectorAll("[data-mark]");
  public static selectedMark: string | undefined = "x";
  private static containerGameChoice: HTMLElement | null = document.querySelector("[data-game-choice]");
  private static containerGamePlay: HTMLElement | null = document.querySelector("[data-game-play]");

  public static init(): void {
    GameChoice.handleChoicePlayer();
    GameChoice.handleChoiceMark();
  }

  public static handleChoiceMark(): void {
    this.buttonsMarkChoice.forEach((element) => {
      element.addEventListener("click", () => {
        this.selectedMark = element.dataset.mark;

        let selectMark: HTMLElement | null = document.querySelector(".game-choice__item--selected");
        selectMark?.classList.remove("game-choice__item--selected");

        element.classList.add("game-choice__item--selected");
      });
    });
  }
  public static handleChoicePlayer(): void {
    this.buttonsPlayerChoice.forEach((element) => {
      element.addEventListener("click", () => {
        if (GameChoice.containerGameChoice) GameChoice.containerGameChoice.classList.add("d-none");
        if (GameChoice.containerGamePlay) GameChoice.containerGamePlay.classList.remove("d-none");

        Game.init(this.selectedMark || "");
      });
    });
  }
}

export default GameChoice;
