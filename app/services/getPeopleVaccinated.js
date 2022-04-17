const getPeopleVaccinated = async (type) => {
    const res = await fetch('/api/vaccinations/total/' + type, {
        method: 'GET',
        headers: { "Accept": "application/json" }
    })
    if (res.ok === true) {
        const peopleVaccinated = await res.json()
        return peopleVaccinated
    }
}

export default getPeopleVaccinated