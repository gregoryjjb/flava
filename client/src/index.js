import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import AppContainer from './containers/AppContainer'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppContainer />, document.getElementById('root'));
registerServiceWorker();
