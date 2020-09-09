// define variables 
let mainTable = document.getElementById("table-cont")
let checkboxBtn = document.querySelectorAll('.checkbox');
let getHidden, hiddenElements, value =[]
// reset the data from table 
const reset = () => {
    let reset = document.querySelector('.reset-btn');
    reset.classList.add('active')
    reset.addEventListener('click',(e) => {
    e.preventDefault()
    localStorage.clear();
    location.reload()
    })
}
// hidden column names if clicked
const checkHidden = () => {
   hiddenElements = document.querySelectorAll('.hidden')
   getHidden = JSON.parse(localStorage.getItem('hidden')) 
   if(getHidden != null) {
       reset()
       for(i = 0; i < getHidden.length; i++) {
           value.push(getHidden[i])
      for(j = 0; j < checkboxBtn.length; j++) {
          if(checkboxBtn[j].dataset.table === getHidden[i]) checkboxBtn[j].parentNode.classList.add('hidden')
        } 
    } 
   }
   else return false       
}
// render table data 
const render = (data) => {
    const {id, name, year, color, pantone_value} = data[i];
    return mainTable.innerHTML +=
    `<div class="main-table__row">
    ${id ? `<div class="main-table__id">${id}</div>` : ''}
    ${name ? `<div class="main-table__name"><span>${name}</span></div>` : ''}
    ${year ? `<div class="main-table__year">${year}</div>` : ''}
    ${color ? `<div class="main-table__color"><span class="color-demo" style="background:${color}"></span>${color}</div>` : ''}
    ${pantone_value ? `<div class="main-table__value">${pantone_value}</div>` : ''}
    </div>` 
}

// rerender data after click on column 
checkboxBtn.forEach(elem => {
    elem.addEventListener('click',(e) =>{
    e.preventDefault();
    const target = e.currentTarget.dataset.table
    const storage = JSON.parse(localStorage.getItem('table'))
    const data = storage.filter(item => { 
    delete item[target];
    return item});
    elem.parentNode.classList.add('hidden')
    value.push(target)
    localStorage.setItem('hidden', JSON.stringify(value)) 
    reset()
    localStorage.setItem('table', JSON.stringify(data))
    mainTable.innerHTML =''
    for(i = 0; i < data.length; i++) {
        render(data)
    }
    });
})
// load data from xml 
const loadDoc = () => {
    const storage = JSON.parse(localStorage.getItem('table'))
    if(storage) {
        const data = storage
        for(i = 0; i < data.length; i++) {
            render(data)
        }
    }
    else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            for(i = 0; i < data.data.length; i++) {
                render(data.data)
            }
            localStorage.setItem('table',  JSON.stringify(data.data))
          }
          
        };
        xhttp.open("GET", "https://reqres.in/api/unknown?per_page=12", true);
        xhttp.send();
    }
}
// load base function 
window.onload = loadDoc();
window.onload = checkHidden();
