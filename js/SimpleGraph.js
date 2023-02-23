import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

class WordVec {
    constructor(word, vector) {
        this.word = word
        this.vector = vector
    }
}

class WNode {
    // constructor(p, wordvec) {
    constructor(p) {
        this.p = p;
        this.u = new THREE.Vector3(0,0,0);
        this.f = new THREE.Vector3(0,0,0);
        // this.wordvec = wordvec;
    }
}


class WEdge {
    constructor(node0, node1) {
        this.node0 = node0;
        this.node1 = node1;
        this.k = 1.0; //spring stiffness
        this.targetLength = 1.0;
        this.show = false;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.scene = new THREE.Scene();
    }

    GetEdgeLines = () => {
        for (let i = 0; i < this.edges.length; ++i) {
            if (this.edges[i].show) {
                this.points = [this.edges[i].node0.p, this.edges[i].node1.p]
                this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
                this.line = new THREE.Line(this.geometry, this.lineMaterial);
                this.scene.add(this.line);
            }
        }
    }

    Step = () => {
        for (let i=0; i<this.nodes.length; i++) {
            this.nodes[i].f = new THREE.Vector3() //set force to zero
        }

        // spring force
        for (let i=0; i<this.edges.length; i++) {
            const e = this.edges[i]
            const n0 = e.node0
            const n1 = e.node1
        
            const dp = n1.p.sub(n0.p);
            dp.normalize();
            const dist = dp.length;

            n0.f += dp * (dist - e.targetLength) * e.k;
            n1.f += dp * (dist - e.targetLength) * e.k;
        }

        for (let i=0; i < this.nodes.length; i++) {
            this.nodes[i].u *= damping; //deccelaration
            this.nodes[i].u += this.nodes[i].f*dt;
            this.nodes[i].p += this.nodes[i].u*dt;
        }
    }        
}

const fov = 75;
const aspect = window.innerWidth/window.innerHeight;  // the canvas default
const near = 0.1;
const far = 100; // 5?
const c = new THREE.PerspectiveCamera(fov, aspect, near, far);
c.position.z = 18;
const l = new THREE.DirectionalLight(new THREE.Color(0xFFFFEE), 0.75);
l.position.set( 50, - 25, 75 );
const g = new Graph()
const s = g.scene;
s.add(l);
s.background = new THREE.Color(0xCCCCCC);
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const NODES_LENGTH = 2000;
const sphereGeometry = new THREE.SphereGeometry(window.innerHeight/(5*window.innerHeight), 16, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

const start = () => {

    for (let i = 0; i < NODES_LENGTH; i++) {
        g.nodes.push(new WNode(new THREE.Vector3(Math.random() * 40, Math.random() * 40, Math.random() * 40)))
    }

    for (let j = 0; j < g.nodes.length; j++) {
        for (let i = j + 1; i < NODES_LENGTH; i++) {
            const e = new WEdge(g.nodes[j], g.nodes[i])
            g.edges.push(e);
            const sim = Math.random();
            if (sim < 0.9995) {
                e.k = 0.05;
                e.targetLength = (1.0 - sim) * 40 * 2.0;
                e.show = false;
            } else {
                e.k = 0.5;
                e.targetLength = (1.0 - sim) * 40;
                e.show = true;
            }
        }
    }
}

const loop = () => {
    // g.Step(0.95, 0.02);
    g.GetEdgeLines();

    for (let i=0; i <g.nodes.length; ++i) {
        //draw a sphere at position g.nodes[i].p
        const sm = sphereMesh.clone();
        sm.position.x = g.nodes[i].p.x;
        sm.position.y = g.nodes[i].p.y;
        sm.position.z = g.nodes[i].p.z;
        s.add(sm);
    }
}

const animate = () => {
    loop();

    requestAnimationFrame(animate);
    renderer.render(s, c);
}

start();
animate();