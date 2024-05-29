import { useEffect, useState } from "react";

type aboutData = {
  role: string,
  profile_picture_url: string,
  description: string,
  phone_num: string,
  e_mail: string,
  instagram_url: string
}

export default function AboutPage() {

  const [aboutData, setAboutData] = useState<aboutData>();
  const [d, setD] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const aboutmeAPIRes = await fetch(
        "https://photoportfolio-cms-demo.vercel.app/api/about-me"
      );
      const data = await aboutmeAPIRes.json()
      console.log(data);
      setAboutData(data);
      setD((data.description.split('\n\n\n')));

    })();
  }, []);

  // console.log(aboutData?.description.split('\n\n\n'))
  // console.log(d);

  // function returnDesc: (d: string[] ) => {
  //   d?.map((p) => {
  //     return( <div></div>)
  //   })
  // }
  // console.log(d);



  return (
    <div className="flex flex-wrap mx-auto justify-around sm:p-16 mb-36 mt-24 lg:my-0 lg:py-[8vh] lg:flex-nowrap">
      <img
        className="max-w-96 max-h-96 py-8 px-16 lg:px-16 mx-auto self-center xs:-translate-y-12 lg:-translate-y-0 hover:cursor-none"
        src={aboutData?.profile_picture_url}
        // src="https://res.cloudinary.com/dtjtqp7r1/image/upload/v1713909540/z-Ola%20K.-Portfolio/epbq3ohpz26q4aq5uyut.jpg"
      />
      <div className="about-text font-header py-10 px-8 sm:px-12 lg:p-10 my-1 lg:my-4">
        <p className="pt-16 text-md md:px-16 lg:py-8 lg:px-24">
          <span className="text-justify whitespace-pre-line">
            {aboutData?.description}
          </span>
          <span className="flex pt-2">
            <img
              src="/icons/phone.svg"
              className="block self-center h-5 w-5"
              aria-hidden="true"
            />
            &nbsp; {aboutData?.phone_num} <br />
          </span>
          <span className="flex pt-1">
            <img
              src="/icons/mail.svg"
              className="block self-center h-5 w-5 translate-y-[1px]"
              aria-hidden="true"
            />{" "}
            <a href="mailto:pola.brogosiewicz@gmail.com">
              &nbsp; {aboutData?.e_mail}
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
