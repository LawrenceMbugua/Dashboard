
// API

// Initial access






//Set expenses/revenues for the very first time





let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September","October", "November", "December"]

let setExpensesAndRevenuesForTheFirstTime = () => {

  
  
  
  months.forEach( m => {
    
    
    let monthData = {
   
    expenses: {
      "electricity": Math.floor(Math.random()*50000),
      "advertisement": Math.floor(Math.random()*50000),
      "salaries": Math.floor(Math.random()*100000)
      
    },
    revenues: {
      "Product A": Math.floor(Math.random()*100000),
      "Product B": Math.floor(Math.random()*100000),
      "Product C": Math.floor(Math.random()*100000),
    }

  }
    
    
    
    
    monthData['month'] = m
    //console.log(monthData);
    
    localStorage.setItem(`${m}`, JSON.stringify(monthData))

  })
  
localStorage.setItem("mode", "expenses")
localStorage.setItem("month", "January")
}

//localStorage.setItem("mode", "expenses")
//localStorage.setItem("month", "January")

// Check if this is a new user/browser
let itemsAreSet = localStorage.getItem("itemsAreSet")
if (!itemsAreSet) {
  localStorage.setItem("itemsAreSet", "itemsAreSet")
  setExpensesAndRevenuesForTheFirstTime()
} else {
  console.log("items are already set!");
}









// Create an api using locally stored variables 

let api2  = () => {
  
  let arr = []
  
  months.forEach( month => {

   let storedData = JSON.parse( JSON.stringify(localStorage.getItem(month))  ) 
   
   storedData = JSON.parse(storedData)

   //console.log(storedData["expenses"]);

   let d = {}
  
   let expenses = storedData["expenses"]
  
   let revenues = storedData["revenues"]
    
   d['month'] = month
   d['expenses'] = expenses
   d['revenues'] = revenues
  
   arr.push(d)
 
 })
 
return arr

}



let api = api2()

//console.log(api);

//VARIABLES 

//modes
let mode = localStorage.getItem("mode")
let month = localStorage.getItem("month")
let data
let total = 0

//ELEMENTS
let container = document.getElementById('container')
let main = document.getElementsByClassName('main')[0]
let totalDisplay = document.getElementById("totalDisplay")
let footer = document.getElementsByClassName("footer")[0]
let monthFormInput = document.getElementById("monthFormInput")
let formTitle = document.getElementById('formTitle')




//toggles between expenses and revenues

let changeMode = () => {
  let newMode = document.getElementById('mode').value
  //newMode = 'revenues'
  if (newMode == mode) {
    return
  }
  console.log(newMode);
  localStorage.setItem("mode", newMode)
  mode = localStorage.getItem("mode")
  //destroy container and create a new one
  let div = document.createElement('div')
  div.classList.add('container')
  div.setAttribute('id', 'container')
  
  
  main.removeChild(container)
  container = div
  updateDisplay(mode, month)
  createForm()
}


// changes the month based on user preference 
let changeMonth = () => {
  
  let newMonth = document.getElementById('month').value
  //newMode = 'revenues'
  if (newMonth == month) {
    return
  }
  console.log(newMonth);
  localStorage.setItem("month", newMonth)
  month = localStorage.getItem("month")
  
  //destroy container and create a new one
  let div = document.createElement('div')
  div.classList.add('container')
  div.setAttribute('id', 'container')
  
  
  main.removeChild(container)
  container = div
  createForm()
  updateDisplay(mode, month)
  
  
}

// functions to update UI conditionally

// Expenses or revenues based on selection mode
let updateDisplay = (mode, month) => {
  
    let monthVal = document.getElementById("month")
    let modeVal = document.getElementById("mode")
    
    monthVal.value = month
    modeVal.value = mode
    
    getData(month, mode)
    total = 0
    
    for (d in data) {
      total += data[d]
    }
    
    //console.log('total: ',total);
    // loop through the expenses/revenues in the given month
    for (d in data) {
      let k = d
      let v = data[d]
      createDonut(k, v)
      
    }
    totalDisplay.textContent = total.toLocaleString()
    animate()
  
}

//create donut
let createDonut = (k, v) => {
  
 let categoryText = k.toString()
 let figureText = v
 
 //console.log(categoryText, figureText)
  
  let donut = document.createElement('div')
  let content = document.createElement('div')
  let percent = document.createElement('p')
  let category = document.createElement('p')
  let figure = document.createElement('p')
  
  // append classes
  
  donut.classList.add('donut')
  content.classList.add('content')
  percent.classList.add('percent')
  category.classList.add('category')
  figure.classList.add('figure')
  
  // append child nodes
  
  category.innerText =  categoryText
  figure.innerText = figureText
  percent.innerText = 0
  
  content.appendChild(percent)
  content.appendChild(category)
  content.appendChild(figure)
  donut.appendChild(content)
  
  container.appendChild(donut)
  main.appendChild(container)
  
  //animation
  
}



