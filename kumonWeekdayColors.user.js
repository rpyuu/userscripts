// ==UserScript==
// @name เพิ่มสีระบุวัน
// @namespace Script Runner Pro
// @match https://class-navi.digital.kumon.com/th/index.html
// @grant none
// ==/UserScript==

(() => {
  //แสดงวัน ในหน้า Study Record/Set
  const WDCOLORS = ['red', 'gold', 'hotpink', '#41c3b1', '#ff6d00', '#00bfff', '#662d91']
  const WDFG = ['white', 'black', 'white', 'black', 'white', 'black', 'white']
  const WDDAY = ["'อา'", "'จ'", "'อ'", "'พ'", "'พฤ'", "'ศ'", "'ส'"]

  const sty = document.createElement('style')
  sty.textContent = '.score-date.weekday:before { content: var(--wd-day); background-color: var(--wd-col); margin-right: 0.1rem; color: var(--wd-fg); width: 0.8rem; height: 0.8rem; aspect-ratio: 1/1; display: inline-flex !important; align-items: center; justify-content: center; font-weight: 400; font-size: 0.6rem; border:1px solid black; }\n';
  document.head.appendChild(sty);

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
      D.classList.add('weekday')
      D.style.setProperty('--wd-day', WDDAY[wd])
      D.style.setProperty('--wd-col', WDCOLORS[wd])
      D.style.setProperty('--wd-fg', WDFG[wd])
      // D.style.backgroundColor = WDCOLORS[wd];
      //D.querySelector('.score-date-day').style.backgroundColor = WDCOLORS[wd];
      // D.querySelector('.score-date-day').style.color = 'black';
    })
  });

  // Start observing the target node for configured mutations
  observer.observe(document.querySelector('app-root'), { childList: true, subtree: true });

  // Later, you can stop observing
  // observer.disconnect();
})();
