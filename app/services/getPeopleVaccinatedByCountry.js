import getPeopleVaccinated from './getPeopleVaccinated'

const getPeopleVaccinatedByCountry = () => {
    getPeopleVaccinated()
        .then(peopleVaccinated => { //observable code
            const rename = new Map([
                ["Antigua and Barbuda", "Antigua and Barb."],
                ["Bolivia (Plurinational State of)", "Bolivia"],
                ["Bosnia and Herzegovina", "Bosnia and Herz."],
                ["Bonaire Sint Eustatius and Saba", "Carib. Netherlands"],
                ["Brunei Darussalam", "Brunei"],
                ["Central African Republic", "Central African Rep."],
                ["Cook Islands", "Cook Is."],
                ["Democratic People's Republic of Korea", "North Korea"],
                ["Democratic Republic of Congo", "DR Congo"],
                ["Dominican Republic", "Dominican Rep."],
                ["Equatorial Guinea", "Eq. Guinea"],
                ["Iran (Islamic Republic of)", "Iran"],
                ["Lao People's Democratic Republic", "Laos"],
                ["Marshall Islands", "Marshall Is."],
                ["Micronesia (Federated States of)", "Micronesia"],
                ["Republic of Korea", "South Korea"],
                ["Republic of Moldova", "Moldova"],
                ["Russian Federation", "Russia"],
                ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
                ["Saint Vincent and the Grenadines", "St.Vin. and Gren."],
                ["Sao Tome and Principe", "São Tomé and Principe"],
                ["Solomon Islands", "Solomon Is."],
                ["South Sudan", "S. Sudan"],
                ["Swaziland", "eSwatini"],
                ["Syrian Arab Republic", "Syria"],
                ["The former Yugoslav Republic of Macedonia", "Macedonia"],
                ["United Republic of Tanzania", "Tanzania"],
                ["Venezuela (Bolivarian Republic of)", "Venezuela"],
                ["Viet Nam", "Vietnam"]
            ])
            let x = d => d.people_vaccinated, // given d in data, returns the (quantitative) x-value
                y = d => rename.get(d.country) || d.country, // given d in data, returns the (ordinal) y-value
                title, // given d in data, returns the title text
                marginTop = 30, // the top margin, in pixels
                marginRight = 0, // the right margin, in pixels
                marginBottom = 10, // the bottom margin, in pixels
                marginLeft = 100, // the left margin, in pixels
                width = window.innerWidth, // the outer width of the chart, in pixels
                height, // outer height, in pixels
                xType = d3.scaleLinear, // type of x-scale
                xRange = [marginLeft, width - marginRight], // [left, right]
                xFormat, // a format specifier string for the x-axis
                xLabel = "Vaccinations →", // a label for the x-axis
                yPadding = 0.2, // amount of y-range to reserve to separate bars
                yRange, // [top, bottom]
                color = "#0d6efd", // bar fill color
                titleColor = "white", // title fill color when atop bar
                titleAltColor = "currentColor" // title fill color when atop background

            const X = d3.map(peopleVaccinated, x);
            const Y = d3.map(peopleVaccinated, y);

            // Compute default domains, and unique the y-domain.
            let xDomain = [0, d3.max(X)];
            let yDomain = Y;
            yDomain = new d3.InternSet(yDomain);

            // Omit any data not present in the y-domain.
            const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

            // Compute the default height.
            if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
            if (yRange === undefined) yRange = [marginTop, height - marginBottom];

            // Construct scales and axes.
            const xScale = xType(xDomain, xRange);
            const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
            const xAxis = d3.axisTop(xScale).ticks(width / 95, xFormat);
            const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

            // Compute titles.
            if (title === undefined) {
                const formatValue = xScale.tickFormat(100, xFormat);
                title = i => `${formatValue(X[i])}`;
            } else {
                const O = d3.map(peopleVaccinated, d => d);
                const T = title;
                title = i => T(O[i], i, peopleVaccinated);
            }



            const svg = d3.select("#vaccinations-for-countries")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

            svg.append("g")
                .attr("transform", `translate(0,${marginTop})`)
                .call(xAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", height - marginTop - marginBottom)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", width - marginRight)
                    .attr("y", -22)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(xLabel));

            svg.append("g")
                .attr("fill", color)
                .selectAll("rect")
                .data(I)
                .join("rect")
                .attr("x", xScale(0))
                .attr("y", i => yScale(Y[i]))
                .attr("width", i => xScale(X[i]) - xScale(0))
                .attr("height", yScale.bandwidth());

            svg.append("g")
                .attr("fill", titleColor)
                .attr("text-anchor", "end")
                .attr("font-size", 15)
                .selectAll("text")
                .data(I)
                .join("text")
                .attr("x", i => xScale(X[i]))
                .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
                .attr("dy", "0.45em")
                .attr("dx", -4)
                .text(title)
                .call(text => text.filter(i => xScale(X[i]) - xScale(0) < 80) // short bars
                    .attr("dx", +4)
                    .attr("fill", titleAltColor)
                    .attr("text-anchor", "start"));

            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis);

        })
}

export default getPeopleVaccinatedByCountry