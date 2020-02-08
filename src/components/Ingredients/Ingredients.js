import React,{useState, useEffect, useCallback} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {

  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(()=>{
    fetch('https://react-hooks-72979.firebaseio.com/ingredients.json').then(response =>
      response.json()
    ).then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].ingredient.title,
          amount: responseData[key].ingredient.amount
        })
        setUserIngredients(loadedIngredients);
        console.log(loadedIngredients);
      }
    });
  },[]);

  const filteredIngredientsHandler= useCallback((filterIngredients) => {
    setUserIngredients(filterIngredients);
  },[]);
  

  const addIngredientHandler = (ingredient) =>{
    fetch('https://react-hooks-72979.firebaseio.com/ingredients.json',{
      method : 'POST',
      body : JSON.stringify({ingredient}),
      headers : {'Content-Type' : 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [...prevIngredients,
      { id: responseData.name, ...ingredient }])
    });
    
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
          <IngredientList ingredients={userIngredients} onRemoveItem={()=>{}}/>
      </section>
    </div>
  );
}

export default Ingredients;
