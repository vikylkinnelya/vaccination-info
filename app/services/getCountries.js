const getCountries = async () => {
    await fetch('/api/countries', {
        method: 'GET',
        headers: { "Accept": "application/json" }
    })
        .then(response => response.json())
        .then(jsonResponse => {
            const datalist = document.querySelector('#data-list-countries')
            jsonResponse.forEach(el => {
                let option = document.createElement('option')
                option.value = el
                option.textContent = el
                datalist.appendChild(option)
            })
        })
}

export default getCountries