// ==UserScript==
// @name KC ให้การบ้าน
// @namespace Script Runner Pro
// @match https://class-navi.digital.kumon.com/th/index.html
// @grant none
// ==/UserScript==
(() => {
  // ปุ่มเลือกนักเรียนที่ต้องให้การบ้าน
  const sty = document.createElement('style')
  sty.textContent = '.btnSelect0RemainCountStudent {position:fixed;left:-32px;top:190px;width:44px;height:32px;font-size:1rem;font-weight:700;color:white;background-color:#b2b2b2;border-radius:0 5rem 5rem 0;display:none;cursor:pointer;align-items:center;justify-content:center;z-index:9999;transition: 0.25s ease-in-out; box-shadow:0 0 3px silver; }\n';
  sty.textContent += '.btnSelect0RemainCountStudent:hover { left:0; background-color:#a2a2a2; box-shadow:0 0 3px black; }'
  sty.textContent += 'body:has(.setList.tabItem.tabActive) .btnSelect0RemainCountStudent {display: flex;}\n';
  document.head.appendChild(sty);
  const appBtn = document.createElement('div');
  appBtn.innerHTML = '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg>';
  appBtn.title = "เลือกเด็กที่ต้องให้การบ้าน";
  appBtn.classList.add('btnSelect0RemainCountStudent');
  appBtn.addEventListener('click', (e) => {
    const students = Array.from(document.querySelectorAll('.studentRow'));
    if(!students.length) return false;
    students
      .filter((n) => (
        n.querySelector('.studentID') &&
        !n.querySelector('.studentID')?.textContent.includes('DM') &&
        Array.from(n.querySelectorAll('.setRemainCount')).filter((m) => m?.textContent=='0').length
      )).forEach( (o) => {o.querySelector('.checkbox').dispatchEvent(new MouseEvent('click'))} )
  })
  document.body.appendChild(appBtn);

})();

