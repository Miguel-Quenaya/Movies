//https://api.themoviedb.org/3/search/movie?api_key=5c0aaa9071b6434430476ee43c85f161&query=matrix&language=es
// buscar id del otro https://api.themoviedb.org/3/movie/591955/external_ids?api_key=5c0aaa9071b6434430476ee43c85f161
window.onload = main;

function main(){
    //desactivamos la animación de carga
    loading = document.getElementsByClassName('loading')[0];
    loading.style = 'display:none';
    //Agregamos las escuchas , 1 al boton de busqueda y 1 al teclado para actualizar las "suggestions" cada vez que se tecleamos
    document.getElementById('filmButton').addEventListener('click', buscarPelis, true);
    document.addEventListener('keyup', buscador, true);
}

function buscador(){
    //obtenemos el valor del input
    var texto = document.getElementById('filmSearch').value;
    //Si el tamaño de valor introducido es menor que 3, salimos de la funcion (con esto logramos que enseñe la lista de pelis al introducir como minimo 3 valores al input)
    if(texto.length < 3){
        document.getElementById('suggestions').style = 'display:none'
        return;
    }
    //Separamos las palabras del input en un array para obtener la query necesario para la petición
    var palabrasarray = texto.split(' ');
    var palabras = "&query=" + palabrasarray[0];
    for (let i = 1; i < palabrasarray.length; i++) {
        palabras += '+' + palabrasarray[i];
        
    }
    //Hacemos la peticion de busqueda de peliculas a partir de la query obtenida
    var url = 'https://api.themoviedb.org/3/search/movie';

        key = '?api_key=5c0aaa9071b6434430476ee43c85f161';
        $.ajax({
            type: 'GET',
            url: url + key + palabras + '&lenguage=es',
            async: false,
            global: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                
                arrayJson = json['results'];
                //Una vez obtenida la respuesta llamamos a la función para mostrar los resultados
                mostrarResultados(arrayJson);
                
            },
            error: function(e) {
                console.log(e.message);
            }
    });
}

function mostrarResultados(array){
    var inner = '';
    document.getElementById('suggestions').style = 'display:block'
    //Creamos el html para cada valor de array de peliculas obtenida por la peticion
    for (let i = 0; i < array.length; i++) {
        //<div class="suggest-element" id="624860">The Matrix Resurrections</div>
        inner += '<div class="suggest-element" id="' + array[i]['id'] + '">'+ array[i]['original_title']+ '</div>'       
    }
    //insertamos el html en contenedor correspondiente
    document.getElementById('suggestions').innerHTML = inner;
    resultados = document.getElementsByClassName('suggest-element');
    //Creamos una escucha por cada "suggest-element" para obtener la pagina de cada peli en el IMDB
    for (let i = 0; i< resultados.length; i++) {
      resultados[i].addEventListener('click', redirectFilmPuente,true); 
    }
}

//Creamos esta función para poder reutilizar la funcion "redirectFilm"
function redirectFilmPuente(){
    redirectFilm(this.id);
}

//Funcion para obtener la pagina de la pelicual en el IMDB. El id se obtiene a partir de la de las sugerencias o de la ficha de cada pelicula
function redirectFilm(idPeli){
        $.ajax({
            type: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + idPeli + '/external_ids?api_key=5c0aaa9071b6434430476ee43c85f161',
            async: false,
            global: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                
                if(json["imdb_id"] != null){
                    //Abrimos otra pestaña con la pagina de IMDB
                    window.open("https://www.imdb.com/title/" + json["imdb_id"] + "/?ref_=nv_sr_srsg_3", '_blank').focus();
                }
            },
            error: function(e) {
                console.log(e.message);
            }
    });   
}

//Fucnión llamada a partir del boton de busqueda. 
function buscarPelis(){
    inner = '';
    for (let i = 0; i < arrayJson.length; i++) {
        //Por cada pelicula del ultimo json de pelicuals obtenidas por la query (funcion buscador() ha puesto en global el json de pelis) obtenemos sus detalles
        detallesPeli(arrayJson[i]['id']);
        
    }
}
//función para obtener los detalles de la pelicula correspondiente
function detallesPeli(id){
   
        $.ajax({
            type: 'GET',
            url: 'https://api.themoviedb.org/3/movie/' + id + '?api_key=5c0aaa9071b6434430476ee43c85f161&language=es',
            async: false,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                //una vez obtenido el json llamamos a al funcion para obtener los actores pasando el id de la peli y el json obtenido
                obtenerActores(id, json);
                return; 
            },
            error: function (xhr, status, error) {
                console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
    });
}

//funcion para obtener los actores de la peli correspondiente
function obtenerActores(id, arrayJsonPeli){
    $.ajax({
        type: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + id + '/casts?api_key=5c0aaa9071b6434430476ee43c85f161&language=es',
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            var actores = json['cast'];
            //una vez obtenido los actores llamamos a la funcion para crear el html para la ficha de la pelicula pasando el array de los detalles de la peli y el array de los actores
            generarHtml( arrayJsonPeli, actores);
            return;           
        },
        error: function (xhr, status, error) {
            console.log("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
});
}

//Funcion que crea el html de la ficha de la pelicula correspondiente, se llamara por cada pelicula y logramos acumular el html de fichas de todas las peliculas
function generarHtml(arrayJsonPeli, actores){
        inner += '<div class="col-md-4"><div class="card mb-4 box-shadow"><img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" style="width: 100%; display: block;" src="https://image.tmdb.org/t/p/w500' + arrayJsonPeli['poster_path'] + '" data-holder-rendered="true"><div class="card-body text-center"><h5 class="card-title text-center">' + arrayJsonPeli['title'] + '</h5><div><small class="text-muted"><i class="bi bi-film mx-2"> </i>' + actoresCategorias(arrayJsonPeli['genres'], false) + '</small></div><div><small class="text-muted"><i class="bi bi-calendar3 mx-2"> </i>' + arrayJsonPeli['release_date'] + '</small></div><small class="text-muted"><i class="bi bi-people mx-2"></i>' + actoresCategorias(actores, true) + '</small></div><div class="card-footer bg-primary text-white text-center"><a href="javascript:redirectFilm(' + arrayJsonPeli['id'] + ')" class="text-white"><i class="bi bi-eye"></i> Veure fitxa a IMDB</a></div></div></div>' ;
        return;
}

//función que utilizaremos para obtener el los nombres de los actores o de las categorias
function actoresCategorias(array, boolean){
    
    if(array.length > 0){
        var nombres = array[0]['name'];

    if(array.length > 1){
        for (let i = 1; i < array.length; i++) {
            nombres += ', ' + array[i]['name'];
            //el boolean lo utilizamos para que mostremos como maximo 4 actores
            if(boolean && i == 3){
                return nombres;
            }
            
        }
    }
    return nombres;
    }
    return '';
}

//Funciones para controlar la animación de carga
$(document).ajaxStart(function(){
    loading.style = 'display: block';
});
$(document).ajaxStop(function(){
    loading.style = 'display: none';
    document.getElementById('movies').innerHTML = inner;
    document.getElementById('suggestions').style = 'display:none';
});
