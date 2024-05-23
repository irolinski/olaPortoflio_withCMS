
type descriptionProps = {
    description: string[];
}

export default function Description({ description }: descriptionProps) {
  return (
    <div>
          {description.map((s) => {
              return (
                  <>
                      <span>{s}</span><br /> 
                      </>
          )
      })}
    </div>
  )
}
