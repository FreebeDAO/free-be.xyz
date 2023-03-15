import { H5App } from "./apps/h5";
import { PCApp } from "./apps/pc";
import { mountVDom } from "./services/bootstrap";

function setup() {
    const App = window.innerWidth < 820 ? H5App : PCApp;
    mountVDom(<App />, "#root");
}

setup();
