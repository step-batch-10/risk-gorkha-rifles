import ApiService from "./components/apiService.js";
import WaitingModal from "./views/waitingModal.js";
import GameController from "./controllers/gameController.js";

const initalizeApp = () => {
  const waitingModal = new WaitingModal("waiting-popup");
  const controller = new GameController(waitingModal, ApiService);
  controller.init();
};

globalThis.onload = initalizeApp;