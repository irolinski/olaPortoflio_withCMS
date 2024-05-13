import { dataType, seriesType } from "../../App";
import SeriesCard from "../../Components/Projects/ProjectCard";

// import { projectData } from "../../../public/project_data/projectData_all.ts";

type dataProp = {
  imageData: dataType
}

export default function AllProjects({ imageData }: dataProp) {
  return (
    <div className="flex flex-wrap mx-auto justify-around md:p-16 pt-4">
      {imageData.map((p:seriesType, i: number) => {
        return (
          <SeriesCard
            imageUrl={p.imgurl}
            seriesTitle={p.name}
            seriesUrl={p.url}
            key={i}
          />
        );
      })}
    </div>
  );
}
