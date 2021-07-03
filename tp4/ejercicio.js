// <============================================ EJERCICIOS ============================================>
// b) Implementar los métodos:
//
//      setMesh( vertPos, texCoords )
//      swapYZ( swap )
//      draw( trans )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado, asi como también intercambiar 
//    sus coordenadas yz. Para reenderizar cada fragmento, en vez de un color fijo, pueden retornar: 
//
//      gl_FragColor = vec4(1,0,gl_FragCoord.z*gl_FragCoord.z,1);
//
//    que pintará cada fragmento con un color proporcional a la distancia entre la cámara y el fragmento (como en el video).
//    IMPORTANTE: No es recomendable avanzar con el ejercicio c) si este no funciona correctamente. 
//
// c) Implementar los métodos:
//
//      setTexture( img )
//      showTexture( show )
//
//    Si la implementación es correcta, podrán visualizar el objeto 3D que hayan cargado y su textura.
//
// Notar que los shaders deberán ser modificados entre el ejercicio b) y el c) para incorporar las texturas.  
// <=====================================================================================================>


function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [COMPLETAR] Modificar el código para formar la matriz de transformación.

	var matRotX = [
		1, 0, 0, 0,
		0, Math.cos(rotationX), (-1)*Math.sin(rotationX), 0, 
		0, Math.sin(rotationX), Math.cos(rotationX), 0, 
		0, 0, 0, 1  
	];

	var matRotY = [
		Math.cos(rotationY), 0, Math.sin(rotationY), 0,
		0, 1, 0, 0, 
		(-1)*Math.sin(rotationY), 0, Math.cos(rotationY), 0, 
		0, 0, 0, 1  
	];

	var rotation = MatrixMult(matRotX, matRotY);


	// Matriz de traslación
	var translation = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var trans = MatrixMult(translation, rotation);

	var mvp = MatrixMult( projectionMatrix, trans );
	return mvp;
}

// Completar la implementación de esta clase.
class MeshDrawer
{
	// El constructor es donde nos encargamos de realizar las inicializaciones necesarias. 
	constructor()
	{
		// 1. Inicializaciones
		this.prog = InitShaderProgram(meshVS, meshFS);
		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');

		this.texGPU = gl.getUniformLocation(this.prog, 'texGPU');
		this.permutar = gl.getUniformLocation(this.prog, 'permutar');
		this.mostrar = gl.getUniformLocation(this.prog, 'mostrar');
		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos = gl.getAttribLocation(this.prog, 'pos');
		this.permutacion = gl.getUniformLocation(this.prog, 'permutacion');
		this.tex = gl.getAttribLocation(this.prog, 'tex');

	}
	
	// Esta función se llama cada vez que el usuario carga un nuevo archivo OBJ.
	// En los argumentos de esta función llegan un areglo con las posiciones 3D de los vértices
	// y un arreglo 2D con las coordenadas de textura. Todos los items en estos arreglos son del tipo float. 
	// Los vértices se componen de a tres elementos consecutivos en el arreglo vertexPos [x0,y0,z0,x1,y1,z1,..,xn,yn,zn]
	// De manera similar, las coordedenadas de textura se componen de a 2 elementos consecutivos y se 
	// asocian a cada vértice en orden. 
	setMesh( vertPos, texCoords )
	{
		//Creacion del vertex buffer. 
		this.buffer = gl.createBuffer(); 
		this.texCoord_buffer = gl.createBuffer();
		//Binding. 
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//seteo de contenido.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		// [COMPLETAR] Actualizar el contenido del buffer de vértices

		this.numTriangles = vertPos.length / 3 / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoord_buffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW );
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoord_buffer);
		gl.vertexAttribPointer(this.tex, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.tex);


		gl.uniform1i(this.mostrar, 1);
	
	}
	
	// Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Intercambiar Y-Z'
	// El argumento es un boleano que indica si el checkbox está tildado
	swapYZ( swap )
	{
		gl.useProgram(this.prog);
		// [COMPLETAR] Setear variables uniformes en el vertex shader
		var p = [1,0,0,0,
				 0,0,1,0,
				 0,1,0,0,
				 0,0,0,1]

		gl.uniformMatrix4fv(this.permutacion, false, p);
		gl.uniform1i(this.permutar, swap);
	}
	
	// Esta función se llama para dibujar la malla de triángulos
	// El argumento es la matriz de transformación, la misma matriz que retorna GetModelViewProjection
	draw( trans )
	{
		// [COMPLETAR] Completar con lo necesario para dibujar la colección de triángulos en WebGL
		
		// 1. Seleccionamos el shader

		gl.useProgram(this.prog);

		// 2. Setear matriz de transformacion

		gl.uniformMatrix4fv(this.mvp, false, trans);
		gl.useProgram(this.prog);
		
	    // 3.Binding de los buffers
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer(this.pos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.pos);
		// Dibujamos
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles * 3  );
	}
	
	// Esta función se llama para setear una textura sobre la malla
	// El argumento es un componente <img> de html que contiene la textura. 
	setTexture( img )
	{
		gl.useProgram(this.prog);
		gl.uniform1i(this.mostrar, 1);
		// [COMPLETAR] Binding de la textura
		const textura = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, textura);
		gl.texImage2D( gl.TEXTURE_2D, // Textura 2D
			0, // Mipmap nivel 0
			gl.RGB, // formato (en GPU)
			gl.RGB, // formato del input
			gl.UNSIGNED_BYTE, // tipo
			img // arreglo o <img>
		);

		gl.generateMipmap( gl.TEXTURE_2D );

		gl.activeTexture( gl.TEXTURE0 ); // digo que voy a usar la Texture Unit 0
		gl.bindTexture( gl.TEXTURE_2D, textura);

	}
	
	// Esta función se llama cada vez que el usuario cambia el estado del checkbox 'Mostrar textura'
	// El argumento es un boleano que indica si el checkbox está tildado
	showTexture( show )
	{
		// [COMPLETAR] Setear variables uniformes en el fragment shader


		var sampler = gl.getUniformLocation(this.prog, 'texGPU' );
		gl.useProgram(this.prog );
		gl.uniform1i(this.mostrar, show);
		gl.uniform1i (sampler, 0 ); // Unidad 0
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles * 3  );
	}
}

// Vertex Shader
// Si declaras las variables pero no las usas es como que no las declaraste y va a tirar error. Siempre va punto y coma al finalizar la sentencia. 
// Las constantes en punto flotante necesitan ser expresadas como x.y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var meshVS = `
	attribute vec3 pos;
	attribute vec2 tex;
	uniform int permutar;
	uniform mat4 permutacion;
	uniform mat4 mvp;
	varying vec2 texCoord;
	
	void main()
	{ 
		texCoord = tex;
		if(permutar == 1){
		gl_Position =  mvp * permutacion * vec4(pos,1) ;
		}
		else{
		gl_Position = mvp * vec4(pos,1);
		}
	}
`;

// Fragment Shader
var meshFS = `
	precision mediump float;
	uniform sampler2D texGPU;
	varying vec2 texCoord;
	uniform int mostrar;
	
	void main()
	{		
		if(mostrar == 1){
		gl_FragColor = texture2D(texGPU,texCoord);
		}
		else{
		gl_FragColor = vec4(0,0,0,1);
		}
	}
`;
