const removeOldData = (selector) => {
    const oldVacc = document.getElementById(selector)
    let svgToDel = oldVacc.firstChild
    svgToDel && oldVacc.removeChild(svgToDel)
}

export default removeOldData