// animate donuts
let figure = document.getElementsByClassName('figure')
let percent = document.getElementsByClassName('percent')
let donut = document.getElementsByClassName('donut')
  

let animate = () => {
  
  for(let i = 0; i < figure.length; i++) {
  //console.log(donut[i]);
  
  
  let currentValue = 0
  let endValue = parseInt(figure[i].innerText)
  let percentage = 0
  
  let interval = 25
  
  let step = Math.floor(endValue/100)
  if (step < 1) {
    step = 1
  }
  
  let updateInterval = setInterval(() => {
  
    let endDegree = (endValue / total) * 360
    let currDegree = (currentValue / endValue) * endDegree
    
    let percentage = Math.round(currentValue/total*100)
  
    if (currentValue >= endValue) {
      currentValue = endValue
      figure[i].textContent = currentValue.toLocaleString()
      percent[i].textContent = percentage 

      let endDegree = (endValue / total) * 360
      
      let currDegree = (currentValue / endValue) * endDegree
      donut[i].style.background = `conic-gradient(#BF7EF7 ${currDegree}deg, #FFFFFF ${currDegree +8 }deg)`
  
      clearInterval(updateInterval)
    }
  
  
    figure[i].textContent = Math.floor(currentValue).toLocaleString()
    percent[i].textContent = percentage 
    donut[i].style.background = `conic-gradient(#BF7EF7 ${currDegree}deg, #FFFFFF ${currDegree +8}deg)`
    
    currentValue += step
  
  }, interval)
  
  
  }
  
}




//get data based on month and mode(expenses/revenues)

let getData = (month, mode) => {
   
   if (month == 'Annual') {
     
     let memo = {}

      api.forEach( d=> {
       
        
        let expenses = d[mode]
        
        for (expense in expenses) {
          if (expense in memo) {
            memo[expense] += expenses[expense] 
            
          } else {
            memo[expense] = expenses[expense]
          }
        }
        
      })
      console.log(memo);
      data = memo
      return
    }
    
  
  
   api.forEach( d => {
    
    
    if (d.month == month) {
      //console.log(d[mode])
      data = d[mode]
      return
    }
  })
}





  
  
  
  



// Create form

let createForm = () => {
  let formContainer = document.getElementById("formContainer")
  let variables = document.querySelectorAll(".variable")
  
  if (variables) {
    
    variables.forEach( variable => {
      formContainer.removeChild(variable)
    })
    
  } else {
    return
  }
  
   let data
   
   api.forEach( d => {
     if (d["month"] == month) {
       data = d[mode]
     }
   })
   
   console.log(data);
    
  for (d in data) {
    let category = d
    let value = data[d]
    
    let input = document.createElement('input')
    let label = document.createElement('label')
    
    input.setAttribute("type", 'number')
    input.value = value
    input.setAttribute("name", category)
    input.setAttribute("id", category)
    input.classList.add("variable")
    input.classList.add("uniques")
    input.setAttribute("required", true)
    input.setAttribute("min", 1)
    input.setAttribute("max", 100000000)
    label.setAttribute("for", category)
    label.classList.add("variable")
    label.textContent = category
    
    formContainer.appendChild(label)
    formContainer.appendChild(input)
  }
  
  
  let submitButton = document.createElement('input')
  submitButton.setAttribute("type", "submit")
  submitButton.setAttribute("value", "Submit")
  submitButton.setAttribute("id", "submitButton" )
  submitButton.classList.add("variable")
  formContainer.appendChild(submitButton)
  monthFormInput.value = (month != "Annual")? month: "January"
  formTitle.textContent = mode
 
}











//UPDATE LOCAL STORAGE BASED ON USER'S INPUT

let submitButton = document.getElementById("submitButton")


if (formContainer) {

  formContainer.addEventListener("submit", (e) => {
    
    e.preventDefault()

    let uniques = document.querySelectorAll(".uniques")
    
    if (!uniques) {
      return
    }
  
    uniques.forEach( unique => {
      
  
     
     let k = unique.id
     let v = parseInt(unique.value)
     
     unique.value = ''
     let data = JSON.parse(localStorage.getItem(monthFormInput.value))
     
     data[mode][k] = v
     
     
     localStorage.setItem(`${month}`, JSON.stringify(data))

     console.log(data[mode]);
   
      
    //  updateDisplay()
    })


  
  
  
 
    month = monthFormInput.value
    localStorage.setItem("month", month)
    
    //updateDisplay()
    window.location.assign("index.html")
  })
} 
  
createForm()
updateDisplay(mode, month)
      
