// import React from 'react'
// import { Route, Redirect } from 'react-router-dom'
//
// const fakeAuth = () => true
//
// const checkAuth = component => props => fakeAuth.isAuthenticated ? (
//   React.createElement(component, props)
// ) : (
//   <Redirect
//     to={{
//       pathname: '/login',
//       state: { from: props.location }
//     }}
//   />
// )
//
// const PrivateRoute = ({ component, ...rest }) => (
//   <Route
//     {...rest}
//     render={checkAuth(component)}
//   />
// )
//
// export default PrivateRoute
