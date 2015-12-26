import Baz from 'bazooka';
import tanok from 'tanok';

import {AppComponent} from './components';
import {update} from './handlers';

require("./css/pure-min.css");
require("./css/style.css");

function App(node) {
    let state = {state: {}};
    let {disposable} = tanok(
        state,
        update,
        AppComponent,
        {container: node}
    );

    if (module.hot) {
        module.hot.accept(['./components', './handlers', './utils'], (deps) => {
            disposable.dispose();

            disposable = tanok(
                state,
                require('./handlers').update,
                require('./components').AppComponent,
                {container: node}
            ).disposable;
        });

        module.hot.decline();
        module.hot.decline("./css/style.css");
    }
}

Baz.register({App})
Baz.refresh()
