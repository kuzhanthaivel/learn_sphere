import Footer from "../components/footer";
import Header from "../components/Header";
import Hero from "../components/landingPage/Hero";
import Features from "../components/landingPage/features";
import Categories from "../components/landingPage/Categories";
import RegisterNow from "../components/landingPage/registerNow";

import React from "react";

export default function landingPage() {
    return (
        <div>
            <Header />
            <Hero />
            <Features />
            <Categories />
            <RegisterNow />
            <Footer />
        </div>
    )
}