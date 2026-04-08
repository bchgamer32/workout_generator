// importing the useEffect and useState hooks from React, as well as the CSS file for styling
import { useEffect, useState } from 'react'
import './App.css'


// the main App component that manages the state and renders the UI
function App() {
  const [muscle, setMuscle] = useState('') // the state to keep track of what muscle is selected
  const API_KEY = import.meta.env.VITE_API_KEY //storing the api key so we can use it on the fetch
  const [exercises, setExercises] = useState([]) // empty array for exercises as we will add the response that we get from the api to this variable "exercises" and then map over it and display it
  const [loading, setLoading] = useState(false) // a simple loading state

  useEffect(() => {
    // if no muscle is selected, we don't want to make an API call, so we return early
    if (!muscle) return

    // when a muscle is selected, we set loading to true and clear the exercises array before making the API call
    setLoading(true)
    setExercises([])

    // making the API call to fetch exercises based on the selected muscle group
    fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: {
        'X-Api-Key': API_KEY,
        'Accept': 'application/json'
      }
    })
    // parsing the response as JSON and updating the exercises state with the data we receive, and setting loading to false once we have the data
      .then(res => res.json())
      .then(data => {
        setExercises(data)
        setLoading(false)
      })
      // catching the error here and logging it to the console, and also setting loading to false in case of an error so that the user doesn't get stuck on the loading state
      .catch(err => console.error(err))
  }, [muscle]) // this is the dependency array which basically means this fetch will run everytime when the muslce is changed. meaning when i press on the different buttons.


  // 
  return (
    <div>
      <h1>WORKOUT<br /><span>GEN</span></h1>
      {/*passing down the setMuscle function and the current selected muscle to the MuscleSelector component so that it can update the muscle state in the App component when a button is clicked, and also to highlight the currently selected muscle group button.*/}
      <MuscleSelector setMuscle={setMuscle} currentMuscle={muscle} />
      {/*if no muscle is selected, we show a message prompting the user to select a muscle group. if a muscle is selected but the data is still loading, we show a loading message. otherwise, we render the ExerciseList component and pass the exercises data to it as a prop.*/}
      {!muscle
        ? <p className='state-message'>Select a muscle group to begin</p>
        : loading
        ? <p className='state-message'>Loading exercises...</p>
        : <ExerciseList exercises={exercises} />
      }
    </div>
  )
}

// this MuscleSelector component renders a set of buttons for each muscle group, and when a button is clicked, it updates the muscle state in the App component through the setMuscle function passed down as a prop. It also highlights the currently selected muscle group button by applying an 'active' class to it which ofcourse looks visually different because of the css.
function MuscleSelector({ setMuscle, currentMuscle }) {
  const muscles = ['chest', 'shoulders', 'biceps', 'triceps', 'back', 'legs']
  
  return (
    <div className='buttons'>
      {muscles.map((muscle) => (
        <button
          key={muscle}
          className={muscle === currentMuscle ? 'button active' : 'button'}
          onClick={() => setMuscle(muscle)}
        >
          {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
        </button>
      ))}
    </div>
  )
}

// this ExerciseList component takes the exercises data as a prop and maps over it to render an ExerciseCard for each exercise. The ExerciseCard component is responsible for displaying the details of each exercise, like the the name, difficulty, type, equipment, instructions, and safety information. It also has a toggle button to show or hide the instructions and safety info.
function ExerciseList({ exercises }) {
  return (
    <div className='exercise-list'>
      {exercises.map((exercise, index) => (
        <ExerciseCard key={index} exercise={exercise} />
      ))}
    </div>
  )
}

// this ExerciseCard component takes an exercise object as a prop and displays its details. It uses a local state variable 'isOpen' to manage whether the instructions and safety info are shown or hidden. when the toggle is clicked, it toggles the 'isOpen' state, which in turn shows or hides the additional details of the exercise.
function ExerciseCard({ exercise }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='exercise-card'>
      <h2>{exercise.name}</h2>

      <div className='card-meta'>
        <span className={`badge ${exercise.difficulty}`}>{exercise.difficulty}</span>
        <span className='badge'>{exercise.type}</span>
        <span className='badge'>{exercise.equipments.join(', ')}</span>
      </div>

      {isOpen && (
        <div className='card-details'>
          <div className='detail-block'>
            <p className='detail-label'>Instructions</p>
            <p>{exercise.instructions}</p>
          </div>
          <div className='detail-block'>
            <p className='detail-label'>Safety Note</p>
            <p>{exercise.safety_info}</p>
          </div>
        </div>
      )}

      <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Show less ↑' : 'Show more ↓'}
      </button>
    </div>
  )
}

export default App