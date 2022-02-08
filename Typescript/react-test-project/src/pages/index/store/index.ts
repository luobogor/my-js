import { createStore } from 'redux';

enum actionTypes {
    SET_NAME = 'SET_NAME',
}

interface Action {
    type: string,
    payload: any,
}

const initialState = { name: "来自 Redux 的珍爱" };

export const actions = {
    setName: (name: string) => ({
        type: actionTypes.SET_NAME,
        payload: { name }
    })
}

const reducer: any = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_NAME: {
            const { name } = action.payload;
            return { ...state, name };
        }

        default:
            return state;
    }
};

export default createStore(reducer);

