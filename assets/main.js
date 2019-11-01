var region_option = document.querySelector(".regions")
var location_option = document.querySelector(".locations")
var explore_btn = document.querySelector(".explore")
var explore_container = document.querySelector(".container-explore")
var container_capture = document.querySelector(".capture-details")
var captured_total = document.querySelector(".capturedTotal")
var spanthis = document.querySelector('.spanthis')
var backpack = document.querySelector('.backpack_toggle')

const requestR = 'https://pokeapi.co/api/v2/region'
const requestsR = []
let requestsL = [],requestsA = [],exp_p = [],pokemon_name,pokeImg =[],reg_value = [],loc_value = [],exp_poke = [],catched_pokemon =[],img_catch_pokemon =[]

fetch(requestR)
    .then(blob => blob.json())
    .then(data => {
        requestsR.push(...data.results)
        document.querySelector('#regions').innerHTML = requestsR
            .map((x,i)=>{return `<option value="${requestsR[i].name}" class="region_opt">${requestsR[i].name}</option>`;})
        document.querySelector('#regions').dispatchEvent(new Event('change'))
    })

region_option.addEventListener('change', function(e){
    reg_value = document.querySelector('#regions').value
    const requestL = `https://pokeapi.co/api/v2/region/${reg_value}`

    fetch(requestL)
        .then(blob => blob.json())
        .then(data =>{
            requestsL = data.locations
            document.querySelector('#locations').innerHTML = requestsL
                .map((x,i)=>{return `<option value="${requestsL[i].name}" class="location_opt">${requestsL[i].name}</option>`;})
            document.querySelector('#locations').dispatchEvent(new Event('change'))
        });
})
location_option.addEventListener('change', function(e){
    loc_value = document.querySelector('#locations').value
    const requestA = `https://pokeapi.co/api/v2/location/${loc_value}`

    fetch(requestA)
        .then(blob => blob.json())
        .then(data => {
            requestsA = data.areas
            document.querySelector('#areas').innerHTML = requestsA
                .map((x,i)=>{return `<option value="${requestsA[i].name}" class="area_opt">${requestsA[i].name}</option>`;});
            // requestsA.map((x,i) => spanthis.innerText = `${renderword(requestsA[i].name)} !`);
            document.querySelector('#areas').dispatchEvent(new Event('change'))
            // spanthis.innerText = requestsA
            //     .map((x,i) => renderword(requestsA[i].name))
            // // spanthis.innerHTML = `${renderword(document.querySelector('#areas').value)}`
        });
});
explore_btn.addEventListener('click', function(){
    exp_poke = document.querySelector('#areas').value
    const exploreP =  `https://pokeapi.co/api/v2/location-area/${exp_poke}`
    
    if(exp_poke !== ""){
        fetch(exploreP)
        .then(blob => blob.json())
        .then(data => {
            exp_p = data.pokemon_encounters
            pokemon_name = exp_p[Math.floor(Math.random()*(0+exp_p.length))].pokemon.name
            encounter(pokemon_name)
        })
    }else{
        alert("Location has no Area to go")
    }
});
function encounter(pokemon_name){
    const pokemonImg = `https://pokeapi.co/api/v2/pokemon/${pokemon_name}`

    fetch(pokemonImg)
        .then(blob => blob.json())
        .then(data =>{
            pokeImg = data.sprites.front_default
            return explore_container.innerHTML = `
            <div class="hide-when">
                <div class="poke-img">
                    <img src="${pokeImg}" width="300"><br/>
                    <button class="catch">Capture ${pokemon_name}</button>
                </div>
                <div class="poke-details center">
                    <h1 class="to-upper">${pokemon_name}</h1>
                    Speed: ${data.stats[0].base_stat}<br/>
                    Special Defense: ${data.stats[1].base_stat}<br/>
                    Special Attack: ${data.stats[2].base_stat}<br/>
                    Defense: ${data.stats[3].base_stat}<br/>
                    Attack: ${data.stats[4].base_stat}<br/>
                    HP: ${data.stats[5].base_stat}
                </div>
            <div>`
        })
    
}
explore_container.addEventListener('click', function(e) {
    if (catched_pokemon.length !== 6) {
        document.querySelector('.hide-when').style.display = "none";
        var pokegif = document.createElement("img");
        pokegif.setAttribute("src", "/assets/imgs/pokeball.gif")
        pokegif.style.width = "150px";
        explore_container.append(pokegif);
        
        setTimeout(function count(){
            if (e.target.matches('.catch')) {
                catches(pokeImg, pokemon_name);
                explore_container.innerText = `You captured ${pokemon_name}, find more pokemon!`;
                backpack.setAttribute("title", `${catched_pokemon.length} Pokemon in the Backpack`)
            }
        }, 5000)
    }else{
        return alert('Backpack Full! :(')   
    }
});
if(catched_pokemon.length === 0){
    backpack.setAttribute("title", `Empty Backpack`)
}
function catches(pI, pN){
    catched_pokemon.push(pN)
    var capturediv = document.createElement("div");
    var captureimg = document.createElement("img");
    var captureh1 = document.createElement("h1");
    var capturetotal = document.createElement("h3");

    captureimg.setAttribute("src", pI);
    captureh1.innerHTML = pN;
    
    capturediv.append(captureimg)
    capturediv.append(captureh1)

    container_capture.append(capturetotal)
    container_capture.append(capturediv)
    container_capture.style.display = "none"

    captured_total.innerText = `Captured ${catched_pokemon.length} / 6`;
    
}
// Just a useless function here :)
function renderword(arr){
    var result = []
    for(i in arr){
        if(arr[i] === "-"){
        arr = arr.replace(arr[i], " ")
        result.push(arr[i])
        }else{
        result.push(arr[i])
        }
    }
    return result.join('');
}
var toggle = function(e){
    if(container_capture.style.display === "none" && captured_total.style.display == "none"){
        container_capture.style.display = "block"
        captured_total.style.display = "block"
        return;
    }
    container_capture.style.display = "none"
    captured_total.style.display = "none"
}
backpack.addEventListener('click', function(){
    var content = document.querySelector('.container-capture')
    toggle(content);
}, false);