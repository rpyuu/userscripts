// ==UserScript==
// @name เพิ่มสีระบุวัน
// @namespace Script Runner Pro
// @match https://class-navi.digital.kumon.com/th/index.html
// @grant none
// ==/UserScript==

(() => {
  //แสดงวัน ในหน้า Study Record/Set
  const WDCOLORS = ['rgb(255 0 0 / 50%)', 'yellow', 'rgb(255 20 147 / 50%)', 'greenyellow', 'orange', '#00bfff', 'rgb(135 30 135 / 50%)']
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationList, observer) => {
    if(document.querySelector('.page-title')?.textContent != 'Set') return;
    let y = (new Date()).getFullYear()
    let m = ''
    document.querySelectorAll('.score-date:has(.score-date-day)').forEach((D) => {
      if(D.querySelector('.score-date-month')) m = D.querySelector('.score-date-month').textContent
      const ds = D.querySelector('.score-date-day').textContent + ' ' + m + ' ' + y + ' 11:11:11';
      const dd = new Date(ds);
      const wd = dd.getDay();
      D.style.backgroundColor = WDCOLORS[wd];
      //D.querySelector('.score-date-day').style.backgroundColor = WDCOLORS[wd];
      D.querySelector('.score-date-day').style.color = 'black';
    })
  });

  // Start observing the target node for configured mutations
  observer.observe(document.querySelector('app-root'), { childList: true, subtree: true });

  // Later, you can stop observing
  // observer.disconnect();
})();
