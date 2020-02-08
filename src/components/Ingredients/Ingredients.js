import React,{useState, useReducer, useEffect, useCallback} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModel from '../UI/ErrorModal';


const ingredientReducer = (currentIngredient, action) => {
  switch(action.type){
    case 'SET' :
      return action.ingredients;
    case 'ADD' :
      return [...currentIngredient,action.ingredient];
    default :
      throw new Error('Should not get there');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer,[]);
  //const [userIngredients, setUserIngredients] = useState([]);
  const [error, setError] = useState();

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
        //setUserIngredients(loadedIngredients);
        // console.log(loadedIngredients);
        dispatch({type:'SET',ingredients:loadedIngredients});
      }
    }).catch(error => {
      setError('Something went wrong !!');
    });
  },[]);

  const filteredIngredientsHandler= useCallback((filterIngredients) => {
    //setUserIngredients(filterIngredients);
    dispatch({type : 'SET', ingredients : filterIngredients})
  },[]);

  

  const addIngredientHandler = (ingredient) =>{
    fetch('https://react-hooks-72979.firebaseio.com/ingredients.json',{
      method : 'POST',
      body : JSON.stringify({ingredient}),
      headers : {'Content-Type' : 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [...prevIngredients,
      // { id: responseData.name, ...ingredient }])
      dispatch({type: 'ADD',ingredient : {id : responseData.name, ...ingredient}})
    }).catch(error => {
      setError('Something went wrong !!');
    });
    
  }

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModel onClose={clearError}>{error}</ErrorModel>}
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
          <IngredientList ingredients={userIngredients} onRemoveItem={()=>{}}/>
      </section>
    </div>
  );
}

export default Ingredients;
