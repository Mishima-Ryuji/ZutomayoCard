interface Rules {
  pluralRules: Record<string, string>
  singularRules: Record<string, string>
  uninflected: string[]
  pluralIrregular: Record<string, string>
  singularIrregular: Record<string, string>
}

const rules: Rules = {
  pluralRules: {
    '/(s)tatus$/i': 'RegExp.$1+"tatuses"',
    '/^(ox)$/i': 'RegExp.$1+"en"',
    '/([m|l])ouse$/i': 'RegExp.$1+"ice"',
    '/(matr|vert|ind)ix|ex$/i': 'RegExp.$1+"ices"',
    '/(x|ch|ss|sh)$/i': 'RegExp.$1+"es"',
    '/(r|t|c)y$/i': 'RegExp.$1+"ies"',
    '/(hive)$/i': 'RegExp.$1+"s"',
    '/(?:([^f])fe|([lr])f)$/i': 'RegExp.$1+RegExp.$2+"ves"',
    '/(.*)sis$/i': 'RegExp.$1+"ses"',
    '/([ti])um$/i': 'RegExp.$1+"a"',
    '/(buffal|tomat)o$/i': 'RegExp.$1+"oes"',
    '/(bu)s$/i': 'RegExp.$1+"ses"',
    '/(alias)/i': 'RegExp.$1+"es"',
    '/(octop|vir)us$/i': 'RegExp.$1+"i"',
    '/(.*)s$/i': 'RegExp.$1+"s"',
    '/(.*)/i': 'RegExp.$1+"s"',
  },
  singularRules: {
    '/(s)tatuses$/i': 'RegExp.$1+"tatus"',
    '/^(ox)en$/i': 'RegExp.$1',
    '/([m|l])ice$/i': 'RegExp.$1+"ouse"',
    '/(matr)ices$/i': 'RegExp.$1+"ix"',
    '/(vert|ind)ices$/i': 'RegExp.$1+"ex"',
    '/(cris|ax|test)es$/i': 'RegExp.$1+"is"',
    '/(x|ch|ss|sh)es$/i': 'RegExp.$1',
    '/(r|t|c)ies$/i': 'RegExp.$1+"y"',
    '/(movie)s$/i': 'RegExp.$1',
    '/(hive)s$/i': 'RegExp.$1',
    '/([^f])ves$/i': 'RegExp.$1+"fe"',
    '/([lr])ves$/i': 'RegExp.$1+"f"',
    '/(analy|ba|diagno|parenthe|synop|the)ses$/i': 'RegExp.$1+"sis"',
    '/([ti])a$/i': 'RegExp.$1+"um"',
    '/(buffal|tomat)oes$/i': 'RegExp.$1+"o"',
    '/(bu)ses$/i': 'RegExp.$1+"s"',
    '/(alias)es/i': 'RegExp.$1',
    '/(octop|vir)i$/i': 'RegExp.$1+"us"',
    '/(.*)s$/i': 'RegExp.$1',
    '/(.*)/i': 'RegExp.$1',
  },
  uninflected: [
    'deer',
    'fish',
    'measles',
    'ois',
    'pox',
    'rice',
    'sheep',
    'Amoyese',
    'bison',
    'bream',
    'buffalo',
    'cantus',
    'carp',
    'cod',
    'coitus',
    'corps',
    'diabetes',
    'elk',
    'equipment',
    'flounder',
    'gallows',
    'Genevese',
    'Gilbertese',
    'graffiti',
    'headquarters',
    'herpes',
    'information',
    'innings',
    'Lucchese',
    'mackerel',
    'mews',
    'moose',
    'mumps',
    'news',
    'nexus',
    'Niasese',
    'Pekingese',
    'Portuguese',
    'proceedings',
    'rabies',
    'salmon',
    'scissors',
    'series',
    'shears',
    'siemens',
    'species',
    'testes',
    'trousers',
    'trout',
    'tuna',
    'whiting',
    'wildebeest',
    'Yengeese',
  ],
  pluralIrregular: {
    atlas: 'atlases',
    child: 'children',
    corpus: 'corpuses',
    ganglion: 'ganglions',
    genus: 'genera',
    graffito: 'graffiti',
    leaf: 'leaves',
    man: 'men',
    money: 'monies',
    mythos: 'mythoi',
    numen: 'numina',
    opus: 'opuses',
    penis: 'penises',
    person: 'people',
    sex: 'sexes',
    soliloquy: 'soliloquies',
    testis: 'testes',
    woman: 'women',
    move: 'moves',
  },
  singularIrregular: {
    atlases: 'atlas',
    children: 'child',
    corpuses: 'corpus',
    ganglions: 'ganglion',
    genera: 'genus',
    graffiti: 'graffito',
    leaves: 'leaf',
    men: 'man',
    monies: 'money',
    mythoi: 'mythos',
    numina: 'numen',
    opuses: 'opus',
    penises: 'penises',
    people: 'person',
    sexes: 'sex',
    soliloquies: 'soliloquy',
    testes: 'testis',
    women: 'woman',
    moves: 'move',
  },
}

export const pluralize = (word: string) => {
  for (const i in rules.uninflected) {
    if (word.toLowerCase() === rules.uninflected[i]) {
      return word
    }
  }
  for (const i in rules.pluralIrregular) {
    if (word.toLowerCase() === i) {
      return (word = rules.pluralIrregular[i])
    }
  }
  for (const i in rules.pluralRules) {
    const rObj = eval('new RegExp(' + i + ');')
    if (word.match(rObj)) {
      word = word.replace(rObj, eval(rules.pluralRules[i]))
      return word
    }
  }
  return word
}

export const singularize = (word: string) => {
  for (const i in rules.uninflected) {
    if (word.toLowerCase() === rules.uninflected[i]) {
      return word
    }
  }
  for (const i in rules.singularIrregular) {
    if (word.toLowerCase() === i) {
      return (word = rules.singularIrregular[i])
    }
  }
  for (const i in rules.singularRules) {
    const rObj = eval('new RegExp(' + i + ');')
    if (word.match(rObj)) {
      word = word.replace(rObj, eval(rules.singularRules[i]))
      return word
    }
  }
  return word
}

export const underscore = (word: string) => {
  return word.replace(
    /[A-Z]/g,
    (match, offset) => (offset > 0 ? '_' : '') + match.toLowerCase()
  )
}

export const camelize = (word: string) => {
  if (word.length === 0) return word
  word = word.replace(/_[a-z]/g, (match) => match.slice(-1).toUpperCase())
  return word[0].toUpperCase() + word.slice(1)
}
