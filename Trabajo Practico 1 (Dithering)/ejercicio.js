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


function factorArray(f){
  let v = [0,255];
  for (var i = 0; i < f; i++) {
    v = factor(v, 0, v.length-1);
  }
  return v;
}

//Si no funciona es porque cambiamos factor por facNum

const closest = (arr, num) => {
   return arr.reduce((acc, val) => {
      if(Math.abs(val - num) < Math.abs(acc)){
         return val - num;
      }else{
         return acc;
      }
   }, Infinity) + num;
}

function find_closest_pixel(px, facNum){
  let factors = factorArray(facNum);
  bestRed = closest(factors, px.r);
  bestGreen = closest(factors, px.g);
  bestBlue = closest(factors, px.b);
  //el vector de factores es el mismo para cada RGB
  let newPixel = new pixel(bestRed,bestGreen,bestBlue);
  return newPixel;
}

function popM(v){
    v.pop();
    return v;
}

// j = |v|-1
function factor(v,i,j){
  if(j-i == 1){
      return [v[i],Math.ceil((v[i]+v[j])/2),v[j]];
  }
  else{
    return popM(factor(v, i, Math.floor((i+j)/2))).concat(factor(v,Math.floor((i+j)/2), j));
  }
}

function dither(image, fac) {
    let vecImage = image.data;
    console.log(image);

    for(i=0; i < image.width*image.height*4 - 3; i+=4){
      let oldpixel = new pixel(vecImage[i],vecImage[i+1],vecImage[i+2]);
      let newpixel = find_closest_pixel(oldpixel, fac);
      //pixel[x][y] = newPixel
      image.data[i] = newpixel.r;
      image.data[i+1] = newpixel.g;
      image.data[i+2] = newpixel.b;
      //quant_error := oldpixel - newpixel
      let quant_error_r := oldpixel.r - newpixel.r;
      let quant_error_g := oldpixel.g - newpixel.g;
      let quant_error_b := oldpixel.b - newpixel.b;
    }

}



    /*for each y from top to bottom do
       for each x from left to right do
           pixel[x + 1][y ] := pixel[x + 1][y ] + quant_error × 7 / 16
           pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error × 3 / 16
           pixel[x ][y + 1] := pixel[x ][y + 1] + quant_error × 5 / 16
           pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error × 1 / 16
}
*/

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA, imageB, result) {
    // completar
}
