import * as actionTypes from './actions';

export const initialState = {
  menuItems: [] // Começa com o menu vazio
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MENU_ITEMS:
      return {
        ...state,
        menuItems: action.items
      };
    default:
      return state;
  }
};

export default menuReducer;