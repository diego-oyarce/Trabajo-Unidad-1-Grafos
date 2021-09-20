//VERIFICAR QUE AL ELIMINAR UN NODO SE ELIMINE DEL ARRAY O SE PUEDE CREAR CONSTANTEMENTE UN ARRAY APARTIR DE LOS DATOS DEL ARRAY nodes


//SE CREA UN ARREGLO VACIO DE NODOS
var nodes = new vis.DataSet([]);

//SE CREA UN ARREGLO VACIO DE ARISTAS
var edges = new vis.DataSet([]);

//MATRIZ DE ADYACENCIA
var matrizAdy = new Array();

//ARRAY DONDE SE GUARDARÁN LOS IDs DE LOS NODOS
var arrayIdVertices = [];

//ARRAY DONDE SE GUARDARÁN LAS ETIQUETAS DE LOS NODOS
var arrayLabelVertices = [];

//ARRAY DONDE SE GUARDARÁN LOS PESOS DE LAS ARISTAS
var pesos_aristas = [];

//MATRIZ ELEVADA A UN EXPONENTE
var matrizElevada = [];

//VARIABLE QUE MUESTRA NODO DE ORIGEN (FROM) Y NODO DE LLEGADA (TO)
var itemsEdges = edges.get({
    fields: ['from', 'to'],
    type: {
        from: "Number",
        to: "Number"
    }
});

//ARREGLO CON LA INFORMACION DE TODAS LAS ARISTAS (FROM, TO Y PESO)
var infoAristas = edges.get({
    fields: ['from','to','peso'],
    type:{
        from: "Number",
        to: "Number",
        peso: "Number"
    }
});

//SE CREA EL CONTENEDOR
var container = document.getElementById('grafo-simple');

var data = {
    nodes: nodes,
    edges: edges
};

var locales = {
    en: {
        edit:"Editar",
        del:"Eliminar selección",
        back:"Volver",
        addNode:"Agregar Nodo",
        addEdge:"Agregar Arista",
        editNode:"Editar Nodo",
        editEdge:"Editar Arista",
        addDescription:"Click en un espacio vacío para agregar Nodo",
        edgeDescription:"Click sobre nodo-origen y arrastrar hasta nodo-final para conectarlos",
        editEdgeDescription:""
    }
};

var options = {
        autoResize:true,
        height:'100%',
        width:'100%',
        locale: 'en',
        locales: locales,
        clickToUse: true,
        configure:{
            enabled:false,
            filter: 'nodes,edges',
            showButton:true
        },
        edges:{
            length:180,
        },
        interaction:{
            dragNodes:true,
            dragView:true,
            hover:true,
            multiselect:true,
            navigationButtons:false
        },
        manipulation:{
            enabled:true,
            initiallyActive: true,
            addNode: function(data, callback){
                var span = document.getElementById('operation-node');
                var nodeSaveButton = document.getElementById('saveButton-node');
                var nodeCancelButton = document.getElementById('cancelButton-node');
                var node_div = document.getElementById('node-popUp');
                //span.innerHTML = "Añadir nodo";
                nodeSaveButton.onclick = nodeSaveData.bind(this,data,callback);
                nodeCancelButton.onclick = nodeClearPopUp.bind();
                node_div.style.display = 'block';
            },
            addEdge: function(data, callback){
                var edgeSpan = document.getElementById('operation-edge');
                var edgeSaveButton = document.getElementById('saveButton-edge');
                var edgeCancelButton = document.getElementById('cancelButton-edge');
                var edge_div = document.getElementById('edge-popUp');
                //edgeSpan.innerHTML = "Añadir peso";
                edgeSaveButton.onclick = edgeSaveData.bind(this,data,callback);
                edgeCancelButton.onclick = edgeClearPopUp.bind();
                edge_div.style.display = 'block';
            },    
            deleteNode:true,
            deleteEdge:true
        }
    
};

var network = new vis.Network(container, data, options);


function nodeClearPopUp() {
    var nodeSaveButton = document.getElementById('saveButton-node');
    var nodeCancelButton = document.getElementById('cancelButton-node');
    nodeSaveButton.onclick = null;
    nodeCancelButton.onclick = null;
    var node_div = document.getElementById('node-popUp');
    node_div.style.display = 'none';
}

function nodeSaveData(data,callback) {
    var nodeIdInput = document.getElementById('node-id');
    var nodeLabelInput = document.getElementById('node-label');
    data.id = nodeIdInput.value;
    data.label = nodeLabelInput.value;
    nodes.add({id: nodeIdInput.value, label: nodeLabelInput.value});
    arrayIdVertices.push(nodeIdInput.value);
    arrayLabelVertices.push(nodeLabelInput.value);
    nodeClearPopUp();
    callback(data);
}

function edgeClearPopUp(){
    var edgeSaveButton = document.getElementById('saveButton-edge');
    var edgeCancelButton = document.getElementById('cancelButton-edge');
    edgeSaveButton.onclick = null;
    edgeCancelButton.onclick = null;
    var edge_div = document.getElementById('edge-popUp');
    edge_div.style.display = 'none';
}

function edgeSaveData(data,callback) {
    var edgeLabelInput = document.getElementById('edge-label');
    data.label = edgeLabelInput.value;
    pesos_aristas.push({from:data.from, to:data.to, peso:data.label});
    edgeClearPopUp();
    callback(data);
}

