import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Features from '../../components/Features'
import CardSlider from '../../components/CardSlider'
import CarouselHome1 from '../../components/CarouselHome1'
import CarouselHome2 from '../../components/CarouselHome2'

const Home = () => {
  return (
    <>
      <Header />
      <CarouselHome1/>
      <Features/>
      <CarouselHome2/>
      <CardSlider/>
      <Footer/>
    </>
  )
}

export default Home
