import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.scss";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import StartPage from "./Pages/Projects/StartPage.tsx";
import AllProjects from "./Pages/Projects/AllProjects";
import ProjectPage from "./Pages/Projects/ProjectPage.tsx";
import AboutPage from "./Pages/Projects/AboutPage.tsx";
import { useEffect, useState } from "react";

export type seriesType = {
  name: string;
  slides: Array<string>;
  url: string;
  cover: string;
};

export type dataType = Array<seriesType>;

export default function App() {
  const location = useLocation();

  const blankData: any[] | (() => any[]) = [];

  let [imageData, setImageData] = useState<any[]>(blankData);

  useEffect(() => {
    (async () => {
      const seriesAPIRes = await fetch(
        "http://localhost:3000/api/series"
      );
      const series = await seriesAPIRes.json();
      setImageData(series);
    })();
  }, []);

  console.log(imageData.map((p) => {
    return p.slides
    return p.name
  }))
  return (
    <div className="min-h-full max-w-[1920px] mx-auto 3xl:relative 3xl:top-[12.5vh]">
      <Navbar location={location.pathname} />
      <div className="">
        <Routes>
          <Route path="/" element={<Navigate replace to="/start" />} />
          <Route path="/start" element={<StartPage />} />
          <Route
            path="/projekty"
            element={<AllProjects imageData={imageData} />}
          />
          {imageData.map((p: seriesType, i: number) => {
            return (
              <Route
                path={`/projekty/${p.name.replace(/\s+/g, '-').toLowerCase()}`}
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