function creacionMatrizAd(){
    var contador = 0;
    var largoId = arrayIdVertices.length;
    var matrizAdy = new Array();
    var idConectados = new Array();
    
    for(let i=0; i < largoId; i++){ 
        matrizAdy[i] = new Array();
    }// matriz creada
    
    for(let i=0; i < largoId; i++){
        for(let j=0; j < largoId; j++){
            matrizAdy[i][j]=0; // iniciar toda la matriz en 0
        }
    }
    
    while(contador < largoId){ 
       idConectados = network.getConnectedNodes(arrayIdVertices[contador]); //en id conectados dejar los nodos que estan conectados con ese vertice
       if(idConectados != null ){
           for(let i = 0 ; i < idConectados.length; i++){
               for(let j = 0; j <largoId; j++){
                   if(idConectados[i]==arrayIdVertices[j]){
                        matrizAdy[contador][j] = 1;
                   }
               }
           }
       }
       contador++;
    }
   /*let i=0;
    while(i<matrizAdy.length){
        alert(matrizAdy[i]);
        alert("<br>");
        i++;
    }*/
    return matrizAdy;
}

function potenciaDeUnaMatriz(exp, matriz){
    let i=1;
    var matrizElevada = matriz;
    while(i<exp){
        matrizElevada = math.multiply(matrizElevada, matriz);
        i++;
    }
    return matrizElevada;
}

function matrizIdentidad(dimension){
    let matrizIden = new Array();
    for(let i=0; i<dimension; i++){
        matrizIden[i] = new Array();
        for(let j=0; j<dimension; j++){
            if(i == j){
                matrizIden[i][j] = 1;
            }
            else{
                matrizIden[i][j] = 0;
            }
        }
    }
    return matrizIden;
}

function matrizDeCaminos(){
    if(nodes.length == 0){
        alert("NO SE HA INGRESADO NINGÚN GRAFO");
        return false;
    }
    let matrizAdyacencia = creacionMatrizAd();  
    let matrizCaminos = matrizIdentidad(arrayIdVertices.length) ;
    let matrizAux = [];
    let j=0;

    for(let i=1; i<arrayIdVertices.length; i++){
        matrizAux = potenciaDeUnaMatriz(i, matrizAdyacencia);
        matrizCaminos = math.add(matrizCaminos, matrizAux);
    }
    return matrizCaminos;
}

function mostrarMatrizCaminos(){
    let matrizCaminos = matrizDeCaminos();

    if(matrizCaminos != false){
        let i = 0;
        while(i < matrizCaminos.length){
            alert(matrizCaminos[i]+"\n");
            i++;
        }
    }
}

function conexo(){
    if(nodes.length == 0){
        alert("NO SE HA INGRESADO NINGÚN GRAFO");
        return false;
    }

    let matrizCaminos = matrizDeCaminos(arrayIdVertices);
    for(let i=0; i<matrizCaminos.length; i++){
        for(let j=0; j<matrizCaminos[i].length; j++){
            if(matrizCaminos[i][j] == 0){
                alert("EL GRAFO NO ES CONEXO");
                return false;
            }
        }
    }   
    alert("EL GRAFO ES CONEXO");
    return true;
}

//NOS DICE LOS VERTICES DEL GRAFO TIENEN GRADO MAYOR O IGUAL A 2
function gradoVertices(){
    let i=0;
    let nodosConectados;
    while(i < arrayIdVertices.length){
        nodosConectados = network.getConnectedNodes(arrayIdVertices[i]);
        if(nodosConectados.length < 2){
            return false;
        }
    }
    return true;
}

function revisarNodo(nodosVisitados, matrizAdyacencia, indiceNodo){
    if(nodosVisitados.includes(indiceNodo) || network.getConnectedNodes(arrayIdVertices[indiceNodo]).length == 0){
        return nodosVisitados;
    }
    else{
        nodosVisitados.push(indiceNodo);
        for(let i=0; i<matrizAdyacencia[indiceNodo].length; i++){
            if(matrizAdyacencia[indiceNodo][i] == 1){
                indiceNodo = i;
               // matrizAdyacencia[indiceNodo][i] = 0;
                revisarNodo(nodosVisitados, matrizAdyacencia, indiceNodo);
            }
            //alert("nodosVisitados: " + nodosVisitados);
        }
    }
    return nodosVisitados;
}

function revisarCamino(nodosVisitados){
    let nodoAux = nodosVisitados[(nodosVisitados.length-1)];
    let arrayAux = network.getConnectedNodes(nodosVisitados[0]);
    if(nodosVisitados.length == arrayIdVertices.length){
        if(arrayAux.includes(arrayIdVertices[nodoAux])){
            return true;
        }
        else{
            return false;
        }
    }
}

function caminoHamiltoniano(){
//INTENTAR TRABAJARLO CON LA MATRIZ DE ADYACENCIA
    let nodosVisitados = new Array();
    let indiceNodo = 0;
    let matrizAdyacencia = creacionMatrizAd();
    //alert("matrizAdyacencia: "+matrizAdyacencia);
    nodosVisitados.push(indiceNodo);
    //alert("nodosVisitados: " + nodosVisitados);
    if(conexo() == false){
        alert("EL GRAFO NO ES HAMILTONIANO");
        return false;
    }
    if(gradoVertices() == false){
        alert("EL GRAFO NO ES HAMILTONIANO");
        return false;
    }

    for(let i=0; i<arrayIdVertices.length; i++){
        indiceNodo = i;
        let camino = revisarNodo(nodosVisitados, matrizAdyacencia, indiceNodo);
        alert("camino: " + camino);
        if(revisarCamino(nodosVisitados)){
            alert("EL GRAFO ES HAMILTONIANO");
            return true;
        }
        nodosVisitados = new Array();
    }
    alert("EL GRAFO NO ES HAMILTONIANO");
    return false;
}