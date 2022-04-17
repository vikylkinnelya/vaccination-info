const express = require('express')
const fs = require("fs");

const app = express()
const parser = express.json()

app.use(express.static(__dirname))

const dataPath = __dirname + '/vaccinations.json'


app.get('/api/vaccinations', (req, res) => {
    const content = fs.readFileSync(dataPath, 'utf8') //cчит файл в строку
    const vaccinations = JSON.parse(content) //парсинг в обьект
    res.send(vaccinations)
})

app.get('/api/vaccinations/total/:type', (req, res) => {
    const content = fs.readFileSync(dataPath, 'utf8') //cчит файл в строку
    const vaccinations = JSON.parse(content) //парсинг в обьект
    let totalVac = []
    let type = req.params.type
    const continents = ["Asia", 'Europe', "Africa", 'North America', 'South America']
    const social = ['High income', 'Low income', 'Lower middle income', 'Upper middle income']
    const other = ["Asia", 'World', 'Europe', "Africa", 'European Union',
        'High income', 'Low income', 'Lower middle income', 'Upper middle income',
        'North America', 'South America', 'Russia', 'United States']

    vaccinations.forEach(el => {
        let country = el.country
        let countryObj = { country: country }

        let param = type === 'social' ? social.includes(country) :
            type === 'continents' ? continents.includes(country) :
                !other.includes(country)

        for (let i = el.data.length - 1; i >= 0; i--) {
            let vacPerHundr = el.data[i].people_vaccinated

            param && vacPerHundr && (
                countryObj.date = el.data[i].date,
                countryObj.people_vaccinated = vacPerHundr,
                totalVac.push(countryObj)
            )
            break
        }
    })
    res.send(totalVac.sort((a, b) => b.people_vaccinated - a.people_vaccinated))
})

app.get('/api/vaccinations/:country', function (req, res) {
    const country = req.params.country

    const content = fs.readFileSync(dataPath, 'utf8') //cчит файл в строку
    const vaccinations = JSON.parse(content) //парсинг в обьект

    let vaccination = null;

    for (let i = 0; i < vaccinations.length; i++) {
        if (vaccinations[i].country == country) {
            vaccination = vaccinations[i];
            break;
        }
    }
    !vaccination && res.status(404).send();

    if (vaccination) {
        let data = []
        vaccination.data.forEach(el => {
            el.people_vaccinated &&
                data.push({ date: el.date, people_vaccinated: el.people_vaccinated })
        })
        res.send({ country: country, data: data })
    }

})

app.get('/api/countries', (req, res) => {
    const content = fs.readFileSync(dataPath, 'utf8') //cчит файл в строку
    const vaccinations = JSON.parse(content) //парсинг в обьект
    let countries = []
    vaccinations.forEach(country => countries.push(country.country))
    res.send(countries)
})


app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});