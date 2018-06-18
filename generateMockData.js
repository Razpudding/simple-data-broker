function generateMockData () {
  function leftPad (str, len, ch) {
    // convert `str` to a `string`
    str = str + '';
    // `len` is the `pad`'s length now
    len = len - str.length;
    // doesn't need to pad
    if (len <= 0) return str;
    // `ch` defaults to `' '`
    if (!ch && ch !== 0) ch = ' ';
    // convert `ch` to a `string` cuz it could be a number
    ch = ch + '';
    // cache common use cases
    if (ch === ' ' && len < 10) return cache[len] + str;
    // `pad` starts with an empty string
    var pad = '';
    // loop
    while (true) {
      // add `ch` to `pad` if `len` is odd
      if (len & 1) pad += ch;
      // divide `len` by 2, ditch the remainder
      len >>= 1;
      // "double" the `ch` so this operation count grows logarithmically on `len`
      // each time `ch` is "doubled", the `len` would need to be "doubled" too
      // similar to finding a value in binary search tree, hence O(log(n))
      if (len) ch += ch;
      // `len` is 0, exit the loop
      else break;
    }
    // pad `str`!
    return pad + str;
  }
  
  const months = [
    {
      "number": '01',
      "days": 31
    },
    {
      "number": '02',
      "days": 28
    },
    {
      "number": '03',
      "days": 31
    },
    {
      "number": '04',
      "days": 30
    },
    {
      "number": '05',
      "days": 31
    },
    {
      "number": '06',
      "days": 30
    },
    {
      "number": '07',
      "days": 31
    },
    {
      "number": '08',
      "days": 31
    },
    {
      "number": '09',
      "days": 30
    },
    {
      "number": '10',
      "days": 31
    },
    //  {
    //   "number": '11',
    //   "days": 30
    // },
    // {
    //   "number": '12',
    //   "days": 31
    // }
  ]
  
  const data = [];
  
  months.forEach(month => {
    const monthData = []
    
    for (let i = 1; i <= month.days; i++) {
      const day = leftPad(i, 2, '0')
      monthData.push(`${day}${month.number}181300007184835537234795483632`)
    }
    
    data.push(monthData.join(';'))
  })
  
  return data.join(';');
}

module.exports = generateMockData;