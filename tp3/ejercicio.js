// Completar la implementación de esta clase y el correspondiente vertex shader. 
// No será necesario modificar el fragment shader a menos que, por ejemplo, quieran modificar el color de la curva.
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
	}

	draw() {
		//Dibujamos la curva como una LINE_STRIP
		//binding del programa
		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//Se habilitan los atributos de los vertices
		gl.vertexAttribPointer(this.t, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.t);
		gl.drawArrays(gl.LINE_STRIP, 0, 50);
	}
}

// Vertex Shader
//El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{ 
		vec2 pos = (1.0 - t)*(1.0 - t)*(1.0 - t)*p0 + 3.0*(1.0-t)*(1.0-t)*t*p1 + 3.0*(1.0-t)*t*t*p2 + t*t*t*p3;
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