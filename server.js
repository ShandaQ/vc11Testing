const express = require('express');

// getting data in this case its from a json file
const {animals} = require('./data/animals');

// telling heruko which port to serve our app on
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();


function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
   
    if(query.personalityTraits){
        // save personalityTraits as a dedicated array.
        // if personalityTraits is a string, place it in a new array and save
        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits]
        }else{
            personalityTraitsArray = query.personalityTraits;
        }

        //  loop through each trait in  the personalityTraitsArray
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.

            // -1 if it is not present.
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }

    // filteredResults = filteredResults.filter(animal => animal.personalityTraits.indedOf(trait) !== -1);
            // {
            //     console.log(animal + " " + animal.personalityTraits.indedOf(trait) !== -1);
            //     (animal.personalityTraits.indedOf(trait) !== -1);
            // });

    // filtes for paramets by diet, species or name
    if (query.diet){
        filteredResults = filteredResults.filter(animals => animals.diet === query.diet);
    }
    if (query.species){
        filteredResults = filteredResults.filter(animals => animals.species === query.species);
    }
    if (query.name){
        filteredResults = filteredResults.filter(animals => animals.name === query.name);
    }
    return filteredResults;
}

/* 
takes in the id and array of animals and returns a single animal object
*/
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}
app.get('/', (req, res) => {
    res.json(results);
});
// Adding a route
app.get('/api/animals', (req, res) => {
    /* send hello to the client when access the url in the get
    res.send('Hello!');
    */

   /* send animals which we are telling is json format
        animals is also a conts that we declared at the top of our server.js
        that pulls from the animals.json file
        user get send the json object data
    res.json(animals);
    */

    /* using api url: http://localhost:3001/api/animals?name=Erica
        name being a query parameter and Erica being its value 
        when we log req.query we get back and object
    let results  = animals;
    console.log(req.query);
    res.json(results);
    */

    // calling out filterByQuery function
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
        // console.log(results);
    }
    res.json(results);

});

// adding another route 
/* req.params. Unlike the query object, the param object needs to be defined in the route path */
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    }else{
        res.send(404);
    }
  });

  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });