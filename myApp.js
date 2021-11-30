require('dotenv').config();
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });;

var personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

var Person = mongoose.model("Person", personSchema);

var createAndSavePerson = function(done) {
  var ricardoLopez = new Person ({name: "Ricardo Lopez", age: 25, favoriteFoods: ["leche", "fideos", "cafe"]});

  ricardoLopez.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};

var arrayOfPeople = [
  {name: "Pablo Garcia", age: 30, favoriteFoods: ["Arroz", "Dulde de Leche", "Crema"]},
  {name: "Patricia Lucero", age: 36, favoriteFoods: ["Pollo", "Pescado", "Fideos"]},
  {name: "Monica Galindo", age: 24, favoriteFoods: ["Anchoas", "Sardinas", "Rabas"]},
  {name: "Sabrina Medina", age: 21, favoriteFoods: ["Pavo", "Pure", "Ensalada"]}
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.error(err);
    done(null, people)
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function (err, data){
    if (err) return console.error(err);
    done(null, data);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function (err,data){
    if (err) return console.error(err);
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, data) {
    if (err) return console.error(err);
    done (null, data);
  })
};

const findEditThenSave = (personId, done) => {
  var foodToAdd = "hamburger";
  Person.findById(personId, function(err, person) {
    if (err) return console.error(err);
    person.favoriteFoods.push(foodToAdd);
    person.save( function (err, data) {
      if (err) return console.error(err);
      done(null, data);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new:true}, function (err, data) {
    if (err) console.error(err);
    done(null, data);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) console.error(err);
    done(null, data);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, data) => {
    if (err) console.error(err);
    done(null, data);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  var shearchSave = Person.find({favoriteFoods: foodToSearch});
  shearchSave.sort({name: 1})
             .limit(2)
             .select({age: 0});
  shearchSave.exec((err,data) => {
    if (err) console.error(err);
    done(null, data);
  });
};

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
