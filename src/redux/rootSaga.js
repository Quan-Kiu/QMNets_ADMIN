import { fork, all } from 'redux-saga/effects'
import authSaga from './auth/saga'
import userSaga from './user/saga'
import reportTypeSaga from './reportType/saga'
import reportSaga from './report/saga'

function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(userSaga),
        fork(reportTypeSaga),
        fork(reportSaga),
    ])
}


export default rootSaga;