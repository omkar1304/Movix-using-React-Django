import React from 'react'
import './details.scss'
import DetailsBanner from './detailsBanner/DetailsBanner'
import { useParams } from "react-router-dom";
import useFetch from '../../hooks/useFetch';
import Cast from './cast/Cast';
import VideosSection from './videosSection/videosSection';
import Similar from './carousels/Similar';
import Recommendation from './carousels/Recommendation';
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

const Details = () => {
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: credits, loading: creditsLoading } = useFetch(`/${mediaType}/${id}/credits`);

  return (
    <div>
      <Header />
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading}/>
      <VideosSection data={data} loading={loading}/>
      <Similar mediaType={mediaType} id={id}/>
      <Recommendation mediaType={mediaType} id={id}/>
      <Footer />
    </div>
  )
}

export default Details