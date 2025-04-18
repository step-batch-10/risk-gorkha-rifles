import MapModal from "./views/mapModal.js";
import WaitingModal from "./views/waitingModal.js";
import ApiService from "./components/apiService.js";
import GameController from "./controllers/gameController.js";

const initalizeApp = () => {
  const mapModal = new MapModal();
  const waitingModal = new WaitingModal("waiting-popup");
  const controller = new GameController(waitingModal, mapModal, ApiService);
  controller.init();
};

globalThis.onload = initalizeApp;