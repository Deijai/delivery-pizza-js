const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let qt = 1;
let cart = [];
let modalKey = 0;

//Listar as pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  c(".pizza-area").append(pizzaItem);

  pizzaItem.setAttribute("data-key", index);

  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;

    //preencher modal

    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaBig img").src = pizzaJson[key].img;

    c(".pizzaInfo--size.selected").classList.remove("selected");

    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }

      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";

    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 500);

    console.log("QT== ", qt);
  });
});

//adicicionar qt
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  c(".pizzaInfo--qt").innerHTML = qt = qt + 1;
});

//remover qt
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (qt > 1) {
    c(".pizzaInfo--qt").innerHTML = qt = qt - 1;
  }
});

//fechar modal
c(".pizzaInfo--cancelButton").addEventListener("click", () => {
  c(".pizzaInfo--qt").innerHTML = 1;
  qt = 1;
  c(".pizzaWindowArea").style.display = "none";
});

c(".pizzaInfo--cancelMobileButton").addEventListener("click", () => {
  c(".pizzaInfo--qt").innerHTML = 1;
  qt = 1;
  c(".pizzaWindowArea").style.display = "none";
});

cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
        size.addEventListener("click", (e) =>{
            c(".pizzaInfo--size.selected").classList.remove("selected"); 
            size.classList.add("selected");
        });
  });

  //carrinho
  c(".pizzaInfo--addButton").addEventListener("click", () =>{

    
    let tamanho = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));
    let identifier = pizzaJson[modalKey].id+"@"+tamanho;

    let keyCart = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    if(keyCart > -1){

        cart[keyCart].qt += qt;

    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size:tamanho,
            qt:qt
        });
    }

    
   
    closeModal();
    updateCheckout();

  });

  function closeModal() {
    c(".pizzaInfo--qt").innerHTML = 1;
    qt = 1;
    c(".pizzaWindowArea").style.opacity = 1;
    c(".pizzaWindowArea").style.display = "none"

    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 0;
    }, 500);
  }

  function updateCheckout() {

    //atualiza qt no mobile 
    c(".menu-openner span").innerHTML = cart.length;

    if(cart.length > 0){

      c("aside").classList.add("show");

      c(".cart").innerHTML = "";

      let subtotal = 0.0;
      let desconto= 0.0;
      let total = 0.0;

      for(let i in cart){

        let itemPizza = pizzaJson.find((item)=>{
          return item.id == cart[i].id;
        });

        subtotal += (itemPizza.price * cart[i].qt);

        let pizzaSize;

        switch (cart[i].size){
            case 0:
              pizzaSize = "P";
              break;
            case 1:
              pizzaSize = "M";
              break;
            case 2:
              pizzaSize = "G";
              break;
            default:
              pizzaSize = "Tamanho inválido"
        }

        let itemCart = c(".models .cart--item").cloneNode(true);
                       
        let pizzaName = `${itemPizza.name} (${pizzaSize})`;

        //preecher as informações
        itemCart.querySelector("img").src = itemPizza.img;
        itemCart.querySelector(".cart--item-nome").innerHTML = pizzaName;
        itemCart.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

        


        //diminuir qtmenos
        itemCart.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
          console.log(cart[i].qt);
          if (cart[i].qt > 1) {
              cart[i].qt = cart[i].qt - 1;
          } else {
            cart.splice(i, 1);
          }
          updateCheckout();
        });

        //aumentar o qtmais
        itemCart.querySelector(".cart--item-qtmais").addEventListener("click", ()=>{
         cart[i].qt = cart[i].qt + 1;
          updateCheckout();
        });

        c(".cart").append(itemCart);



      }

      desconto = (subtotal * 0.1);
      total = (subtotal - desconto);

      c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
      c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
      c(".big span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;

      

    } else {
      c("aside").classList.remove("show");
      c("aside").style.left = '100vw';
    }

  }

  c(".menu-openner span").addEventListener("click",() => {

    if(cart.length >= 0){
      c("aside").style.left = '0';
    }
  });

  c(".menu-closer").addEventListener("click",() => {
    c("aside").style.left = '100vw';
  });

  
