export const CHO_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export const JUNG_LIST = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 
  'ㅣ'
];

export const JONG_LIST = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

export const DEFAULT_STROKES = {
  // 초성 및 기본 자음
  'ㄱ': 1, 'ㄲ': 2, 'ㄴ': 1, 'ㄷ': 2, 'ㄸ': 4, 'ㄹ': 3, 'ㅁ': 3, 'ㅂ': 4, 'ㅃ': 8, 'ㅅ': 2,
  'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅉ': 6, 'ㅊ': 4, 'ㅋ': 2, 'ㅌ': 3, 'ㅍ': 4, 'ㅎ': 3,
  
  // 중성(모음)
  'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 4, 'ㅓ': 2, 'ㅔ': 3, 'ㅕ': 3, 'ㅖ': 4, 'ㅗ': 2,
  'ㅘ': 4, 'ㅙ': 5, 'ㅚ': 3, 'ㅛ': 3, 'ㅜ': 2, 'ㅝ': 4, 'ㅞ': 5, 'ㅟ': 3, 'ㅠ': 3,
  'ㅡ': 1, 'ㅢ': 2, 'ㅣ': 1,

  // 종성 복합 자음
  'ㄳ': 3, 'ㄵ': 4, 'ㄶ': 4, 'ㄺ': 4, 'ㄻ': 6, 'ㄼ': 7, 'ㄽ': 5, 'ㄾ': 6, 'ㄿ': 7, 'ㅀ': 6, 'ㅄ': 6
};

/**
 * 한 글자를 분해하여 자모 정보와 각 자모의 획수를 반환합니다.
 * @param {string} char 한글 한 글자
 * @param {Object} strokeRules 획수 매핑 테이블
 * @returns {Object|null} { cho, jung, jong, choStroke, jungStroke, jongStroke, total } 또는 한글이 아닐 경우 null
 */
export function decomposeHangulChar(char, strokeRules = DEFAULT_STROKES) {
  const code = char.charCodeAt(0);
  
  // 한글 음절 범위 검사 (가 ~ 힣)
  if (code < 0xAC00 || code > 0xD7A3) {
    return null;
  }
  
  const relativeCode = code - 0xAC00;
  const jongIdx = relativeCode % 28;
  const jungIdx = ((relativeCode - jongIdx) / 28) % 21;
  const choIdx = Math.floor(((relativeCode - jongIdx) / 28) / 21);
  
  const cho = CHO_LIST[choIdx];
  const jung = JUNG_LIST[jungIdx];
  const jong = JONG_LIST[jongIdx]; // 없을 수 있음 ('')
  
  const choStroke = strokeRules[cho] !== undefined ? strokeRules[cho] : 0;
  const jungStroke = strokeRules[jung] !== undefined ? strokeRules[jung] : 0;
  const jongStroke = jong ? (strokeRules[jong] !== undefined ? strokeRules[jong] : 0) : 0;
  
  return {
    char,
    cho,
    jung,
    jong: jong || null,
    choStroke,
    jungStroke,
    jongStroke,
    total: choStroke + jungStroke + jongStroke
  };
}

/**
 * 한글 이름 전체를 분석합니다.
 * @param {string} name 한글 이름
 * @param {Object} strokeRules 획수 매핑 테이블
 * @returns {Array} 분석 결과 배열
 */
export function analyzeName(name, strokeRules = DEFAULT_STROKES) {
  const result = [];
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    const decomposed = decomposeHangulChar(char, strokeRules);
    if (decomposed) {
      result.push(decomposed);
    } else {
      // 한글이 아닌 문자는 그대로 반환하되 획수는 0으로 처리
      result.push({
        char,
        cho: null,
        jung: null,
        jong: null,
        choStroke: 0,
        jungStroke: 0,
        jongStroke: 0,
        total: 0,
        isNonHangul: true
      });
    }
  }
  return result;
}

// 오음(五音) 분류
export const SOUND_GROUPS = {
  // 어금닛소리
  'ㄱ': '어금닛소리', 'ㅋ': '어금닛소리', 'ㄲ': '어금닛소리',
  // 혓소리
  'ㄴ': '혓소리', 'ㄷ': '혓소리', 'ㄹ': '혓소리', 'ㅌ': '혓소리', 'ㄸ': '혓소리',
  // 목구멍소리
  'ㅇ': '목구멍소리', 'ㅎ': '목구멍소리',
  // 잇소리
  'ㅅ': '잇소리', 'ㅈ': '잇소리', 'ㅊ': '잇소리', 'ㅆ': '잇소리', 'ㅉ': '잇소리',
  // 입술소리
  'ㅁ': '입술소리', 'ㅂ': '입술소리', 'ㅍ': '입술소리', 'ㅃ': '입술소리'
};

// 도표 18 데이터 정의
// 구조: SOUND_NUMBER_TABLE[소리그룹][10진법기준값(0~9)] = [홀수일때(앞부분), 짝수일때(뒷부분)]
export const SOUND_NUMBER_TABLE = {
  '어금닛소리': [
    [7, 8], [8, 7], [9, 0], [0, 9], [1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5]
  ],
  '혓소리': [
    [5, 6], [6, 5], [7, 8], [8, 7], [9, 0], [0, 9], [1, 2], [2, 1], [3, 4], [4, 3]
  ],
  '목구멍소리': [
    [3, 4], [4, 3], [5, 6], [6, 5], [7, 8], [8, 7], [9, 0], [0, 9], [1, 2], [2, 1]
  ],
  '잇소리': [
    [1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5], [7, 8], [8, 7], [9, 0], [0, 9]
  ],
  '입술소리': [
    [9, 0], [0, 9], [1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5], [7, 8], [8, 7]
  ]
};

