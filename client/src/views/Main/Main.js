import React, {memo} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Lobby from "../Lobby/Lobby";
import Game from "../Game/Game";

const Main = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/lobby" component={Lobby}/>
                <Route path="/game/:id" component={Game}/>
                <Redirect to="/lobby"/>
            </Switch>
        </BrowserRouter>
    );
};

export default memo(Main);