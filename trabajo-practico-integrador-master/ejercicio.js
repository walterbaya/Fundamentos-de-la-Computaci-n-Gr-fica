function GetModelViewMatrix(translationX, translationY, translationZ, rotationX, rotationY) {
	var matRotX = [
		1, 0, 0, 0,
		0, Math.cos(rotationX), (-1) * Math.sin(rotationX), 0,
		0, Math.sin(rotationX), Math.cos(rotationX), 0,
		0, 0, 0, 1
	];

	var matRotY = [
		Math.cos(rotationY), 0, Math.sin(rotationY), 0,
		0, 1, 0, 0,
		(-1) * Math.sin(rotationY), 0, Math.cos(rotationY), 0,
		0, 0, 0, 1
	];

	var rotation = MatrixMult(matRotX, matRotY);

	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var mv = MatrixMult(trans, rotation);
	return mv;
}
var seCargoUnaImagen = 0;
class MeshDrawer {
	constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		this.texGPU = gl.getUniformLocation(this.prog, 'texGPU');
		this.mostrar = gl.getUniformLocation(this.prog, 'mostrar');
		this.permutar = gl.getUniformLocation(this.prog, 'permutar');
		this.permutacion = gl.getUniformLocation(this.prog, 'permutacion');
		this.wsEyePosition = gl.getUniformLocation(this.prog, 'wsEyePosition');

		this.vertex = gl.getAttribLocation(this.prog, 'vertex');
		this.tex = gl.getAttribLocation(this.prog, 'tex');
		this.normal = gl.getAttribLocation(this.prog, 'normal');

		this.vertexBuffer = gl.createBuffer();
		this.textureBuffer = gl.createBuffer();
		this.normalBuffer = gl.createBuffer();

	}

	// Esta función se llama cada vez que el usuario carga un nuevo
	// archivo OBJ. En los argumentos de esta función llegan un areglo
	// con las posiciones 3D de los vértices, un arreglo 2D con las
	// coordenadas de textura y las normales correspondientes a cada 
	// vértice. Todos los items en estos arreglos son del tipo float. 
	// Los vértices y normales se componen de a tres elementos 
	// consecutivos en el arreglo vertPos [x0,y0,z0,x1,y1,z1,..] y 
	// normals [n0,n0,n0,n1,n1,n1,...]. De manera similar, las 
	// cooredenadas de textura se componen de a 2 elementos 
	// consecutivos y se  asocian a cada vértice en orden.

	setMesh(vertPos, texCoords, normals) {

		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		gl.vertexAttribPointer(this.vertex, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertex);

		this.numTriangles = vertPos.length / 3 / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.tex, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.tex);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.normal);
		gl.useProgram(this.prog);
		gl.uniform1i(this.mostrar, 0);
	}

	swapYZ(swap) {
		gl.useProgram(this.prog);
		var p = [1, 0, 0, 0,
			0, 0, 1, 0,
			0, 1, 0, 0,
			0, 0, 0, 1]
		gl.uniformMatrix4fv(this.permutacion, false, p);
		gl.uniform1i(this.permutar, swap);
	}

	// Esta función se llama para dibujar la malla de triángulos
	// El argumento es la matriz model-view-projection (matrixMVP),
	// la matriz model-view (matrixMV) que es retornada por 
	// GetModelViewProjection y la matriz de transformación de las 
	// normales (matrixNormal) que es la inversa transpuesta de matrixMV
	draw(matrixMVP) {

		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mvp, false, matrixMVP);
		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(this.vertex, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertex);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);

	}

	setTexture(img) {
		seCargoUnaImagen = 1;
		gl.useProgram(this.prog);
		const textura = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, textura);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

		gl.generateMipmap(gl.TEXTURE_2D);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textura);
		gl.uniform1i(this.mostrar, 1);
	}

	showTexture(show) {
		if (seCargoUnaImagen) {
			var sampler = gl.getUniformLocation(this.prog, 'texGPU');
			gl.useProgram(this.prog);
			gl.uniform1i(this.mostrar, show);
			gl.uniform1i(sampler, 0); // Unidad 0
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
		}
	}

	// Este método se llama al actualizar la dirección de la luz desde la interfaz
	setLightDir(x, y, z) {
		gl.useProgram(this.prog);
		gl.uniform3fv(this.wsEyePosition, [x, y, z]);
	}
}



// Vertex Shader
var meshVS = `
	precision mediump float;

	attribute vec3 vertex;
	attribute vec3 normal;
	attribute vec2 tex;
	
	uniform mat4 mvp;
	uniform mat4 permutacion;
	uniform vec3 wsEyePosition;
	uniform int permutar;

	varying vec3 wsInterpolatedNormal;
	varying vec2 texCoord;
	
	 
	void main()
	{
		wsInterpolatedNormal = normal;
		texCoord = tex;

		if(permutar == 1){
			gl_Position =  mvp * permutacion * vec4(vertex,1);
		}
		else{
			gl_Position = mvp * vec4(vertex,1);
		}
	}
`;

// Fragment Shader

var meshFS = `
	precision mediump float;
	uniform sampler2D texGPU;
	uniform vec3 wsEyePosition;
	uniform int mostrar;
	varying vec2 texCoord;
	varying vec3 wsInterpolatedNormal;

	void main()
	{

		vec4 kd = texture2D(texGPU, texCoord);
		float intensity = dot(normalize(wsInterpolatedNormal), wsEyePosition);
		if(mostrar == 1){		
			if (intensity > 0.95){
				gl_FragColor = kd;
			}
			else if (intensity > 0.4){
				gl_FragColor = kd * 0.6;
			}
			else{
				gl_FragColor = kd * 0.2;
			}
		}
		else{
			kd = vec4(1.0,0.0,0.0,0.0);	
			if (intensity > 0.95){
				gl_FragColor = kd;
			}
			else if (intensity > 0.4){
				gl_FragColor = kd * 0.6;
			}
			else{
				gl_FragColor = kd * 0.2;
			}
		}
	}
`;

