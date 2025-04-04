import Footer from "../components/footer";
import Header from "../components/Header";
import Hero from "../components/landingPage/Hero";
import Features from "../components/landingPage/features";
import Categories from "../components/landingPage/Categories";
import PopularCourses from "../components/landingPage/PopularCourses";
import React from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default function( ) {
    return (
        <div>
        <Header/>
        <Hero/>
        <Features/>
        <Categories/>
        <PopularCourses/>
        <Footer/>
        </div>
    )
}