// 띠 구하기
export function getZodiac(birthDate) {
  if (!birthDate) return '';
  const dateObj = new Date(birthDate);
  let year = dateObj.getFullYear();
  if (isNaN(year)) return '';

  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  // 양력 2월 5일 이전 (1월 1일 ~ 2월 4일)인 경우 전년도 적용
  if (month < 2 || (month === 2 && day < 5)) {
    year = year - 1;
  }

  // 서기 4년이 갑자년(쥐띠)이므로
  const index = (year - 4) % 12;
  const positiveIndex = index < 0 ? index + 12 : index;
  const zodiacs = ['쥐', '소', '범', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  return zodiacs[positiveIndex];
}

// 띠를 10진법 기준으로 변환하기 (표 참고)
export function getZodiacValue(zodiac) {
  const mapping = {
    '원숭이': 0, '진나비': 0,
    '닭': 1,
    '돼지': 2,
    '쥐': 3,
    '범': 4, '호랑이': 4,
    '토끼': 5,
    '뱀': 6,
    '말': 7,
    '용': 8, '개': 8,
    '소': 9, '양': 9
  };
  return mapping[zodiac] !== undefined ? mapping[zodiac] : 0;
}

// 자모의 소리 그룹 반환
export function getSoundGroup(jamo) {
  if (!jamo) return null;
  const char = jamo[0]; // 복합 자음도 첫 번째 자음을 기준으로
  return SOUND_GROUPS[char] || null;
}

// 주기능, 부기능 및 핵심 소리수 분석 함수
export function calculateSoundNumbers(name, birthDate) {
  if (!name || !birthDate) return null;
  
  const dateObj = new Date(birthDate);
  const year = dateObj.getFullYear();
  if (isNaN(year)) return null;

  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  // 양력 2월 5일 기준 이전 생일이면 전년도 연도로 보정
  let targetYear = year;
  if (month < 2 || (month === 2 && day < 5)) {
    targetYear = year - 1;
  }

  const mainBase = targetYear % 10; // 보정된 연도 끝자리
  const zodiac = getZodiac(birthDate); // getZodiac 내부에서도 보정이 일어남
  const subBase = getZodiacValue(zodiac); // 띠에 따른 10진법 값
  
  // 이름 분해 정보 획득
  const charDetails = analyzeName(name);
  
  const detailsWithSounds = charDetails.map((charData) => {
    if (charData.isNonHangul) {
      return {
        ...charData,
        isEven: false,
        choGroup: null,
        jongGroup: null,
        mainSound: '',
        subSound: ''
      };
    }
    
    // 이 글자의 총 획수 짝홀수 판단 (초+중+종성의 자음+모음 총 획수 합산 값)
    const totalStroke = charData.total;
    const isEven = totalStroke % 2 === 0;
    
    // 초성 소리수 계산
    const choGroup = getSoundGroup(charData.cho);
    let mainChoVal = 'X';
    let subChoVal = 'X';
    if (choGroup) {
      mainChoVal = SOUND_NUMBER_TABLE[choGroup][mainBase][isEven ? 1 : 0].toString();
      subChoVal = SOUND_NUMBER_TABLE[choGroup][subBase][isEven ? 1 : 0].toString();
    }
    
    // 종성 소리수 계산
    const jongGroup = charData.jong ? getSoundGroup(charData.jong) : null;
    let mainJongVal = 'X';
    let subJongVal = 'X';
    if (jongGroup) {
      mainJongVal = SOUND_NUMBER_TABLE[jongGroup][mainBase][isEven ? 1 : 0].toString();
      subJongVal = SOUND_NUMBER_TABLE[jongGroup][subBase][isEven ? 1 : 0].toString();
    }
    
    // 최종 포맷팅 (받침이 없으면 X/x 로 표시)
    const mainSound = mainChoVal + (jongGroup ? mainJongVal : 'x');
    const subSound = subChoVal + (jongGroup ? subJongVal : 'x');
    
    return {
      ...charData,
      isEven,
      choGroup,
      jongGroup,
      mainSound,
      subSound
    };
  });
  
  // 핵심 소리수 추출
  // 규칙: 성음에 해당하는 첫 글자(index 0) 다음에 오는 주기능의 첫글자(index 1)를 기준으로 십의 자리 수
  let coreSoundNumber = null;
  if (detailsWithSounds.length > 1 && !detailsWithSounds[1].isNonHangul) {
    const mainSoundStr = detailsWithSounds[1].mainSound;
    if (mainSoundStr && mainSoundStr[0] !== 'X') {
      coreSoundNumber = parseInt(mainSoundStr[0], 10);
    }
  }
  
  return {
    year,
    targetYear, // 보정된 사주 연도
    zodiac,
    mainBase,
    subBase,
    details: detailsWithSounds,
    coreSoundNumber
  };
}
