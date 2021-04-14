
import { Router, Route, Switch, Link } from 'react-router-dom';
import React, { useEffect } from "react";
import './App.css';
import axios from "axios";

import Admin from './screens/admin';
import Login from './screens/login';
import Home from './screens/home';
import Widgets from './screens/widgets';
import User from './screens/user';
import history from './History';

export default function App() {

  useEffect(() => {

    Promise.all([
      axios.get('/user/:id'),
      axios.get('/user/:id/collections/:id'),
      axios.get('/widgets'),
      axios.get('/widgets/:id')
    ])
    .then(all => {
      console.log('AHHHHHHHIMLOGGING', all)
    })
    .catch(err => {
      console.log('@@@@@@@@@@@@@@@@', err)
    })
  }, []);
   
  return (
    <main>
      <Router history = {history}>
        <nav>
          <Link to="/">Home </Link>
          <Link to="/admin">Admin </Link>
          <Link to="/login">Login </Link>
          <Link to="/widgets">Widgets </Link>
          <Link to="/idk">idk</Link>
          <Link to="/logout">Logout </Link>
        </nav>

        <Switch>
          <Route path="/admin" exact><Admin/></Route>
          <Route path="/login"><Login/> </Route>
          <Route path="/widgets" component={Widgets}></Route>
          <Route path="/user/:id/collections" component={User}></Route>
          <Route path="/"><Home/></Route>
        </Switch>
      </Router>
    </main>
  );
}