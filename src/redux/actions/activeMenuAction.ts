import { CHANGE_MENU_STATE } from "../type"


export const changeMenuState = (value :string) => (dispatch: any) =>{
    dispatch({
        type:CHANGE_MENU_STATE,
        payload:value,
    })

}