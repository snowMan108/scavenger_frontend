export function commafy(num) {
  var str = num.toString().split('.')
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ')
  }
  return str.join('.')
}

//level 0:    < 30 
//level 1: 30 < 90
//level 2: 90 < 180
//level 3: 180 < 365
//level 4: 365 <

/*export function getLevel(duration) {
  const days = duration / 86400;
  //if (duration === 0) return 0;
  if (days < 30) return 0;
  if (30 < days < 90) return 1;
  if (90 < days < 180) return 2;
  if (180< days < 365) return 3;
  if (days > 365) return 4;
  return days;
}

export function getDurationOfLevel(level) {
  if (level === 1) return 30;
  if (level === 2) return 90;
  if (level === 3) return 180;
  if (level === 4) return 360;
}*/

export function getLevel(duration) {
  const days = duration / 86400;
  if (duration === 0) return 0;
  if (days < 90) return 1;
  if (days < 180) return 2;
  if (days < 365) return 3;
  if (days > 365) return 4;
  return days;
}
/*
export function getDurationOfLevel(level) {
  if (level === 1) return 30;
  if (level === 2) return 90;
  if (level === 3) return 180;
  if (level === 4) return 365;
}
*/
export function getDurationOfLevel(level) {
  if (level === 1) return 30;
  if (level === 2) return 90;
  if (level === 3) return 180;
  if (level === 4) return 365;
}