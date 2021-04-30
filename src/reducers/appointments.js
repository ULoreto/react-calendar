import types from '../utils/types';

const initialState = {
  appointments: null,
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case types.ADD_APPOITMENTS:
      {
        const { appointments } = action.payload;
        return {
          ...state,
          appointments
        };
      }
    case types.RESET_ALL_DATA:
      {
        return { ...initialState };
      }
    default:
      {
        return state;
      }
  }
};