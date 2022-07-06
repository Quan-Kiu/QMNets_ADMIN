import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import User from '../pages/User'
import ReportType from '../pages/ReportType'
import Report from '../pages/Report'
import Post from '../pages/Post'

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Dashboard} />
            <Route path='/Users' exact component={User} />
            <Route path='/ReportTypes' exact component={ReportType} />
            <Route path='/Reports' exact component={Report} />
            <Route path='/Posts' exact component={Post} />
            <Route path='/customers' component={Customers} />
        </Switch>
    )
}

export default Routes
