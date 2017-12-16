import AppStore from "./appStore";
import GameStore from "./gameStore";
import LobbyStore from "./lobbyStore";
import UserStore from "./userStore";

export default function(services){
    const userStore = new UserStore(services);
    const gameStore = new GameStore(services, userStore);
    const lobbyStore = new LobbyStore(services, userStore);
    const appStore = new AppStore(services);

    return {
        userStore,
        gameStore,
        lobbyStore,
        appStore
    };

}
