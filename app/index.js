'use strict';
import getCountries from './services/getCountries'
import getPeopleVaccinated from './services/getPeopleVaccinated'
import getPeopleVaccinatedByCountry from './services/getPeopleVaccinatedByCountry'
import getPeopleVaccinatedByType from './services/getPeopleVaccinatedByType'
import getVaccinationForState from './services/getVaccinationForState'

window.addEventListener('DOMContentLoaded', () => {

    const spinner = document.getElementById('spinner')
    const showSpinner = () => spinner.style.display = 'block'
    const hideSpinner = () => spinner.style.display = 'block'

    const countryForm = document.getElementById('country-form')
    const countryInput = document.getElementById('country-input')

    countryForm.addEventListener("submit", e => {
        e.preventDefault()
        showSpinner()
        const inputCountry = countryInput.value;
        removeOldData('vaccinations-for-country')
        getVaccinationForState(inputCountry)
        hideSpinner()
    });

    const worldwideBtn = document.getElementById('worldwide')
    const socialBtn = document.getElementById('social')
    const continentsBtn = document.getElementById('continents')

    worldwideBtn.addEventListener('click', e => {
        e.preventDefault()
        showSpinner()
        !document.getElementById('vaccinations-for-countries').children.length > 0 &&
            getPeopleVaccinatedByCountry()
        hideSpinner()
    })

    socialBtn.addEventListener('click', e => {
        e.preventDefault()
        showSpinner()
        !document.getElementById('vaccinations-for-social').children.length > 0 &&
            getPeopleVaccinatedByType('social')
        hideSpinner()
    })
    continentsBtn.addEventListener('click', e => {
        e.preventDefault()
        showSpinner()
        !document.getElementById('vaccinations-for-continents').children.length > 0 &&
            getPeopleVaccinatedByType('continents')
        hideSpinner()
    })
})

window.onload = getCountries()
window.onload = getPeopleVaccinatedByCountry()

function removeOldData(selector) {
    const oldVacc = document.getElementById(selector)
    let svgToDel = oldVacc.firstChild
    svgToDel && oldVacc.removeChild(svgToDel)
}