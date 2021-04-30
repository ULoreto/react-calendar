import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
//----  reducers  ----
import rootReducer from '../reducers';

const middlewares = [ ReduxThunk ];

let composeEnhancers = compose;

if ( process.env.NODE_ENV === 'development' ) {
  middlewares.push( logger );
  // Permite utilizar la extension de redux para chrome
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer( persistConfig, rootReducer );

const configureStore = () => {
  const store = createStore(
    persistedReducer, // reducer compilado
    composeEnhancers(
      applyMiddleware( ...middlewares ) // permite ejecutar acciones de manera asyncrona
    ) );
  const persistor = persistStore( store );

  return { store, persistor }
}

export default configureStore;