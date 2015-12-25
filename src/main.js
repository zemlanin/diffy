import Baz from 'bazooka';
import tanok from 'tanok';

import {AppComponent} from './components';
import {update} from './handlers';

function App(node) {
    let state = {state: {}};
    let {disposable} = tanok(
        state,
        update,
        App,
        {container: node}
    );

    if (module.hot) {
        module.hot.accept(['./components', './handlers', './utils'], (deps) => {
            disposable.dispose();

            disposable = tanok(
                state,
                require('./handlers').update,
                require('./components').App,
                {container: node}
            ).disposable;
        });
    }

    return {};
}

Baz.register({App})
Baz.refresh()

