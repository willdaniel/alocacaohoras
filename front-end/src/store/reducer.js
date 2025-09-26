import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import accountReducer from './accountReducer';
import menuReducer from './menuReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  account: accountReducer,
  menu: menuReducer
});

export default reducer;
