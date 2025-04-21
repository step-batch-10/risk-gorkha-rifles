import MapView from "./views/mapModal.js";
import WaitingModal from "./views/waitingModal.js";
import ApiService from "./components/apiService.js";
import GameController from "./controllers/gameController.js";
import ReinforcementModal from "./views/reinforcementModal.js";
import PlayerSidebarView from "./views/playersSidebarView.js";
import GameStartModal from "./views/gameStartModal.js";
import ModalManager from "./controllers/modalManager.js";
import ViewManager from "./controllers/viewManager.js";

const initModalManager = () => {
  const waitingModal = new WaitingModal("waiting-popup");
  const gameStartModal = new GameStartModal('startGame-popup');
  const reinforcementModal = new ReinforcementModal();

  return new ModalManager(waitingModal, gameStartModal, reinforcementModal);
};

const initViewManager = () => {
  const mapView = new MapView();
  const playerSidebarView = new PlayerSidebarView('side-bar-left');

  return new ViewManager(mapView, playerSidebarView);
};

const initalizeApp = () => {
  const modalManager = initModalManager();
  const viewManager = initViewManager();
  const audio = new Audio("../../assets/risk_music.mp3");

  const controller = new GameController(modalManager, viewManager, ApiService, audio);
  controller.init();
};

globalThis.onload = initalizeApp;