const Header = ({ course }) => <h2>{course.name}</h2>
  
const Part = ({ name, exercises }) => <p> {name} {exercises}</p>

const Content = ({ course }) => (
    <>
        {course.parts.map(part =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
    </>
)

const Total = ({ course }) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <b>total of {total} exercises</b>
    )
}

const Course = ({ course }) => (
    <>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
    </>
)

export { Course }