import MapModal from "./views/mapModal.js";
import WaitingModal from "./views/waitingModal.js";
import ApiService from "./components/apiService.js";
import GameController from "./controllers/gameController.js";
import ReinforcementModal from "./views/reinforcementModal.js";
import PlayerSidebarView from "./views/playersSidebarView.js";

const initalizeApp = () => {
  const mapModal = new MapModal();
  const waitingModal = new WaitingModal("waiting-popup");
  const reinforcementModal = new ReinforcementModal();
  const playerSidebarView = new PlayerSidebarView('side-bar-left');
  const controller = new GameController
    (waitingModal, mapModal, ApiService, reinforcementModal, playerSidebarView);
  controller.init();
};

globalThis.onload = initalizeApp;