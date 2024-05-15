import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.scss";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import StartPage from "./Pages/Projects/StartPage.tsx";
import AllProjects from "./Pages/Projects/AllProjects";
import ProjectPage from "./Pages/Projects/ProjectPage.tsx";
// import { projectData } from "../public/project_data/projectData_all.ts";
import AboutPage from "./Pages/Projects/AboutPage.tsx";
import { useEffect, useState } from "react";

export type seriesType = {
  name: string;
  slides: Array<string>
  url: string;
  imgurl: string;
};

export type dataType = Array<seriesType> 


export default function App() {
  const location = useLocation();

const blankData: any[] | (() => any[]) = []

  // let [profileData, setProfileData] = useState<any[]>(blankData);
  // const [slideshowData, setSlideshowData] = useState<any[]>(blankData);
  // const [aboutPageData, setAboutPageData] = useState<any[]>(blankData);



  let [imageData, setImageData] = useState<any[]>(blankData);

  useEffect(() => {
    (async () => {
      // const profileAPIRes = await fetch("https://photoportfolio-cms-demo.vercel.app/api/profile");
      const seriesAPIRes = await fetch("https://photoportfolio-cms-demo.vercel.app/api/series");
      // const profile = await profileAPIRes.json();
      const series = await seriesAPIRes.json();
      // setSlideshowData(profile[0].slides);
      setImageData(series);    
    })();
  }, []);



  return (
    <div className="min-h-full max-w-[1920px] mx-auto 3xl:relative 3xl:top-[12.5vh]">
      <Navbar location={location.pathname} />
      <div className="">
        <Routes>
          <Route path="/" element={<Navigate replace to="/start" />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/projekty" element={<AllProjects imageData={imageData} />} />
          {imageData.map((p: seriesType, i: number) => {
            return (
              <Route
                path={p.url}
                element={<ProjectPage name={p.name} slides={p.slides} />}
                key={i}
              />
            );
          })}
          <Route path="/o-mnie" element={<AboutPage />} />
          <Route path="*" element={<Navigate replace to="/start" />} />
        </Routes>
      </div>
      <Footer location={location.pathname} />
    </div>
  );
}
