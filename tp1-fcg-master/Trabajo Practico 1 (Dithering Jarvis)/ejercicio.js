// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)
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


function applyError(pos, img, qeR, qeG, qeB,){
    let width = img.width;
    let height = img.height;

    let p03 = pos + 4;
    let p04 = p03 + 4;

    let p12 = pos + width;
    let p13 = p12 +4;
    let p14 = p13 +4;
    let p11 = p12 -4;
    let p10 = p11 -4;

    let p22 = p12 + width;
    let p23 = p22 +4;
    let p24 = p23 +4;
    let p21 = p22 -4;
    let p20 = p21 -4;


    //chequear casos borde

    // si la pos es el ultimo
    if(pos == width*height*4 - 4 ){
      return;
    }
    // si estamos en la primer columna
    else if(pos % width == 0){
      quantPixel(p03, img, qeR, qeG, qeB, 7/48);
      quantPixel(p04, img, qeR, qeG, qeB, 5/48);
      quantPixel(p12, img, qeR, qeG, qeB, 7/48);
      quantPixel(p13, img, qeR, qeG, qeB, 5/48);
      quantPixel(p14, img, qeR, qeG, qeB, 3/48);
      quantPixel(p22, img, qeR, qeG, qeB, 5/48);
      quantPixel(p23, img, qeR, qeG, qeB, 3/48);
      quantPixel(p24, img, qeR, qeG, qeB, 1/48);
      return;
    }
    // si estamos en la ultima columna
    else if(pos % width == width - 1){
      quantPixel(bottom, img, qeR, qeG, qeB, 5/16);
      quantPixel(bottomLeft, img, qeR, qeG, qeB, 3/16);
      return;
    }
    //ultima fila
    else if(pos > width*(height-1)*4 && pos < width*(height)*4){
      quantPixel(right, img, qeR, qeG, qeB, 7/16);
      return;
    }


    quantPixel(right, img, qeR, qeG, qeB, 7/16);
    quantPixel(bottom, img, qeR, qeG, qeB, 5/16);
    quantPixel(bottomRight, img, qeR, qeG, qeB, 1/16);
    quantPixel(bottomLeft, img, qeR, qeG, qeB, 3/16);
}

// Toma la posicion y error de cada color y aplica el error
function quantPixel(pos, img, qeR, qeG, qeB, mult){
  img.data[pos] += qeR*mult;
  img.data[pos + 1] += qeG*mult;
  img.data[pos + 2] += qeB*mult;  
}


function dither(image, fac) {
    let width = image.width;
    let height = image.height;
    for(var i = 0; i < image.width*image.height*4 - 3 ; i+=4){
      let oldpixel = new pixel(image.data[i],image.data[i+1],image.data[i+2]);
      let newpixel = find_closest_pixel(oldpixel, fac);

      let x = i/4;
      console.log(x); 
      //let y = ;
      //pixel[x][y] = newPixel
      image.data[i] = newpixel.r;
      image.data[i+1] = newpixel.g;
      image.data[i+2] = newpixel.b;
      //quant_error := oldpixel - newpixel
      let quant_error_r = oldpixel.r - newpixel.r;
      let quant_error_g = oldpixel.g - newpixel.g;
      let quant_error_b = oldpixel.b - newpixel.b;
      
      applyError(i, image, quant_error_r, quant_error_g, quant_error_b);
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
