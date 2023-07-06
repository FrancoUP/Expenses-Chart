const columns = document.querySelectorAll(".column");
const columnPrice = document.querySelectorAll(".column-price");


const fetchData = async function () {

  try {

    const resData = await fetch("data.json");

    if(!resData.ok) throw new Error("Problem to get data");

    const data = await resData.json();

    return data;

  } catch (err) {

    console.log(err);
  }
}



const getMaxDailyAmount = function(data) {
  
  const max = data.reduce( (acc,mov) => {

  if(acc > mov.amount) return acc;
  else return mov.amount;

  },data[0].amount);

  return max;
}



const setColumnHeight = function(max, num, index) {

  let height = (num * 100) / max;
  columns[index].style.height = `calc(${height}% - 15%)`;

}



const setColumns = (async function() {

  const data = await fetchData();
  const max = getMaxDailyAmount(data);

  data.forEach( (el,i) => {

     setColumnHeight(max, el.amount, i);
     columnPrice[i].innerHTML = `$${el.amount}`;
     if(el.amount === max) columns[i].style.backgroundColor = "var(--cyan, #76B5BC)";

  });

})();



setToday = (function() {
    
  const today = new Date();
  [...columns].at(today.getDay() - 1).style.backgroundColor = "yellow";

})();




const switchOnColumn = function(el_1, el_2) {

    el_1.style.opacity = "0.7";
    el_2.style.opacity = "1";
}


const switchOffColumn = function(el_1, el_2) {

    el_1.style.opacity = "1";
    el_2.style.opacity = "0";
}


const switchOffColumnOnTouch = function() {

    for(let i = 0; i < columns.length; i++){
    columns[i].style.opacity = "1";
    columnPrice[i].style.opacity = "0";
    }

}

const getTargetElement = function(e) {

  const touchCurrentX = e.touches[0].clientX;
  const touchCurrentY = e.touches[0].clientY;

  return document.elementFromPoint(touchCurrentX, touchCurrentY);
}


////////////////////////////////////////////////////////////////////////



columns.forEach( (el, i) => {

  el.addEventListener("mouseover", function(e) {
     e.preventDefault();

     switchOnColumn(el, columnPrice[i]);
  })

  el.addEventListener("mouseout", function(e) {
    e.preventDefault();

    switchOffColumn(el, columnPrice[i]);
 })

})




document.addEventListener("touchstart", function(e) {
  e.preventDefault();

  const targetElement = getTargetElement(e);

  if([...columns].includes(targetElement)) switchOnColumn(targetElement, targetElement.previousElementSibling);

}, {passive: false})



document.addEventListener("touchmove", function(e) {
  e.preventDefault();

  const targetElement = getTargetElement(e);

  if([...columns].includes(targetElement)) switchOnColumn(targetElement, targetElement.previousElementSibling);
  else switchOffColumnOnTouch();

}, {passive: false})



document.addEventListener("touchend", function(e) {
    e.preventDefault();

    switchOffColumnOnTouch();

}, {passive: false})


