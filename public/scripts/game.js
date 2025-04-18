import MapModal from "./views/mapModal.js";
import WaitingModal from "./views/waitingModal.js";
import ApiService from "./components/apiService.js";
import GameController from "./controllers/gameController.js";
import ReinforcementModal from "./views/reinforcementModal.js";

const initalizeApp = () => {
  const mapModal = new MapModal();
  const waitingModal = new WaitingModal("waiting-popup");
  const reinforcementModal = new ReinforcementModal();
  const controller = new GameController(waitingModal, mapModal, ApiService, reinforcementModal);
  controller.init();
};

globalThis.onload = initalizeApp;