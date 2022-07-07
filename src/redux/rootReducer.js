import { combineReducers } from "redux"
import appReducer from "./app/reducer"
import authReducer from "./auth/reducer"
import userReducer from "./user/reducer"
import reportTypeReducer from "./reportType/reducer"
import reportReducer from "./report/reducer"
import postReducer from "./post/reducer"
import commentReducer from "./comment/reducer"

const rootReducer = combineReducers({
    app: appReducer, auth: authReducer, user: userReducer,
    reportType: reportTypeReducer,
    report: reportReducer,
    post: postReducer,
    comment: commentReducer
})

export default rootReducer