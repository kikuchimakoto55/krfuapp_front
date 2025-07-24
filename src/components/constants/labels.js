export const roundOptions = {
    9: 'Aリーグ',
    10: 'Bリーグ',
    11: 'Cリーグ',
    12: 'Dリーグ',
    44: 'Eリーグ',
    45: 'Fリーグ',
    46: 'Gリーグ',
    47: 'Hリーグ',
    48: 'Iリーグ',
    49: 'Jリーグ',
    50: 'Kリーグ',
    51: 'Lリーグ',
    52: 'Mリーグ',
    53: 'Nリーグ',
    54: 'Oリーグ',
    55: 'Pリーグ',
    56: 'Qリーグ',
    57: 'Rリーグ',
    58: 'Sリーグ',
    59: 'Tリーグ',
    60: 'Uリーグ',
    61: 'Vリーグ',
    62: 'Wリーグ',
    63: 'Xリーグ',
    64: 'Yリーグ',
    65: 'Zリーグ',
    1: '1回戦',
    2: '2回戦',
    3: '3回戦',
    4: '4回戦',
    5: '5回戦',
    13: '6回戦',
    14: '7回戦',
    15: '8回戦',
    16: '9回戦',
    17: '10回戦',
    18: '11回戦',
    19: '12回戦',
    20: '13回戦',
    21: '14回戦',
    22: '15回戦',
    23: '16回戦',
    24: '17回戦',
    25: '18回戦',
    26: '19回戦',
    27: '20回戦',
    28: '21回戦',
    29: '22回戦',
    30: '23回戦',
    31: '24回戦',
    32: '25回戦',
    33: '26回戦',
    34: '27回戦',
    35: '28回戦',
    36: '29回戦',
    37: '30回戦',
    38: '準々決勝',
    6: '準決勝',
    7: '決勝',
    8: '3位決定戦',
    39: '4位決定戦',
    40: '5位決定戦',
    41: '6位決定戦',
    42: '7位決定戦',
    43: '8位決定戦',
};

export const getRoundLabel = (roundValue) => {
  return roundOptions[Number(roundValue)] || roundValue || '-';
};

export const categoryOptions = {
  1: '有料試合',
  2: '社会人',
  3: 'クラブ',
  4: '大学',
  5: '高校',
  6: '中学',
  7: 'ラグビースクール',
  8: 'タグラグビー',
  9: '女子'
};

export const categoryLabel = (value) => {
  return categoryOptions[Number(value)] || 'その他';
};


export const eventKindsOptions = {
  1: '公式戦',
  2: '練習試合',
  3: '合宿',
  4: '遠征',
  5: 'その他イベント',
};

export const getEventKindLabel = (value) => {
  return eventKindsOptions[Number(value)] || '-';
};


export const gradeCategoryOptions = {
  1: '年年少', 2: '年少', 3: '年中', 4: '年長', 5: '小1',
  6: '小2', 7: '小3', 8: '小4', 9: '小5', 10: '小6',
  11: '中1', 12: '中2', 13: '中3', 14: '高1', 15: '高2',
  16: '高3', 17: '大1', 18: '大2', 19: '大3', 20: '大4',
  21: '社会人', 22: '卒業'
};

export const getGradeCategoryLabel = (value) => {
  return gradeCategoryOptions[Number(value)] || '-';
};

export const sexOptions = {
  1: '男',
  2: '女',
};

export const getSexLabel = (value) => {
  return sexOptions[Number(value)] || '-';
};