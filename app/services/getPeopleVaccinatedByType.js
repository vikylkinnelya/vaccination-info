const getPeopleVaccinatedByType = (type) => {
    getPeopleVaccinated(type)
        .then(peopleVaccinatedBySocial => {
            let name = d => d.country,
                value = d => d.people_vaccinated,
                title, // given d in data, returns the title text
                width = 800, // outer width, in pixels
                height = 400, // outer height, in pixels
                innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
                outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
                labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
                format = ",", // a format specifier for values (in the label)
                names, // array of names (the domain of the color scale)
                colors, // array of colors for names
                stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
                strokeWidth = 1, // width of stroke separating wedges
                strokeLinejoin = "round", // line join of stroke separating wedges
                padAngle = stroke === "none" ? 1 / outerRadius : 0

            const N = d3.map(peopleVaccinatedBySocial, name);
            const V = d3.map(peopleVaccinatedBySocial, value);
            const I = d3.range(N.length).filter(i => !isNaN(V[i]));

            // Unique the names.
            if (names === undefined) names = N;
            names = new d3.InternSet(names);

            // Chose a default color scheme based on cardinality.
            if (colors === undefined) colors = d3.schemeSpectral[names.size];
            if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

            // Construct scales.
            const color = d3.scaleOrdinal(names, colors);

            // Compute titles.
            if (title === undefined) {
                const formatValue = d3.format(format);
                title = i => `${N[i]}`;
            } else {
                const O = d3.map(peopleVaccinatedBySocial, d => d);
                const T = title;
                title = i => T(O[i], i, peopleVaccinatedBySocial);
            }

            // Construct arcs.
            const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
            const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
            const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

            const svg = d3.select(`#vaccinations-for-${type}`)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 3.5, -height / 2, width, height])
                .attr("style", "min-width: 600px; max-width: 100%; height: auto; height: intrinsic;");

            svg.append("g")
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linejoin", strokeLinejoin)
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr("fill", d => color(N[d.data]))
                .attr("d", arc)
                .append("title")
                .text(d => title(d.data));

            svg.append("g")
                .attr("font-size", 15)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .selectAll("tspan")
                .data(d => {
                    const lines = `${title(d.data)}`.split(/\n/);
                    return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
                })
                .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "normal")
                .text(d => d);


            let legendG = svg.append("g") // note appending it to mySvg and not svg to make positioning easier
                .attr("class", "legend")
                .attr("font-size", 15)
                .attr("text-anchor", "start")
                .selectAll("g")
                .data(arcs)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(10," + i * 30 + ")";
                });

            legendG.append("text")
                .attr("x", outerRadius + 30)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function (d) {
                    return `${N[d.data]}\n${d3.format(format)(V[d.data])}`
                })

            legendG.append("rect")
                .attr("x", outerRadius + 10)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", function (d, i) {
                    return color(i);
                })
        })
}

export default getPeopleVaccinatedByType