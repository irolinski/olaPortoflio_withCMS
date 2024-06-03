import { ScaleLoader } from "react-spinners";
import { dataType, seriesType } from "../../App";
import SeriesCard from "../../Components/Projects/ProjectCard";

// import { projectData } from "../../../public/project_data/projectData_all.ts";

type dataProp = {
  imageData: dataType
  loadingState: boolean
}

// setTimeout(() => {
//   setSlideOpacity(1);
// }, 600);

export default function AllProjects({ imageData, loadingState }: dataProp) {
  if (loadingState)  return (<div className="flex justify-center translate-y-[35vh] text-grey"><ScaleLoader color={"#e3e1e1"} /></div>)
  setTimeout(() => {console.log('Waiting some more to prevent pop-in...'), 500})
    return (
    <div className="flex flex-wrap fade-in-1s mx-auto justify-around md:p-16 pt-4">
      {imageData.map((p:seriesType, i: number) => {
        return (
          <SeriesCard
            imageUrl={p.cover}
            seriesTitle={p.name}
            seriesUrl={p.name.replace(/\s+/g, '-').toLowerCase()}
            key={i}
          />
        );
      })}
    </div>
  );
}
