import { CHANGE_MENU_STATE } from "../type";


const initialState = {
    sidebarMenu: "Member",
};

export const activeMenuReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CHANGE_MENU_STATE:
            return {
                ...state,
                sidebarMenu: action.payload,
            };
        default:
            return state;
    }
};
