self.onmessage = ({ data }) => {
  let combinations = data[0].values
  
  for (let i = 1; i < data.length; i++) {
    const values = data[i].values
    const newCombinations = []
    for (const combination of combinations) {
      for (const value of values) {
        newCombinations.push(`${combination}-${value}`)
      }
    }
    combinations = newCombinations
  }
  self.postMessage(combinations);
};