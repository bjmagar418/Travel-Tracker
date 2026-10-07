import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"Post@98211",
  port:5434
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// part 1  get homepage  it display the country teeal by country code
app.get("/", async (req, res) => {
  //Write your code here.
const result = await db.query("SELECT country_code FROM visited_countries");
let countries =[];
result.rows.forEach((country)=>{
countries.push(country.country_code);
});
console.log(result.rows);
res.render("index.ejs",{countries:countries, total:countries.length});
//db.end();
});


//part 2 INsert new country  it find the country code and add to database and goes to code 1 above
app.post("/add",async(req,res)=>{
const input = req.body["country"];

const result = await db.query(
  "SELECT country_code FROM countries WHERE country_name = $1",[input]
);
if(result.rows.length !==0){
  const data = result.rows[0];
  console.log(data);
  const countryCode = data.country_code;

  await db.query("INSERT INTO visited_countries(country_code )VALUES ($1)",[
    countryCode
  ]);
  res.redirect("/");
}
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
