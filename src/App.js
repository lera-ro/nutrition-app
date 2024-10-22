import { useEffect, useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import LoaderPage from './LoaderPage';
import Nutrition from './Nutrition';

function App() {

  const [mySearch, setMySearch] = useState('');  
  const [myNutrient, setMyNutrient] = useState();
  const [stateLoader, setStateLoader] = useState(true);
  const [wordSubmitted, setWordSubmitted] = useState("");

  const API_ID = "b4756fde";
  const API_KEY = "0905c11a6cfd879ecc832e6852c74a4a";

  const callNutrition = async (ingr)=>{
    setStateLoader(true);
    const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${API_ID}&app_key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ingr: ingr})
    })
    if (response.ok){
      setStateLoader(false);
      const data = await response.json();
      setMyNutrient(data);
    }
    else {
      setStateLoader(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ingredients entered incorrectly",
      }); 
    }
  }

  useEffect(() => {
    if (wordSubmitted !== ''){
      let ingr = wordSubmitted.split(/[(/[,,;,\n,\r]/);
      callNutrition(ingr);
    }
  }, [wordSubmitted])
  
  const myNutrientSearch = (e) => {
    setMySearch(e.target.value);
  }

  const finalSearch = (e) => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  return(<div>
  <div className='container'>
    <h1>Nutrition Analysis</h1>
  </div>

  <div className='container'>
    <p>Write what products and how many pieces you want to find. <br />For example: 1 tomato 1 cucumber.</p> 
    </div>
      
    <div className='container'>
      <form onSubmit={finalSearch}>
        <input onChange={myNutrientSearch} value={mySearch} className='search'/>
      </form>
    </div>

    <div className='container'>
      <button onClick={finalSearch} className='btn'>SEARCH</button>
    </div>
    
    <div className='container'>
      {stateLoader && <LoaderPage />}
    </div>

    
      {myNutrient && Object.values(myNutrient.totalNutrients).map(({label, quantity, unit}) => (
        <div className='section' key={label}>
        <Nutrition 
        label = {label}
        quantity = {quantity.toFixed()}
        unit = {unit} />
        </div>
      ))}


  </div>)
}

export default App;
