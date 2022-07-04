import { combineReducers } from "redux"
import appReducer from "./app/reducer"
import authReducer from "./auth/reducer"
import userReducer from "./user/reducer"
import reportTypeReducer from "./reportType/reducer"
import reportReducer from "./report/reducer"

const rootReducer = combineReducers({
    app: appReducer, auth: authReducer, user: userReducer,
    reportType: reportTypeReducer,
    report: reportReducer,
})

export default rootReducer