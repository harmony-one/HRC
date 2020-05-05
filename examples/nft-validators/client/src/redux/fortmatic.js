import { getReducer, getState } from '../util/redux-util-v2'
import { signIn, updateProcessing, signOut } from './harmony'
import { navigate } from "@reach/router"
import Fortmatic from 'fortmatic';
//default state
const defaultState = {
    isLoggedIn: true,
    account: null,
}
//reducer
const type = 'fortmaticReducer'
export const fortmaticReducer = getReducer(type, defaultState)
export const fortmaticState = getState(type)
//functions
/********************************
Formatic Login
********************************/

export const fortmaticSignOut = () => async (dispatch) => {
    const fmPhantom = new Fortmatic.Phantom('pk_test_1C24F45217D39E66'); // ✨
    if (fmPhantom.user && fmPhantom.user.isLoggedIn()) {
        await fmPhantom.user.logout()
        dispatch(signOut())
        return true
    }
    return false
}
export const checkFortmaticLogin = () => async (dispatch) => {

    /********************************
    Skipping for debug / local testing
    ********************************/
    await dispatch({ type, isLoggedIn: true })
    await dispatch(signIn())
    dispatch(updateProcessing(false))
    return true

    // const fmPhantom = new Fortmatic.Phantom('pk_test_1C24F45217D39E66'); // ✨
    // if (fmPhantom.user && (await fmPhantom.user.isLoggedIn())) {
    //     const account = accounts[(await fmPhantom.user.getMetadata()).publicAddress]
    //     console.log(account)
    //     if (account) {
    //         await dispatch({ type, isLoggedIn: true, account })
    //         await dispatch(signIn(account))
    //         dispatch(updateProcessing(false))
    //         return true
    //     }
    // }
    // dispatch(updateProcessing(false))
    // return false
}

export const handleLoginWithMagicLink = (email) => async (dispatch) => {
    const fmPhantom = new Fortmatic.Phantom('pk_test_1C24F45217D39E66'); // ✨
    if (fmPhantom.user && fmPhantom.user.isLoggedIn()) {
        await fmPhantom.user.logout()
    }
    console.log('handleLoginWithMagicLink', email)
    const user = await fmPhantom.loginWithMagicLink({ email });
    console.log(await user.isLoggedIn()); // => true
    const account = accounts[(await user.getMetadata()).publicAddress]
    if (account) {
        await dispatch({ type, isLoggedIn: true, account })
        await dispatch(signIn(account))
        setTimeout(() => navigate('/'), 250)
    }
}