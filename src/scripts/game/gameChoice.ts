import Game from "./game";

class GameChoice {
  private buttonsPlayerChoice: NodeListOf<HTMLLIElement> =
    document.querySelectorAll("[data-player-choice]");

  private buttonsMarkChoice: NodeListOf<HTMLLIElement> =
    document.querySelectorAll("[data-mark]");

  public selectedMark: string | undefined = "x";

  private containerGameChoice: HTMLElement | null =
    document.querySelector("[data-game-choice]");

  private containerGamePlay: HTMLElement | null =
    document.querySelector("[data-game-play]");

  public init(): void {
    this.handleChoicePlayer();
    this.handleChoiceMark();
  }

  public handleChoiceMark(): void {
    this.buttonsMarkChoice.forEach((element) => {
      element.addEventListener("click", () => {
        this.selectedMark = element.dataset.mark;

        let selectMark: HTMLElement | null = document.querySelector(
          ".game-choice__item--selected"
        );
        selectMark?.classList.remove("game-choice__item--selected");

        element.classList.add("game-choice__item--selected");
      });
    });
  }

  public handleChoicePlayer(): void {
    this.buttonsPlayerChoice.forEach((element) => {
      element.addEventListener("click", () => {
        if (this.containerGameChoice) {
          this.containerGameChoice.classList.add("d-none");
        }
        if (this.containerGamePlay) {
          this.containerGamePlay.classList.remove("d-none");
        }

        const game = new Game();
        game.init(this.selectedMark || "");
      });
    });
  }
}

export default GameChoice;
