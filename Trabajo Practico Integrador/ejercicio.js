// Completar la implementación de esta clase y el correspondiente vertex shader. 
// No será necesario modificar el fragment shader a menos que, por ejemplo, quieran modificar el color de la curva.
var alpha = 0.1;

class CurveDrawer {
	// Inicialización de los shaders y buffers
	constructor() {
		// Creamos el programa webgl con los shaders para los segmentos de recta
		this.prog = InitShaderProgram(curvesVS, curvesFS);

		//Inicialización de variables uniformes.
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		this.p0 = gl.getUniformLocation(this.prog, 'p0');
		this.p1 = gl.getUniformLocation(this.prog, 'p1');
		this.p2 = gl.getUniformLocation(this.prog, 'p2');
		this.p3 = gl.getUniformLocation(this.prog, 'p3');

		//Inicialización de Atributo.
		this.t = gl.getAttribLocation(this.prog, 't');

		this.t0 = gl.getAttribLocation(this.prog, 't0');
		this.t1 = gl.getAttribLocation(this.prog, 't1');
		this.t2 = gl.getAttribLocation(this.prog, 't2');
		this.t3 = gl.getAttribLocation(this.prog, 't3');

		//Muestreo del parámetro t
		//Se obtiene un vector de tamaño 100 con valores entre 0 y 1.
		this.steps = 100;
		var tv = [];
		for (var i = 0; i < this.steps; ++i) {
			tv.push(i / (this.steps - 1));
		}
		//Creacion del vertex buffer. 
		this.buffer = gl.createBuffer();
		//Binding. 
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//seteo de contenido.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);

	}
	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport(width, height) {
		// Matriz de transformación.
		var trans = [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
		//Binding del programa y seteo de la variable uniforme para la matriz.
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvp, false, trans);
	}

	updatePoints(pt) {
		gl.useProgram(this.prog);
		for (var i = 0; i < 4; ++i) {
			var x = pt[i].getAttribute("cx");
			var y = pt[i].getAttribute("cy");
			gl.uniform2f(this['p' + i], x, y);
		}

		this.point0 = [pt[0].getAttribute("cx"), pt[0].getAttribute("cy")];
		this.point1 = [pt[1].getAttribute("cx"), pt[1].getAttribute("cy")];
		this.point2 = [pt[2].getAttribute("cx"), pt[2].getAttribute("cy")];
		this.point3 = [pt[3].getAttribute("cx"), pt[3].getAttribute("cy")];

	}

	draw() {

		var te0 = 0;
		var te1 = Math.pow((Math.sqrt(Math.pow(this.point1[0] - this.point0[0], 2) + Math.pow(this.point1[1] - this.point0[1], 2))), alpha) + te0;
		var te2 = Math.pow((Math.sqrt(Math.pow(this.point2[0] - this.point1[0], 2) + Math.pow(this.point2[1] - this.point1[1], 2))), alpha) + te1;
		var te3 = Math.pow((Math.sqrt(Math.pow(this.point3[0] - this.point2[0], 2) + Math.pow(this.point3[1] - this.point2[1], 2))), alpha) + te2;

		var arr = Array.from({
			length: 100
		}, (e, i) => te0);
		var arr1 = Array.from({
			length: 100
		}, (e, i) => te1);
		var arr2 = Array.from({
			length: 100
		}, (e, i) => te2);
		var arr3 = Array.from({
			length: 100
		}, (e, i) => te3);


		gl.useProgram(this.prog);
		this.bufferT0 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT0);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
		
		gl.useProgram(this.prog);
		this.bufferT1 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT1);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr1), gl.STATIC_DRAW);

		gl.useProgram(this.prog);
		this.bufferT2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr2), gl.STATIC_DRAW);

		gl.useProgram(this.prog);
		this.bufferT3 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT3);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr3), gl.STATIC_DRAW);

		//Dibujamos la curva como una LINE_STRIP
		//binding del programa
		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//Se habilitan los atributos de los vertices
		gl.vertexAttribPointer(this.t, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.t);

		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT0);
		gl.vertexAttribPointer(this.t0, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.t0);

		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT1);
		gl.vertexAttribPointer(this.t1, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.t1);

		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT2);
		gl.vertexAttribPointer(this.t2, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.t2);

		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferT3);
		gl.vertexAttribPointer(this.t3, 1, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.t3);
		gl.drawArrays(gl.LINE_STRIP, 0, this.steps);
	}
}

// Vertex Shader
//El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `

	attribute float t;
	attribute float t0;
	attribute float t1;
	attribute float t2;
	attribute float t3;

	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	
	void main()
	{ 	
		vec2 A3 = ((t3 - t)/(t3 - t2)) * p2 + ((t - t2)/(t3 - t2)) * p3;	
		vec2 A2 = ((t2 - t)/(t2 - t1)) * p1 + ((t - t1)/(t2 - t1)) * p2;
		vec2 A1 = ((t1 - t)/(t1 - t0)) * p0 + ((t - t0)/(t1 - t0)) * p1;
		vec2 B2 = ((t3 - t)/(t3 - t1)) * A2 + ((t - t1)/(t3 - t1)) * A3;
		vec2 B1 = ((t2 - t)/(t2 - t0)) * A1 + ((t - t0)/(t2 - t0)) * A2;
		vec2 pos = (((t2 - t)/(t2 - t1)) * B1 + ((t - t1)/(t2 - t1)) * B2);
		gl_Position = mvp * vec4(pos,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(0,0,1,1);
	}
`;