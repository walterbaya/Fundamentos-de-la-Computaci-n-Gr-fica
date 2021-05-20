// Esta función construye una matriz de transfromación de 3x3 en coordenadas homogéneas 
// utilizando los parámetros de posición, rotación y escala. La estructura de datos a 
// devolver es un arreglo 1D con 9 valores en orden "column-major". Es decir, para un 
// arreglo A[] de 0 a 8, cada posición corresponderá a la siguiente matriz:
//
// | A[0] A[3] A[6] |
// | A[1] A[4] A[7] |
// | A[2] A[5] A[8] |
// 
// Se deberá aplicar primero la escala, luego la rotación y finalmente la traslación. 
// Las rotaciones vienen expresadas en grados. 

function multiply(mat1, mat2)
{
	res = [[0,0,0],[0,0,0],[0,0,0]];
    let i, j, k;
    for (i = 0; i < res.length; i++) {
        for (j = 0; j < res.length; j++) {
            res[i][j] = 0;
            for (k = 0; k < res.length; k++)
                res[i][j] += mat1[i][k] * mat2[k][j];
        }
    }
    return res;
}

function arrayToMatrix(arr){
	let res = [[0,0,0],[0,0,0],[0,0,0]];
	let c = 0;
	for (var i = 0; i < arr.length; i++) {
		if(i % 3 != 2){
			res[i%3][c]=arr[i];
		}
		else{
			res[i%3][c]=arr[i];
			c++;
		}
	}
	return res;
}

function matrixToArray(mat){
	let res = [];
	for (var i = 0; i < mat.length; i++) {
		for (var j = 0; j < mat.length; j++) {
			res.push(mat[j][i]);
		}		
	}
	return res;
}	

function BuildTransform( positionX, positionY, rotation, scale)
{	
	//cos r  -sen r 	s 0  	s*cos r  s*-sen r	posX  
	//sen r 	cos r	0 s    	s*sen r  s*cos 		poxy
	//let M1 = []					0		0		 1
	let r = (rotation*2*Math.PI)/360;
	return Array(scale*Math.cos(r),scale*Math.sin(r),0,scale*(-1)*Math.sin(r),scale*Math.cos(r),0,positionX,positionY,1);
}

// Esta función retorna una matriz que resula de la composición de trasn1 y trans2. Ambas 
// matrices vienen como un arreglo 1D expresado en orden "column-major", y se deberá 
// retornar también una matriz en orden "column-major". La composición debe aplicar 
// primero trans1 y luego trans2. 
function ComposeTransforms( trans1, trans2 )
{
	let m1 = arrayToMatrix(trans1);
	let m2 = arrayToMatrix(trans2);
	let res = multiply(m2,m1);
	return matrixToArray(res);
}


