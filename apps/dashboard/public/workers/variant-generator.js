self.onmessage = ({ data }) => {
  let combinations = data[0].values.map(({name}) => name)

  for (let i = 1; i < data.length; i++) {
    const values = data[i].values
    const newCombinations = []
    for (const combination of combinations) {
      for (const value of values) {
        newCombinations.push(`${combination}-${value.name}`)
      }
    }
    combinations = newCombinations
  }
  self.postMessage(combinations);
};