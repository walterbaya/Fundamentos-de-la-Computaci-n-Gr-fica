class pixel{
  constructor(r,g,b){
      this.r = r;
      this.g = g;
      this.b = b;
  }
}

// Encuentra el numero mas cercano en un array
const closest = (arr, num) => {
   return arr.reduce((acc, val) => {
      if(Math.abs(val - num) < Math.abs(acc)){
         return val - num;
      }else{
         return acc;
      }
   }, Infinity) + num;
}
// Encuentra el mejor pixel que puede con los colores que tiene
function find_closest_pixel(px, facNum){
  let factors = factor(facNum);
  bestRed = closest(factors, px.r);
  bestGreen = closest(factors, px.g);
  bestBlue = closest(factors, px.b);
  //el vector de factores es el mismo para cada RGB
  let newPixel = new pixel(bestRed,bestGreen,bestBlue);
  return newPixel;
}


// Crea el vector de factores
function factor(n){
  let intervalos = Math.ceil(256/(2**n))
  let suma = 0
  let vector= []
  while(suma < 256){
    vector.push(suma)
    suma+=intervalos
  }
  vector.push(255)
  return vector
}


//Toma la posicion y error de cada color y aplica el error
//y*width*4 + x*4 esto serìa la posicion que ocupa 
//en el arreglo cada canal rojo.
//y*width*4 + x*4 + 1 esto serìa la posicion que ocupa 
//en el arreglo cada canal verde.
//y*width*4 + x*4 +2 esto serìa la posicion que ocupa 
//en el arreglo cada canal azul.
function quantPixel(x,y, img, qeR, qeG, qeB, mult){
  let width = img.width; 
  img.data[y*width*4 + x*4] += qeR*mult;
  img.data[y*width*4 + x*4 + 1] += qeG*mult;
  img.data[y*width*4 + x*4 + 2] += qeB*mult;  
}


function bordeIzquierdo(posX){
  if(posX == 1){
    return -1;
  }
  else if(posX == 0){
    return 0;
  }
  else{
    return -2;
  }
}

function bordeDerecho(posX, width){
  if(posX == width - 1){
    return 0;
  }
  else if(posX ==  width - 2){
    return 1;
  }
  else{
    return 2;
  }
}

function bordeInferior(posY, height){
  if(posY == height - 1){
    return 0;
  }
  else if(posY == height - 2){
    return 1;
  }
  else{
    return 2;
  }
}

// -2<=bordeIzquierdo<=0
// 0<=bordeDerecho<=2
// 0<=bordeInferior<=2
//Aplica dada la posicion x,y de un pixel  
//la matriz de Jarvis a los pixeles vecinos
function productoMatriz(x,y, qeR, qeG, qeB, img, matriz){
  let width = img.width;
  let height = img.height;
  for (var i = 0; i <= bordeInferior(y, height); i++){
      for (var j = bordeIzquierdo(x); j <= bordeDerecho(x, width); j++){
        if(i==0 && (j == -2 || j == -1 || j == 0)){
          
        } 
        else{
          quantPixel(x + j, y + i, img, qeR, qeG, qeB, matriz[i][j+2]);
        }       
      }
  }
}


function dither(image, fac) {
   let width = image.width;
   let height = image.height;
   let x = 0;
   let y = 0;
   let matriz = [
                 [1,1,1,7/48,5/48],
                 [3/48,5/48,7/48,5/48,3/48],
                 [1/48,3/48,5/48,3/48,1/48]
                ];

    for(var i = 0; i < width*height*4 - 3 ; i+=4){
      let oldpixel = new pixel(image.data[i],image.data[i+1],image.data[i+2]);
      let newpixel = find_closest_pixel(oldpixel, fac);
      //pixel[x][y] = newPixel
      image.data[i] = newpixel.r;
      image.data[i+1] = newpixel.g;
      image.data[i+2] = newpixel.b;
      //quant_error := oldpixel - newpixel
      let quant_error_r = oldpixel.r - newpixel.r;
      let quant_error_g = oldpixel.g - newpixel.g;
      let quant_error_b = oldpixel.b - newpixel.b;
      
      //Guardamos la posicion en x que ocupa dicho pixel
      x = (i % (width*4))/4;

      //Guardamos la posicion en y que ocupa dicho pixel
      y = Math.floor(i / (width*4));

      productoMatriz(x, y, quant_error_r, quant_error_g, quant_error_b,image,matriz);
    }
  }

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA, imageB, result) {

    for(var i = 0; i < imageA.width*imageA.height*4 - 3 ; i+=4){
        let pixelOriginal = new pixel(imageA.data[i],imageA.data[i+1],imageA.data[i+2]);
        let pixelDithered = new pixel(imageB.data[i],imageB.data[i+1],imageB.data[i+2]);
        //pixel[x][y] = newPixel

        //quant_error := oldpixel - newpixel
        let quant_error_r = Math.abs( pixelOriginal.r - pixelDithered.r);
        let quant_error_g = Math.abs(pixelOriginal.g - pixelDithered.g);
        let quant_error_b = Math.abs(pixelOriginal.b - pixelDithered.b);

        result.data[i] = quant_error_r;
        result.data[i+1] = quant_error_g;
        result.data[i+2] = quant_error_b;
    }

}

