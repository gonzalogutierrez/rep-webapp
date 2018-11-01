// Developed by Houlak
export const PAGE_SIZE = 999999;

import * as jsSHA from 'jssha';

export function parseDate(dateString: string) {
  let date = new Date(dateString);
  let hours = date.getHours().toString();
  if (hours.length == 1) {
    hours = '0' + hours;
  }
  let minutes = date.getMinutes().toString();
  if (minutes.length == 1) {
    minutes = '0' + minutes;
  }
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  if (month.length == 1) {
      month = '0' + month;
  }
  if (day.length == 1) {
      day = '0' + day;
  }
  let year = date.getFullYear();

  return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

export function hashPwd(pwd: string) {
  let shaObj = new jsSHA('SHA-256', 'TEXT');
  shaObj.update(pwd);
  return shaObj.getHash('HEX').toLowerCase();
}
