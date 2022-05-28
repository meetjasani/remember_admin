import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { toggleMenuReducer } from './reducers/toggleMenuReducer';
import { isUserLoginReducer } from './reducers/loginReducer';
import { activeMenuReducer } from './reducers/activeMenuReducer';

const middleware = [thunk];

const rootReducer = combineReducers({
  menuToggle: toggleMenuReducer,
  login:isUserLoginReducer,
  sidebarMenu: activeMenuReducer,
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
