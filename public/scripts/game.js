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
import CardsViewModal from "./views/cardsView.js";
import ChatBox from "./views/chatBoxManager.js";
import { AttackDefenceModal } from "./views/attackAndDefendTroopsModal.js";
import GoldenCavalry from "./views/cavalry.js";

const initModalManager = (eventBus) => {
  const gameStartModal = new GameStartModal("startGame-popup");
  const reinforcementModal = new ReinforcementModal();
  const troopsSelection = new AttackDefenceModal(eventBus);

  return new ModalManager(gameStartModal, reinforcementModal, troopsSelection);
};

const initViewManager = (eventBus) => {
  const mapView = new MapView(eventBus);
  const phaseView = new PhaseView(eventBus);
  const playerSidebarView = new PlayerSidebarView("side-bar-left");
  const cardsView = new CardsViewModal("cards-popup", "cards-option", eventBus);
  cardsView.init();
  const cavalryView = new GoldenCavalry();

  return new ViewManager(mapView, playerSidebarView, phaseView, cardsView,cavalryView);
};

const initalizeApp = () => {
  const eventBus = new EventBus();

  const modalManager = initModalManager(eventBus);
  const viewManager = initViewManager(eventBus);
  const audio = new Audio("../../assets/risk_music.mp3");

  const controller = new GameController(
    modalManager,
    viewManager,
    ApiService,
    audio,
    eventBus,
    ChatBox
  );
  controller.init();
};

globalThis.onload = initalizeApp;
