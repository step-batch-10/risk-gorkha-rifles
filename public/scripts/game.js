import MapView from "./views/mapView.js";
import ApiService from "./components/apiService.js";
import GameController from "./controllers/gameController.js";
import ReinforcementModal from "./views/reinforcementModal.js";
import PlayerSidebarView from "./views/playersSidebarView.js";
import GameStartModal from "./views/gameStartModal.js";
import ModalManager from "./controllers/modalManager.js";
import ViewManager from "./controllers/viewManager.js";
import PhaseView from "./views/phaseView.js";
import EventBus from "./components/eventBus.js";

const initModalManager = () => {
  const gameStartModal = new GameStartModal('startGame-popup');
  const reinforcementModal = new ReinforcementModal();

  return new ModalManager(gameStartModal, reinforcementModal);
};

const initViewManager = (eventBus) => {
  const mapView = new MapView();
  const phaseView = new PhaseView(eventBus);
  const playerSidebarView = new PlayerSidebarView('side-bar-left');

  return new ViewManager(mapView, playerSidebarView, phaseView);
};

const initalizeApp = () => {
  const eventBus = new EventBus();

  const modalManager = initModalManager();
  const viewManager = initViewManager(eventBus);
  const audio = new Audio("../../assets/risk_music.mp3");

  const controller = new GameController(modalManager, viewManager, ApiService, audio, eventBus);
  controller.init();
};

globalThis.onload = initalizeApp;