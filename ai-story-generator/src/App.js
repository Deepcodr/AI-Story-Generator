import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StoryGeneration from './components/StoryGeneration.js';
import Home from './components/Home.js';
import Feed from './components/Feed.js';
import Login from './components/Login.js';
import UserHome from './components/UserHome.js'
import LeaderBoard from './components/LeaderBoard.js';
import MyStories from "./components/MyStories.js";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/feed' element={<Feed />}></Route>
                <Route path='/storygenerate' element={<StoryGeneration />}></Route>
                <Route path='/userhome' element={<UserHome/>}></Route>
                <Route path='/leaderboard' element={<LeaderBoard/>}></Route>
                <Route path='/mystories' element={<MyStories/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;